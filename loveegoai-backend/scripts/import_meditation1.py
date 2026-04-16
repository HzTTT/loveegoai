"""
追加导入冥想1.docx到Pinecone meditation命名空间
"""
import sys
import os
import asyncio
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from docx import Document
from app.services.vector_service import vector_service


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
    file_path = "C:/Users/Xiayu Zhang/Desktop/冥想1.docx"

    if not os.path.exists(file_path):
        print(f"[ERROR] 文件不存在: {file_path}")
        return

    file_size = os.path.getsize(file_path)
    print(f"\n{'='*60}")
    print(f"追加导入冥想1到meditation知识库")
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

    # 3. 上传（用 meditation_docx_ 前缀避免和已有数据ID冲突）
    print(f"\n>> 步骤3: 追加上传到Pinecone meditation命名空间...")
    batch_size = 20
    total_uploaded = 0

    for batch_start in range(0, len(chunks), batch_size):
        batch_end = min(batch_start + batch_size, len(chunks))
        batch_docs = []
        for i in range(batch_start, batch_end):
            batch_docs.append({
                "id": f"meditation_docx_{i}",
                "text": chunks[i],
                "metadata": {
                    "source": "冥想1.docx",
                    "chunk_index": i,
                    "namespace": "meditation"
                }
            })
        await vector_service.upsert_documents(batch_docs, "meditation")
        total_uploaded += len(batch_docs)
        print(f"   已上传: {total_uploaded}/{len(chunks)} ({total_uploaded*100//len(chunks)}%)")

    # 4. 验证
    print(f"\n>> 步骤4: 验证...")
    results = await vector_service.search("放松呼吸冥想", "meditation", top_k=3)
    print(f"   测试搜索: 找到 {len(results)} 个结果")
    for i, r in enumerate(results):
        print(f"   [{i+1}] score={r['score']:.4f}, text={r['text'][:80]}...")

    print(f"\n{'='*60}")
    print(f"导入完成! 共追加 {total_uploaded} 个文档到meditation")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    asyncio.run(main())
