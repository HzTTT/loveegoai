# TTS 停顿功能实现方案

## 📊 研究结果总结

### 核心发现

**Edge-TTS 不支持 SSML `<break>` 标签** ❌

根据 GitHub Issue #58 确认，Edge-TTS 因微软限制，不支持自定义 SSML（包括 break 标签）。

如果直接在文本中写 `[停顿2秒]`，TTS 会将这几个字**直接读出来**，不会产生停顿效果。

### 解决方案

参考社区项目 [edge-tts-ui](https://github.com/smallnew666/edge-tts-ui)，采用 **分段生成 + 插入静音** 的方式实现停顿功能。

---

## 🛠️ 实现原理

### 技术方案

1. **文本标记格式**: `[停顿1秒]`, `[停顿2秒]`, `[停顿3秒]`
2. **文本分割**: 使用正则表达式 `r'(\[停顿(\d+)秒\])'` 分割文本
3. **分段处理**:
   - 普通文本 → 调用 Edge-TTS 生成语音
   - 停顿标记 → 使用 `pydub` 生成静音片段
4. **音频拼接**: 将所有片段按顺序拼接成完整音频

### 核心依赖

```bash
pip install edge-tts pydub
```

> ⚠️ **注意**: `pydub` 需要 `ffmpeg` 支持
> - Windows: 下载 ffmpeg 并添加到 PATH
> - macOS: `brew install ffmpeg`
> - Linux: `sudo apt install ffmpeg`

---

## 📝 使用方法

### 1. 更新 TTS 服务

将 `app/services/tts_service.py` 替换为 `tts_service_with_pause.py`：

```bash
# 备份原文件
cp app/services/tts_service.py app/services/tts_service_backup.py

# 替换为新文件
cp app/services/tts_service_with_pause.py app/services/tts_service.py
```

### 2. 测试停顿功能

```bash
python test_tts_pause.py
```

### 3. 在冥想引导中使用

**原始文本**（现在可以直接使用停顿标记）:

```text
Hello，大家好，我是梦琪。[停顿2秒]
今天我们来练习边界冥想。[停顿1秒]
闭上你的眼睛，[停顿2秒]
深呼吸三次。[停顿3秒]
现在想象一个圆圈围绕着你的身体。[停顿2秒]
这个圆圈代表你的边界。[停顿1秒]
```

**调用方式**:

```python
from app.services.tts_service import tts_service

# 生成冥想音频 (自动启用停顿功能)
result = await tts_service.generate_meditation_audio(
    script=meditation_script,
    title="边界冥想"
)

# 返回结果
{
    "audio_url": "/static/audios/meditation_边界冥想_abc12345.mp3",
    "filename": "meditation_边界冥想_abc12345.mp3"
}
```

---

## 🎨 优化后的冥想脚本格式

### 示例：边界冥想引导

```markdown
## 🧘 边界冥想

【元数据】
- ID: meditation_boundary_01
- 分类: 关系处理类
- 时长: 约8分钟
- 难度: 入门
- 主题标签: #边界 #自我保护 #人际关系

【引导词】
Hello，大家好，我是梦琪。[停顿2秒]
今天我们来练习边界冥想。[停顿1秒]

首先，找一个舒适的姿势坐下或躺下。[停顿2秒]
闭上你的眼睛。[停顿2秒]

深呼吸三次。[停顿3秒]
吸气，[停顿1秒]呼气。[停顿2秒]
吸气，[停顿1秒]呼气。[停顿2秒]
吸气，[停顿1秒]呼气。[停顿3秒]

很好。[停顿1秒]
现在想象一个圆圈围绕着你的身体。[停顿2秒]
这个圆圈代表你的边界。[停顿2秒]

这个边界属于你，[停顿1秒]只属于你。[停顿2秒]
你可以决定谁可以进入，[停顿1秒]谁需要保持距离。[停顿3秒]

现在，感受这个边界给你带来的安全感。[停顿2秒]
你不需要向任何人解释你的边界。[停顿2秒]
你的边界是你的权利。[停顿3秒]

慢慢地，[停顿1秒]准备好的时候，[停顿1秒]睁开眼睛。[停顿2秒]

谢谢你的聆听。[停顿1秒]
```

---

## 🔧 API 调用示例

### 冥想 API (app/api/meditation.py)

现有的 API 无需修改，自动支持停顿功能：

```python
@router.post("/generate", response_model=MeditationResponse)
async def generate_meditation(request: MeditationRequest):
    """生成冥想引导"""
    # LLM 生成脚本 (包含停顿标记)
    script = await rag_service.generate_meditation_script(
        theme=request.theme,
        duration=request.duration
    )

    # 生成音频 (自动支持停顿)
    result = await tts_service.generate_meditation_audio(
        script=script,
        title=f"{request.theme}冥想"
    )

    return MeditationResponse(
        id=str(uuid.uuid4()),
        title=f"{request.theme}冥想",
        duration=request.duration,
        audio_url=result["audio_url"]
    )
```

---

## ✅ 验证清单

完成以下步骤以确保功能正常：

- [ ] 安装依赖: `pip install pydub`
- [ ] 安装 ffmpeg
- [ ] 运行测试: `python test_tts_pause.py`
- [ ] 播放生成的音频，验证停顿效果
- [ ] 更新 16 个冥想引导脚本，添加停顿标记
- [ ] 测试 API 调用是否正常工作

---

## 📚 参考资源

- [Edge-TTS GitHub](https://github.com/rany2/edge-tts)
- [Edge-TTS Issue #58 - SSML Support](https://github.com/rany2/edge-tts/issues/58)
- [edge-tts-ui (停顿功能实现参考)](https://github.com/smallnew666/edge-tts-ui)
- [pydub Documentation](https://github.com/jiaaro/pydub)

---

## 🎯 下一步

1. ✅ **已完成**: 实现 TTS 停顿功能
2. ⏳ **进行中**: 优化冥想知识库，添加停顿标记
3. ⏳ **待办**: 优化转念知识库 (2739段 → 200-300块)
4. ⏳ **待办**: 为 50 封信件添加星球标识
5. ⏳ **待办**: 导入所有知识库到 Pinecone

---

*最后更新: 2026-02-27*
