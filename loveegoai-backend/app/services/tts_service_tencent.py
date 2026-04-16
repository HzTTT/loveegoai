"""
TTS (Text-To-Speech) 语音合成服务: 腾讯云 TTS
"""
import os
import uuid
import subprocess
import imageio_ffmpeg
from tencentcloud.common import credential
from tencentcloud.common.profile.client_profile import ClientProfile
from tencentcloud.common.profile.http_profile import HttpProfile
from tencentcloud.tts.v20190823 import tts_client, models
import base64
from app.config import settings


class TTSService:
    """腾讯云 TTS 语音合成服务"""

    # 各语言的TTS语音
    LANGUAGE_VOICES = {
        "en": 101301,  # WeJenny 英文女声
        "zh": 101002,  # 智聆 中文女声（轻柔细腻）
        "ja": 101301,  # 暂用英文
        "ko": 101301,  # 暂用英文
    }

    # BGM 文件路径
    BGM_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
                            "static", "BGM", "mixkit-valley-sunset-127.mp3")

    def __init__(self):
        self.voice = int(settings.TTS_VOICE)
        self.audio_dir = settings.AUDIO_DIR
        self.ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

        # 腾讯云凭证
        self.cred = credential.Credential(
            settings.TENCENT_SECRET_ID,
            settings.TENCENT_SECRET_KEY
        )

        # HTTP配置
        httpProfile = HttpProfile()
        httpProfile.endpoint = "tts.tencentcloudapi.com"

        clientProfile = ClientProfile()
        clientProfile.httpProfile = httpProfile

        # 创建客户端
        self.client = tts_client.TtsClient(self.cred, "ap-guangzhou", clientProfile)

        # 确保音频目录存在
        os.makedirs(self.audio_dir, exist_ok=True)

    def _get_voice(self, language: str = None) -> int:
        """根据语言获取TTS语音"""
        if language:
            return self.LANGUAGE_VOICES.get(language, self.voice)
        return self.voice

    async def text_to_speech(
        self,
        text: str,
        filename: str = None,
        rate: str = "+0%",
        volume: str = "+0%",
        pitch: str = "+0Hz",
        language: str = None
    ) -> str:
        """
        文字转语音

        Args:
            text: 文本内容
            filename: 文件名 (不填自动生成)
            rate: 语速调整 (腾讯云不支持百分比，转换为 -2~2)
            volume: 音量调整 (腾讯云 0~10)
            pitch: 音调调整 (腾讯云不支持)
            language: 语言代码 (en/zh/ja/ko)

        Returns:
            音频文件路径
        """
        # 生成文件名
        if not filename:
            filename = f"{uuid.uuid4()}.mp3"

        if not filename.endswith(".mp3"):
            filename += ".mp3"

        # 完整路径
        audio_path = os.path.join(self.audio_dir, filename)

        # 根据语言选择语音
        voice_type = self._get_voice(language)

        # 转换语速参数 (Edge TTS: -35% -> 腾讯云: -1.5)
        speed = 0.0
        if rate:
            rate_val = float(rate.replace("%", "").replace("+", ""))
            speed = rate_val / 50.0  # -35% -> -0.7
            speed = max(-2.0, min(2.0, speed))

        # 转换音量参数 (Edge TTS: +0% -> 腾讯云: 5)
        vol = 5
        if volume:
            vol_val = float(volume.replace("%", "").replace("+", ""))
            vol = 5 + (vol_val / 20.0)  # +0% -> 5, +100% -> 10
            vol = max(0, min(10, int(vol)))

        try:
            # 创建请求
            req = models.TextToVoiceRequest()
            req.Text = text
            req.SessionId = str(uuid.uuid4())
            req.VoiceType = voice_type
            req.Speed = speed
            req.Volume = vol
            req.Codec = "mp3"

            # 调用API
            resp = self.client.TextToVoice(req)

            # 保存音频
            audio_data = base64.b64decode(resp.Audio)
            with open(audio_path, "wb") as f:
                f.write(audio_data)

            print(f"[OK] TTS generated: {filename} (voice={voice_type})")

            # 返回相对路径 (用于URL访问)
            return f"/static/audios/{filename}"

        except Exception as e:
            print(f"[ERR] Tencent TTS failed: {e}")
            raise

    def _mix_with_bgm(self, voice_path: str, output_path: str, bgm_volume: float = 0.15) -> bool:
        """
        将语音与BGM混合

        Args:
            voice_path: 语音文件路径
            output_path: 输出文件路径
            bgm_volume: BGM音量 (0.0~1.0)

        Returns:
            是否成功
        """
        if not os.path.exists(self.BGM_PATH):
            print(f"[WARN] BGM file not found: {self.BGM_PATH}")
            return False

        try:
            result = subprocess.run([
                self.ffmpeg, '-y',
                '-i', voice_path,
                '-stream_loop', '-1', '-i', self.BGM_PATH,
                '-filter_complex',
                f'[1:a]volume={bgm_volume}[bgm];[0:a][bgm]amix=inputs=2:duration=first:dropout_transition=3[out]',
                '-map', '[out]',
                '-codec:a', 'libmp3lame', '-b:a', '192k',
                output_path
            ], capture_output=True, text=True, timeout=120)

            if result.returncode == 0:
                print(f"[OK] BGM mixed: {os.path.basename(output_path)}")
                return True
            else:
                print(f"[ERR] FFmpeg failed: {result.stderr[:200]}")
                return False
        except Exception as e:
            print(f"[ERR] BGM mix error: {e}")
            return False

    async def generate_meditation_audio(
        self,
        script: str,
        title: str = None,
        language: str = None
    ) -> dict:
        """
        生成冥想引导音频（自动混入BGM）

        Args:
            script: 冥想引导脚本
            title: 标题
            language: 语言代码

        Returns:
            音频信息 {"audio_url": "...", "filename": "..."}
        """
        # 生成文件名
        if title:
            safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).strip()
            filename = f"meditation_{safe_title}_{uuid.uuid4().hex[:8]}.mp3"
        else:
            filename = f"meditation_{uuid.uuid4().hex}.mp3"

        # 先用临时文件名生成纯语音
        voice_filename = f"voice_{uuid.uuid4().hex[:8]}.mp3"

        audio_url = await self.text_to_speech(
            text=script,
            filename=voice_filename,
            rate="-35%",   # 慢35%，更舒缓
            volume="+0%",
            pitch="+0Hz",
            language=language
        )

        # 混入BGM
        voice_path = os.path.join(self.audio_dir, voice_filename)
        mixed_path = os.path.join(self.audio_dir, filename)

        mixed = self._mix_with_bgm(voice_path, mixed_path)

        if mixed:
            # 混音成功，删除纯语音临时文件
            try:
                os.remove(voice_path)
            except OSError:
                pass
            audio_url = f"/static/audios/{filename}"
        else:
            # 混音失败，直接用纯语音文件重命名
            try:
                os.rename(voice_path, mixed_path)
                audio_url = f"/static/audios/{filename}"
            except OSError:
                # 重命名也失败，保留原文件
                filename = voice_filename

        return {
            "audio_url": audio_url,
            "filename": filename
        }

    def get_available_voices(self) -> list:
        """获取可用的中文语音列表"""
        return [
            {"value": "101002", "label": "智聆 (女声, 轻柔细腻)"},
            {"value": "101001", "label": "智瑜 (女声, 温柔亲切)"},
            {"value": "101003", "label": "智美 (女声, 温柔)"},
            {"value": "101050", "label": "微燕 (女声, 轻柔亲切)"},
            {"value": "101010", "label": "智逸 (男声, 磁性沉稳)"},
        ]


# 创建全局TTS服务实例
tts_service = TTSService()
