"""
MongoDB 数据库连接
"""
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings

# 全局数据库连接
mongo_client: AsyncIOMotorClient = None
database: AsyncIOMotorDatabase = None


async def connect_db():
    """连接MongoDB数据库"""
    global mongo_client, database

    print(f">> Connecting to MongoDB: {settings.MONGODB_URL}")

    mongo_client = AsyncIOMotorClient(settings.MONGODB_URL)
    database = mongo_client[settings.MONGODB_DB_NAME]

    # 测试连接
    try:
        await mongo_client.admin.command('ping')
        print(f">> MongoDB connected: {settings.MONGODB_DB_NAME}")
    except Exception as e:
        print(f">> MongoDB connection failed: {e}")
        raise


async def close_db():
    """关闭MongoDB连接"""
    global mongo_client

    if mongo_client:
        mongo_client.close()
        print(">> MongoDB connection closed")


def get_database() -> AsyncIOMotorDatabase:
    """获取数据库实例"""
    return database


# Collection快捷访问
def get_users_collection():
    """获取用户集合"""
    return database.users


def get_chat_sessions_collection():
    """获取聊天会话集合"""
    return database.chat_sessions


def get_chat_messages_collection():
    """获取聊天消息集合"""
    return database.chat_messages


def get_meditations_collection():
    """获取冥想集合"""
    return database.meditations


def get_letters_collection():
    """获取信件集合"""
    return database.letters


def get_user_profiles_collection():
    """获取用户画像集合"""
    return database.user_profiles
