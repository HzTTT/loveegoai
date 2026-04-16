"""
重新导入完整的转念.docx到Pinecone（替换当前12KB的精简版）
原始文件：桌面上的转念.docx (~143KB, ~10万字)
"""
import sys
import os
import asyncio
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from docx import Document
from app.services.vector_service import vector_service
from app.services.rag_service import rag_service


def process_docx(file_path: str):
    """处理docx文件，提取段落"""
    doc = Document(file_path)
    paragraphs = []

    for para in doc.paragraphs:
        text = para.text.strip()
        if text and len(text) > 10:
            paragraphs.append(text)

    return paragraphs


def chunk_text(paragraphs: list, chunk_size: int = 500):
    """将段落分块"""
    chunks = []
    current_chunk = ""

    for para in paragraphs:
        if len(current_chunk) + len(para) + 2 <= chunk_size:
            if current_chunk:
                current_chunk += "\n\n" + para
            else:
                current_chunk = para
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())

            if len(para) > chunk_size:
                sentences = para.replace('。', '。|').replace('！', '！|').replace('？', '？|').split('|')
                current_chunk = ""
                for sent in sentences:
                    sent = sent.strip()
                    if not sent:
                        continue
                    if len(current_chunk) + len(sent) + 1 <= chunk_size:
                        if current_chunk:
                            current_chunk += " " + sent
                        else:
                            current_chunk = sent
                    else:
                        if current_chunk:
                            chunks.append(current_chunk.strip())
                        current_chunk = sent
            else:
                current_chunk = para

    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks


async def main():
    file_path = "C:/Users/Xiayu Zhang/Desktop/转念.docx"

    if not os.path.exists(file_path):
        print(f"[ERROR] 文件不存在: {file_path}")
        return

    file_size = os.path.getsize(file_path)
    print(f"\n{'='*60}")
    print(f"重新导入转念知识库")
    print(f"文件: {file_path} ({file_size:,} bytes)")
    print(f"{'='*60}\n")

    # 1. 读取文档
    print(">> 步骤1: 读取docx...")
    paragraphs = process_docx(file_path)
    total_chars = sum(len(p) for p in paragraphs)
    print(f"   段落数: {len(paragraphs)}")
    print(f"   总字符数: {total_chars:,}")

    # 2. 分块
    print("\n>> 步骤2: 文本分块 (chunk_size=500)...")
    chunks = chunk_text(paragraphs, chunk_size=500)
    print(f"   生成chunk数: {len(chunks)}")
    print(f"   平均chunk长度: {sum(len(c) for c in chunks) // len(chunks)} 字符")

    # 3. 清空旧数据
    print("\n>> 步骤3: 清空旧的changemind命名空间...")
    await vector_service.delete_namespace("changemind")
    print("   已清空")

    # 4. 分批上传（每批20个，避免超时）
    print(f"\n>> 步骤4: 上传到Pinecone ({len(chunks)} 个文档)...")
    batch_size = 20
    total_uploaded = 0

    for batch_start in range(0, len(chunks), batch_size):
        batch_end = min(batch_start + batch_size, len(chunks))
        batch_docs = []

        for i in range(batch_start, batch_end):
            batch_docs.append({
                "id": f"changemind_{i}",
                "text": chunks[i],
                "metadata": {
                    "source": "转念知识库",
                    "chunk_index": i,
                    "namespace": "changemind"
                }
            })

        await vector_service.upsert_documents(batch_docs, "changemind")
        total_uploaded += len(batch_docs)
        print(f"   已上传: {total_uploaded}/{len(chunks)} ({total_uploaded*100//len(chunks)}%)")

    # 5. 验证
    print(f"\n>> 步骤5: 验证...")
    results = await vector_service.search("我觉得自己一无是处", "changemind", top_k=3)
    print(f"   测试搜索: 找到 {len(results)} 个结果")
    for i, r in enumerate(results):
        print(f"   [{i+1}] score={r['score']:.4f}, text={r['text'][:80]}...")

    print(f"\n{'='*60}")
    print(f"导入完成! 共上传 {total_uploaded} 个文档")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    asyncio.run(main())
