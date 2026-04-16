# 冥想引导完整流程：LLM 动态生成 + 停顿标记

## 🎯 问题与解决方案

### 核心问题
**"每次 LLM 生成新的冥想内容，要如何实现停顿？"**

### 解决方案
通过 **Prompt Engineering + RAG 示例学习** 让 LLM 自动在合适位置插入停顿标记。

---

## 📊 完整流程图

```
用户请求
   ↓
[API: meditation.py]
   ↓
① RAG Service
   ├─→ 从冥想知识库检索相关示例（带停顿标记）
   └─→ 作为 context_docs 传递给 LLM
   ↓
② LLM Service
   ├─→ System Prompt: 明确要求使用 [停顿X秒] 格式
   ├─→ Context: 知识库示例（停顿节奏参考）
   └─→ 生成带停顿标记的冥想脚本
   ↓
   脚本示例:
   "Hello，大家好，我是梦琪。[停顿2秒]
    今天我们来练习放松冥想。[停顿1秒]
    闭上你的眼睛，[停顿2秒]
    深呼吸三次。[停顿3秒]"
   ↓
③ TTS Service (支持停顿)
   ├─→ 正则分割文本: 普通文本 vs 停顿标记
   ├─→ 普通文本 → Edge-TTS 生成语音
   ├─→ 停顿标记 → pydub 生成静音片段
   └─→ 拼接所有音频片段
   ↓
最终音频 (MP3)
   ↓
返回给用户
```

---

## 🔧 技术实现细节

### 1. Prompt Engineering (核心!)

**llm_service.py - generate_meditation_script()**

```python
system_prompt = f"""你是一位专业的冥想引导师梦琪。

⭐️ 关键要求 - 停顿标记格式:
- 必须使用 [停顿1秒], [停顿2秒], [停顿3秒] 这种格式表示停顿
- 不要用 ... 或其他符号，必须用方括号标记
- 在需要用户感受、呼吸、思考的地方加停顿

停顿使用规则:
- [停顿1秒]: 短暂停顿，用于语句之间
- [停顿2秒]: 中等停顿，用于呼吸、感受
- [停顿3秒]: 长停顿，用于深度体验、内观

示例格式:
"Hello，大家好，我是梦琪。[停顿2秒]
今天我们来练习边界冥想。[停顿1秒]
闭上你的眼睛，[停顿2秒]"
"""
```

**关键点**:
- ✅ 明确指定标记格式 `[停顿X秒]`
- ✅ 说明何时使用1秒/2秒/3秒
- ✅ 提供示例格式
- ✅ 强调"必须用方括号"

---

### 2. RAG 示例学习

**rag_service.py - generate_meditation_script()**

```python
async def generate_meditation_script(
    self,
    user_need: str,
    duration: int = 10,
    top_k: int = 2
) -> str:
    # 1. 从冥想知识库检索相关示例
    relevant_docs = await self.vector.search(
        query=user_need,
        namespace=self.NAMESPACE_MEDITATION,
        top_k=top_k
    )

    context_docs = [doc["text"] for doc in relevant_docs]

    # 2. 调用LLM，传入示例
    script = await self.llm.generate_meditation_script(
        user_need=user_need,
        duration=duration,
        context_docs=context_docs  # ⭐️ 示例学习
    )

    return script
```

**知识库示例格式**:
```markdown
## 边界冥想引导

Hello，大家好，我是梦琪。[停顿2秒]
今天我们来练习边界冥想。[停顿1秒]

首先，找一个舒适的姿势。[停顿2秒]
闭上你的眼睛。[停顿2秒]

深呼吸三次。[停顿3秒]
吸气，[停顿1秒]呼气。[停顿2秒]
吸气，[停顿1秒]呼气。[停顿3秒]

现在想象一个圆圈围绕着你的身体。[停顿2秒]
这个圆圈代表你的边界。[停顿3秒]
```

**关键点**:
- ✅ 知识库中的冥想引导必须包含停顿标记
- ✅ LLM 通过 RAG 学习停顿的节奏和位置
- ✅ 不同主题的冥想有不同的停顿风格

---

### 3. TTS 停顿处理

**tts_service.py - _generate_audio_with_pause()**

```python
async def _generate_audio_with_pause(self, text, audio_path, rate, volume):
    # 1. 正则分割文本
    pattern = r'(\[停顿(\d+)秒\])'
    segments = re.split(pattern, text)

    audio_segments = []

    for segment in segments:
        pause_match = re.match(r'\[停顿(\d+)秒\]', segment)

        if pause_match:
            # 2. 停顿标记 → 生成静音
            duration = int(pause_match.group(1))
            silence = generate_silence(duration=duration * 1000)
            audio_segments.append(silence)

        else:
            # 3. 普通文本 → TTS生成语音
            communicate = edge_tts.Communicate(text=segment, ...)
            await communicate.save(temp_file)
            audio_segment = AudioSegment.from_mp3(temp_file)
            audio_segments.append(audio_segment)

    # 4. 拼接所有音频
    combined = audio_segments[0]
    for seg in audio_segments[1:]:
        combined += seg

    combined.export(audio_path, format="mp3")
```

**关键点**:
- ✅ 停顿标记不会被读出来
- ✅ 真正插入静音片段
- ✅ 支持任意秒数停顿

---

## 🧪 测试步骤

### 步骤1: 安装依赖

```bash
pip install pydub
```

安装 ffmpeg:
- Windows: 下载 ffmpeg 并添加到 PATH
- 或者: `conda install -c conda-forge ffmpeg`

### 步骤2: 测试 LLM 生成

```bash
python test_meditation_with_rag.py
```

检查生成的脚本是否包含 `[停顿X秒]` 标记。

### 步骤3: 测试完整流程

```bash
# 启动后端
python main.py

# 调用API
POST http://localhost:8000/api/meditation/generate
{
    "user_input": "帮我生成一个关于放松的冥想引导",
    "duration": 5
}
```

播放返回的音频，验证停顿效果。

---

## 📋 待办清单

为了让整个流程正常工作，你需要：

- [ ] ✅ 已完成: 更新 LLM Service prompt（支持停顿标记）
- [ ] ✅ 已完成: 添加 RAG Service 冥想生成方法
- [ ] ✅ 已完成: 更新 Meditation API 使用 RAG
- [ ] ✅ 已完成: 更新 TTS Service 支持停顿
- [ ] ⏳ **重要**: 优化冥想知识库，添加停顿标记（16个引导）
- [ ] ⏳ 安装 pydub 和 ffmpeg
- [ ] ⏳ 测试 LLM 是否生成停顿标记
- [ ] ⏳ 测试 TTS 停顿效果
- [ ] ⏳ 导入优化后的知识库到 Pinecone

---

## 🎯 关键成功因素

### 1. Prompt 必须明确且严格

❌ 错误示例:
```
"适当的停顿提示(用...表示)"
```

✅ 正确示例:
```
"必须使用 [停顿1秒], [停顿2秒], [停顿3秒] 这种格式表示停顿
不要用 ... 或其他符号，必须用方括号标记"
```

### 2. 知识库示例必须规范

知识库中的 16 个冥想引导必须:
- 全部使用 `[停顿X秒]` 格式
- 停顿位置合理（呼吸后、指令后、体验时）
- 提供多种停顿节奏的示例

### 3. 测试验证

生成脚本后检查:
```python
pause_count = script.count("[停顿")
if pause_count < 5:
    print("⚠️ 停顿标记太少，LLM可能没有正确理解prompt")
```

---

## 📚 相关文件

- `app/services/llm_service.py` - LLM生成冥想脚本（含停顿标记）
- `app/services/rag_service.py` - RAG检索知识库示例
- `app/services/tts_service.py` - TTS处理停顿标记
- `app/api/meditation.py` - 冥想生成API
- `test_meditation_with_rag.py` - 完整流程测试
- `knowledge/meditation_optimization_plan.md` - 冥想知识库优化方案

---

## 🎉 总结

**问题**: 每次 LLM 生成新的冥想内容，如何实现停顿？

**答案**:
1. **Prompt 明确要求** LLM 使用 `[停顿X秒]` 格式
2. **RAG 提供示例** 让 LLM 学习停顿节奏
3. **TTS 识别标记** 分段生成+插入静音

这样，每次 LLM 生成新的冥想内容时，都会自动包含正确的停顿标记，TTS 就能正确处理了！

---

*最后更新: 2026-02-27*
