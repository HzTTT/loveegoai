"""
Import markdown knowledge bases into Pinecone.
"""
import asyncio
import os
import sys
from pathlib import Path
from typing import Dict, List

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.rag_service import rag_service
from app.services.changemind_persona_service import changemind_persona_service
from app.services.skill_service import skill_service
from app.services.vector_service import vector_service


async def delete_legacy_changemind_documents() -> int:
    """Delete legacy coarse changemind chunks with ids like `changemind_42`."""
    index = vector_service.get_index()
    legacy_ids: List[str] = []
    prefix = "changemind_"

    for page in index.list(namespace=rag_service.NAMESPACE_CHANGEMIND):
        for vector_id in page:
            if vector_id.startswith(prefix) and vector_id[len(prefix):].isdigit():
                legacy_ids.append(vector_id)

    if not legacy_ids:
        print("No legacy changemind chunks found.\n")
        return 0

    batch_size = 100
    for start in range(0, len(legacy_ids), batch_size):
        batch = legacy_ids[start:start + batch_size]
        index.delete(ids=batch, namespace=rag_service.NAMESPACE_CHANGEMIND)

    print(f"Deleted {len(legacy_ids)} legacy changemind chunks.\n")
    return len(legacy_ids)


async def delete_documents_by_prefix(namespace: str, prefixes: List[str]) -> int:
    """Delete existing documents whose ids start with any provided prefix."""
    index = vector_service.get_index()
    matched_ids: List[str] = []

    for page in index.list(namespace=namespace):
        for vector_id in page:
            if any(vector_id.startswith(prefix) for prefix in prefixes):
                matched_ids.append(vector_id)

    if not matched_ids:
        print(f"No documents found for prefixes: {prefixes}\n")
        return 0

    batch_size = 100
    for start in range(0, len(matched_ids), batch_size):
        batch = matched_ids[start:start + batch_size]
        index.delete(ids=batch, namespace=namespace)

    print(f"Deleted {len(matched_ids)} documents for prefixes: {prefixes}\n")
    return len(matched_ids)


async def process_markdown(file_path: str) -> List[str]:
    """Read a markdown file and extract paragraphs."""
    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()

    paragraphs: List[str] = []
    current_paragraph: List[str] = []

    for raw_line in content.split("\n"):
        line = raw_line.strip()
        if line:
            current_paragraph.append(line)
            continue

        if current_paragraph:
            paragraph_text = " ".join(current_paragraph)
            if len(paragraph_text) > 20:
                paragraphs.append(paragraph_text)
            current_paragraph = []

    if current_paragraph:
        paragraph_text = " ".join(current_paragraph)
        if len(paragraph_text) > 20:
            paragraphs.append(paragraph_text)

    return paragraphs


async def chunk_text(paragraphs: List[str], chunk_size: int = 800) -> List[str]:
    """Combine paragraphs into chunks that stay under the size limit."""
    chunks: List[str] = []
    current_chunk = ""

    for paragraph in paragraphs:
        if len(current_chunk) + len(paragraph) + 2 <= chunk_size:
            current_chunk = f"{current_chunk}\n\n{paragraph}".strip()
            continue

        if current_chunk:
            chunks.append(current_chunk.strip())

        if len(paragraph) <= chunk_size:
            current_chunk = paragraph
            continue

        current_chunk = ""
        sentences = (
            paragraph.replace("。", "。|")
            .replace("！", "！|")
            .replace("？", "？|")
            .split("|")
        )
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            if len(current_chunk) + len(sentence) + 1 <= chunk_size:
                current_chunk = f"{current_chunk} {sentence}".strip()
            else:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = sentence

    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks


async def import_documents(documents: List[Dict[str, object]], namespace: str, name: str) -> int:
    """Upload pre-built documents into Pinecone."""
    print(f"\n{'=' * 60}")
    print(f"Processing: {name}")
    print(f"Namespace: {namespace}")
    print(f"Documents: {len(documents)}")
    print(f"{'=' * 60}\n")

    if not documents:
        print("No documents to upload.\n")
        return 0

    await vector_service.upsert_documents(documents, namespace)

    test_query = documents[0]["text"][:80]
    results = await vector_service.search(test_query, namespace=namespace, top_k=3)
    print(f"Verification search found {len(results)} result(s).")
    if results:
        print(f"Highest similarity: {results[0].get('score', 0):.4f}")

    print(f"\n{name} import completed.\n")
    return len(documents)


async def import_knowledge_base(file_paths: List[str], namespace: str, name: str) -> int:
    """Import a plain markdown knowledge base."""
    print(f"\n{'=' * 60}")
    print(f"Processing: {name}")
    print(f"Files: {len(file_paths)}")
    print(f"Namespace: {namespace}")
    print(f"{'=' * 60}\n")

    all_paragraphs: List[str] = []
    for file_path in file_paths:
        if os.path.exists(file_path):
            print(f"Reading: {os.path.basename(file_path)}")
            paragraphs = await process_markdown(file_path)
            all_paragraphs.extend(paragraphs)
        else:
            print(f"WARNING: File not found - {file_path}")

    print(f"Total paragraphs extracted: {len(all_paragraphs)}")
    chunks = await chunk_text(all_paragraphs, chunk_size=800)
    print(f"Total chunks created: {len(chunks)}")

    documents = []
    for index, chunk in enumerate(chunks):
        documents.append(
            {
                "id": f"{namespace}_{index}",
                "text": chunk,
                "metadata": {
                    "source": name,
                    "chunk_index": index,
                    "namespace": namespace,
                },
            }
        )

    return await import_documents(documents, namespace, name)


async def main():
    """Run all imports."""
    print("\n" + "=" * 60)
    print("Markdown Knowledge Base Import Tool")
    print("=" * 60 + "\n")

    backend_root = Path(__file__).resolve().parents[1]
    knowledge_root = backend_root / "knowledge"

    knowledge_bases = [
        {
            "files": [
                str(knowledge_root / "meditation_original_optimized_1-8.md"),
                str(knowledge_root / "meditation_original_optimized_9-16.md"),
                str(knowledge_root / "meditation_sample.md"),
                str(knowledge_root / "meditation_new_additions.md"),
                str(knowledge_root / "meditation_chakras.md"),
            ],
            "namespace": rag_service.NAMESPACE_MEDITATION,
            "name": "Meditation knowledge base",
        },
        {
            "files": [str(knowledge_root / "letters_optimized.md")],
            "namespace": rag_service.NAMESPACE_LETTERS,
            "name": "Letters knowledge base",
        },
    ]

    total_docs = 0

    for knowledge_base in knowledge_bases:
        try:
            total_docs += await import_knowledge_base(
                knowledge_base["files"],
                knowledge_base["namespace"],
                knowledge_base["name"],
            )
        except Exception as exc:
            print(f"\nERROR importing {knowledge_base['name']}: {exc}\n")

    try:
        await delete_legacy_changemind_documents()
    except Exception as exc:
        print(f"\nERROR deleting legacy changemind chunks: {exc}\n")

    try:
        await delete_documents_by_prefix(
            rag_service.NAMESPACE_CHANGEMIND,
            [changemind_persona_service.DOC_ID_PREFIX],
        )
        persona_documents = changemind_persona_service.get_retrieval_documents()
        total_docs += await import_documents(
            persona_documents,
            rag_service.NAMESPACE_CHANGEMIND,
            "Changemind structured persona",
        )
    except Exception as exc:
        print(f"\nERROR importing Changemind structured persona: {exc}\n")

    try:
        skill_documents = skill_service.get_retrieval_documents()
        total_docs += await import_documents(
            skill_documents,
            rag_service.NAMESPACE_CHANGEMIND,
            "LoveEgo structured skill",
        )
    except Exception as exc:
        print(f"\nERROR importing LoveEgo structured skill: {exc}\n")

    print("\n" + "=" * 60)
    print("Import completed!")
    print(f"Total documents imported: {total_docs}")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
