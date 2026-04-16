# ffmpeg 安装指南 (Windows)

## ⚠️ 重要提示
pydub 需要 ffmpeg 才能处理音频文件。没有 ffmpeg，TTS 停顿功能无法正常工作。

---

## 🚀 安装方法（选择一种）

### 方法1：直接下载（推荐，最简单）

1. **下载 ffmpeg**
   - 访问：https://github.com/BtbN/FFmpeg-Builds/releases
   - 下载：`ffmpeg-master-latest-win64-gpl.zip`

2. **解压缩**
   - 解压到：`C:\ffmpeg`
   - 确保路径是：`C:\ffmpeg\bin\ffmpeg.exe`

3. **添加到 PATH**
   ```
   方式A: 通过设置界面
   - 按 Win + R，输入 sysdm.cpl
   - 高级 → 环境变量
   - 系统变量 → Path → 编辑
   - 新建 → 输入：C:\ffmpeg\bin
   - 确定 → 重启命令行

   方式B: 通过 PowerShell (管理员)
   [System.Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\ffmpeg\bin", "Machine")
   ```

4. **验证安装**
   ```bash
   # 重新打开命令行
   ffmpeg -version
   ```

---

### 方法2：使用 Chocolatey

如果已安装 Chocolatey：

```bash
# 以管理员身份运行
choco install ffmpeg
```

---

### 方法3：使用 Scoop

如果已安装 Scoop：

```bash
scoop install ffmpeg
```

---

## ✅ 验证安装

安装完成后，运行以下命令验证：

```bash
ffmpeg -version
```

应该看到类似输出：
```
ffmpeg version N-... Copyright (c) 2000-2024 the FFmpeg developers
...
```

---

## 🧪 测试 TTS 停顿功能

安装 ffmpeg 后，运行测试：

```bash
python test_tts_pause.py
```

---

## ❓ 常见问题

### Q: 添加 PATH 后仍然提示找不到 ffmpeg？
A: 需要**完全关闭并重新打开**命令行窗口（或 VSCode）。

### Q: 是否可以不安装 ffmpeg？
A: 不可以。pydub 的音频处理功能依赖 ffmpeg。没有它，TTS 停顿功能无法工作。

### Q: 可以使用其他工具代替 ffmpeg 吗？
A: pydub 也支持使用 libav，但 ffmpeg 是最推荐的。

---

## 🔗 相关链接

- [ffmpeg 官网](https://ffmpeg.org/)
- [ffmpeg Windows Builds](https://github.com/BtbN/FFmpeg-Builds/releases)
- [pydub 文档](https://github.com/jiaaro/pydub)

---

*创建时间: 2026-02-27*
