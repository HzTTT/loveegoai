"""
向量数据库服务: Pinecone
"""
from pinecone import Pinecone, ServerlessSpec
from typing import Any, Dict, List, Optional
from openai import AsyncOpenAI
from app.config import settings


class VectorService:
    """Pinecone向量数据库服务"""

    def __init__(self):
        # 初始化Pinecone
        self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        self.index_name = settings.PINECONE_INDEX_NAME

        # 通义千问Embedding (兼容OpenAI，加长超时)
        self.embed_client = AsyncOpenAI(
            api_key=settings.QWEN_API_KEY,
            base_url=settings.QWEN_BASE_URL,
            timeout=30.0,
        )

        # 复用 index 连接
        self._index = None

        # 确保索引存在
        self._ensure_index()

    def _ensure_index(self):
        """确保索引存在,不存在则创建"""
        try:
            # 检查索引是否存在
            existing_indexes = [idx.name for idx in self.pc.list_indexes()]

            if self.index_name not in existing_indexes:
                print(f"[CREATE] Creating Pinecone index: {self.index_name}")

                # 创建Serverless索引 (免费)
                self.pc.create_index(
                    name=self.index_name,
                    dimension=1536,  # text-embedding-ada-002维度
                    metric="cosine",
                    spec=ServerlessSpec(
                        cloud="aws",
                        region="us-east-1"
                    )
                )
                print(f"[OK] Pinecone index created: {self.index_name}")
            else:
                print(f"[OK] Pinecone index exists: {self.index_name}")

        except Exception as e:
            print(f"[ERROR] Pinecone index creation failed: {e}")
            raise

    def get_index(self):
        """获取索引实例（复用连接）"""
        if self._index is None:
            self._index = self.pc.Index(self.index_name)
        return self._index

    async def get_embedding(self, text: str) -> List[float]:
        """
        获取文本的向量表示

        Args:
            text: 文本内容

        Returns:
            向量 (1536维)
        """
        try:
            response = await self.embed_client.embeddings.create(
                model="text-embedding-v1",  # 通义千问embedding模型
                input=text
            )
            return response.data[0].embedding

        except Exception as e:
            print(f"[ERROR] Embedding生成失败: {e}")
            raise

    async def upsert_documents(
        self,
        documents: List[Dict[str, str]],
        namespace: str = "default"
    ):
        """
        批量插入文档到向量库

        Args:
            documents: 文档列表 [{"id": "1", "text": "...", "metadata": {...}}]
            namespace: 命名空间 (changemind/meditation/letters)
        """
        index = self.get_index()
        vectors = []

        for doc in documents:
            # 生成向量
            embedding = await self.get_embedding(doc["text"])

            vectors.append({
                "id": doc["id"],
                "values": embedding,
                "metadata": {
                    "text": doc["text"],
                    **doc.get("metadata", {})
                }
            })

        # 批量上传
        index.upsert(vectors=vectors, namespace=namespace)
        print(f"[OK] Upserted {len(vectors)} vectors to namespace: {namespace}")

    async def search(
        self,
        query: str,
        namespace: str = "default",
        top_k: int = 5,
        metadata_filter: Optional[Dict[str, Any]] = None,
        query_embedding: Optional[List[float]] = None,
    ) -> List[Dict]:
        """
        语义搜索

        Args:
            query: 查询文本
            namespace: 命名空间
            top_k: 返回Top K结果

        Returns:
            搜索结果列表
        """
        # 查询向量
        if query_embedding is None:
            query_embedding = await self.get_embedding(query)

        # 检索
        index = self.get_index()
        results = index.query(
            vector=query_embedding,
            top_k=top_k,
            namespace=namespace,
            include_metadata=True,
            filter=metadata_filter,
        )

        # 格式化结果
        docs = []
        for match in results.matches:
            docs.append({
                "id": match.id,
                "score": match.score,
                "text": match.metadata.get("text", ""),
                "metadata": match.metadata
            })

        return docs

    async def delete_namespace(self, namespace: str):
        """删除整个命名空间"""
        index = self.get_index()
        index.delete(delete_all=True, namespace=namespace)
        print(f"[OK] Deleted namespace: {namespace}")


# 创建全局向量服务实例
vector_service = VectorService()
