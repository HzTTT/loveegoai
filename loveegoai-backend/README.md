# Love Ego AI - 后端API

> 心理健康与冥想AI助手后端服务

## 🎯 技术栈

- **框架**: FastAPI + Python 3.9+
- **数据库**: MongoDB (Motor异步驱动)
- **LLM**: 通义千问 (Qwen)
- **向量数据库**: Pinecone Starter (免费)
- **TTS**: Edge-TTS (免费)
- **认证**: JWT

## 📦 项目结构

```
loveegoai-backend/
├── app/
│   ├── api/              # API路由
│   ├── core/             # 核心模块 (数据库、安全)
│   ├── models/           # 数据模型
│   ├── schemas/          # Pydantic数据验证
│   ├── services/         # 业务逻辑服务
│   ├── utils/            # 工具函数
│   ├── config.py         # 配置管理
│   └── main.py           # FastAPI主应用
├── knowledge_base/       # 知识库文件
│   ├── changemind/       # 转念知识库
│   ├── meditation/       # 冥想知识库
│   └── letters/          # 信件知识库
├── static/               # 静态文件
│   ├── audios/           # 生成的音频文件
│   └── letter_covers/    # 信件封面图片
├── .env                  # 环境变量 (不提交到Git)
├── .env.example          # 环境变量示例
├── requirements.txt      # Python依赖
└── README.md             # 项目文档
```

## 🚀 快速开始

### 1. 安装依赖

```bash
# 创建虚拟环境 (推荐)
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`,并填写以下配置:

```env
# 通义千问API密钥
QWEN_API_KEY=your_qwen_api_key_here

# Pinecone API密钥 (已配置)
PINECONE_API_KEY=pcsk_...

# MongoDB连接 (默认本地)
MONGODB_URL=mongodb://localhost:27017
```

### 3. 启动MongoDB

确保MongoDB已启动:

```bash
# 检查MongoDB是否运行
mongod --version
```

如果没有安装MongoDB,可以使用Docker:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. 启动服务器

```bash
# 方式1: 直接运行
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 方式2: 使用main.py
python app/main.py
```

服务器启动后访问:
- API文档: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

## 📡 API端点

### 认证 (Auth)
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/refresh` - 刷新Token

### 用户 (User)
- `GET /api/v1/user/profile` - 获取用户信息
- `PUT /api/v1/user/profile` - 更新用户信息
- `PUT /api/v1/user/avatar` - 更新头像

### 聊天 (Chat)
- `POST /api/v1/chat/message` - 发送消息
- `GET /api/v1/chat/history` - 获取聊天历史

### 冥想 (Meditation)
- `GET /api/v1/meditation/list` - 获取冥想列表
- `POST /api/v1/meditation/generate` - 生成冥想音频

### 信件 (Letters)
- `GET /api/v1/letters/today` - 获取今日信件
- `GET /api/v1/letters/history` - 获取历史信件

## 🧠 核心功能

### RAG智能检索

项目使用RAG (Retrieval-Augmented Generation) 技术:

1. **向量化**: 使用通义千问Embedding将文档转为向量
2. **存储**: 存入Pinecone向量数据库 (3个命名空间)
3. **检索**: 根据用户问题检索相关文档
4. **生成**: 将检索结果作为上下文,由LLM生成回复

### 知识库结构

- **changemind**: 转念知识库 (认知行为疗法、情绪调节)
- **meditation**: 冥想知识库 (正念、呼吸练习、放松技巧)
- **letters**: 信件知识库 (心理学、哲学、自然疗愈)

### 智能对话模式

1. **默认模式**: 使用转念知识库
2. **Change Mind模式**: 明确使用转念知识库
3. **Meditation模式**: 切换到冥想知识库
4. **自动检测**: 检测用户消息中的"冥想"关键词自动切换

## 📝 待开发功能

- [ ] 完成所有API路由实现
- [ ] 导入知识库数据到Pinecone
- [ ] 实现定时任务(每日信件生成)
- [ ] 添加用户认证和权限控制
- [ ] 实现冥想音频生成和管理
- [ ] 完善错误处理和日志记录
- [ ] 编写单元测试
- [ ] 性能优化

## 🔧 开发中

当前已完成:
- ✅ 项目结构搭建
- ✅ 配置管理
- ✅ MongoDB连接
- ✅ JWT认证
- ✅ 通义千问LLM集成
- ✅ Pinecone向量数据库集成
- ✅ RAG智能检索服务
- ✅ Edge-TTS语音合成

正在开发:
- 🔄 API路由实现
- 🔄 数据模型定义
- 🔄 知识库导入工具

## 📞 联系方式

如有问题,请联系项目维护者。

---

Made with ❤️ by Love Ego AI Team
