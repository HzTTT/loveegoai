"""
导入知识库数据到Pinecone
"""
import sys
import os
import asyncio
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from docx import Document
from app.services.vector_service import vector_service
from app.services.rag_service import rag_service


async def process_docx(file_path: str):
    """处理docx文件，提取段落"""
    doc = Document(file_path)
    paragraphs = []

    for para in doc.paragraphs:
        text = para.text.strip()
        if text and len(text) > 10:  # 过滤太短的段落
            paragraphs.append(text)

    return paragraphs


async def chunk_text(paragraphs: list, chunk_size: int = 500):
    """将段落分块，确保不超过chunk_size字符"""
    chunks = []
    current_chunk = ""

    for para in paragraphs:
        # 如果当前段落加上已有内容不超过chunk_size，则合并
        if len(current_chunk) + len(para) + 1 <= chunk_size:
            current_chunk += para + "\n"
        else:
            # 保存当前chunk
            if current_chunk:
                chunks.append(current_chunk.strip())
            # 如果单个段落超过chunk_size，需要分割
            if len(para) > chunk_size:
                # 按句子分割
                sentences = para.replace('。', '。|').replace('！', '！|').replace('？', '？|').split('|')
                current_chunk = ""
                for sent in sentences:
                    if len(current_chunk) + len(sent) <= chunk_size:
                        current_chunk += sent
                    else:
                        if current_chunk:
                            chunks.append(current_chunk.strip())
                        current_chunk = sent
            else:
                current_chunk = para + "\n"

    # 添加最后一个chunk
    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks


async def import_knowledge_base(file_path: str, namespace: str, name: str):
    """导入单个知识库"""
    print(f"\n{'='*60}")
    print(f"正在处理: {name}")
    print(f"文件路径: {file_path}")
    print(f"命名空间: {namespace}")
    print(f"{'='*60}\n")

    # 1. 读取文档
    print(">> 步骤1: 读取文档...")
    paragraphs = await process_docx(file_path)
    print(f"   提取段落数: {len(paragraphs)}")

    # 2. 分块
    print(">> 步骤2: 文本分块...")
    chunks = await chunk_text(paragraphs, chunk_size=500)
    print(f"   生成块数: {len(chunks)}")

    # 3. 准备文档数据
    print(">> 步骤3: 准备向量数据...")
    documents = []
    for i, chunk in enumerate(chunks):
        documents.append({
            "id": f"{namespace}_{i}",
            "text": chunk,
            "metadata": {
                "source": name,
                "chunk_index": i,
                "namespace": namespace
            }
        })

    # 4. 上传到Pinecone
    print(">> 步骤4: 上传到Pinecone...")
    print(f"   开始上传 {len(documents)} 个文档...")

    try:
        await vector_service.upsert_documents(documents, namespace)
        print(f"   成功! {len(documents)} 个文档已上传到命名空间 '{namespace}'")
    except Exception as e:
        print(f"   错误: {str(e)}")
        raise

    # 5. 验证
    print(">> 步骤5: 验证导入...")
    test_query = chunks[0][:50] if chunks else "测试"
    results = await vector_service.search(test_query, namespace, top_k=3)
    print(f"   测试检索: 找到 {len(results)} 个结果")
    if results:
        print(f"   最高相似度: {results[0].get('score', 0):.4f}")

    print(f"\n{'='*60}")
    print(f"{name} 导入完成!")
    print(f"{'='*60}\n")

    return len(documents)


async def main():
    """主函数"""
    print("\n" + "="*60)
    print("知识库数据导入工具")
    print("="*60 + "\n")

    # 定义知识库
    knowledge_bases = [
        {
            "file": "C:/Users/Xiayu Zhang/Desktop/转念.docx",
            "namespace": rag_service.NAMESPACE_CHANGEMIND,
            "name": "转念知识库"
        },
        {
            "file": "C:/Users/Xiayu Zhang/Desktop/冥想.docx",
            "namespace": rag_service.NAMESPACE_MEDITATION,
            "name": "冥想知识库"
        }
    ]

    total_docs = 0

    # 依次导入
    for kb in knowledge_bases:
        if os.path.exists(kb["file"]):
            count = await import_knowledge_base(
                kb["file"],
                kb["namespace"],
                kb["name"]
            )
            total_docs += count
        else:
            print(f"警告: 文件不存在 - {kb['file']}")

    print("\n" + "="*60)
    print("导入完成!")
    print(f"总计导入文档数: {total_docs}")
    print("="*60 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
