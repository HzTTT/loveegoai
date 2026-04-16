"""
MiniMax TTS 语音合成服务
"""
import os
import uuid
import requests
import subprocess
import imageio_ffmpeg
from app.config import settings
from app.core.logger import logger
from app.services.tts_service_edge import tts_service as edge_tts_service


class MiniMaxTTSService:
    """MiniMax TTS 语音合成服务"""

    # 各语言的音色ID
    LANGUAGE_VOICES = {
        "en": "female-shaonv",  # 英文女声
        "zh": "female-shaonv",  # 中文女声
        "ja": "female-shaonv",  # 日文女声
        "ko": "female-shaonv",  # 韩文女声
    }

    BGM_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
                            "static", "BGM", "mixkit-valley-sunset-127.mp3")

    def __init__(self):
        self.api_key = settings.MINIMAX_API_KEY
        self.group_id = settings.MINIMAX_GROUP_ID
        self.audio_dir = settings.AUDIO_DIR
        self.ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
        self.base_url = "https://api-bj.minimaxi.com/v1/t2a_v2"

        os.makedirs(self.audio_dir, exist_ok=True)

    def _get_voice(self, language: str = None) -> str:
        """根据语言获取音色"""
        if language:
            return self.LANGUAGE_VOICES.get(language, "female-shaonv")
        return "female-shaonv"

    async def text_to_speech(
        self,
        text: str,
        filename: str = None,
        rate: str = "+0%",
        volume: str = "+0%",
        pitch: str = "+0Hz",
        language: str = None
    ) -> str:
        """文字转语音"""
        if not filename:
            filename = f"{uuid.uuid4()}.mp3"
        if not filename.endswith(".mp3"):
            filename += ".mp3"

        audio_path = os.path.join(self.audio_dir, filename)
        voice_id = self._get_voice(language)

        # 转换语速 (0.5-2.0)
        speed = 1.0
        if rate:
            rate_val = float(rate.replace("%", "").replace("+", ""))
            speed = 1.0 + (rate_val / 100.0)
            speed = max(0.5, min(2.0, speed))

        # 转换音量 (0.1-10.0)
        vol = 1.0
        if volume:
            vol_val = float(volume.replace("%", "").replace("+", ""))
            vol = 1.0 + (vol_val / 100.0)
            vol = max(0.1, min(10.0, vol))

        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }

            payload = {
                "model": "speech-01-turbo",
                "text": text,
                "stream": False,
                "voice_setting": {
                    "voice_id": voice_id,
                    "speed": speed,
                    "vol": vol
                },
                "audio_setting": {
                    "sample_rate": 32000,
                    "bitrate": 128000,
                    "format": "mp3"
                }
            }

            response = requests.post(self.base_url, headers=headers, json=payload, timeout=60)
            response.raise_for_status()

            result = response.json()
            if result.get("data") and result["data"].get("audio"):
                audio_hex = result["data"]["audio"]
                audio_bytes = bytes.fromhex(audio_hex)
                with open(audio_path, "wb") as f:
                    f.write(audio_bytes)
                print(f"[OK] MiniMax TTS generated: {filename} (voice={voice_id})")
                return f"/static/audios/{filename}"
            else:
                raise Exception(f"No audio in response: {result}")

        except Exception as e:
            print(f"[ERR] MiniMax TTS failed: {e}")
            raise

    def _mix_with_bgm(self, voice_path: str, output_path: str, bgm_volume: float = 0.15) -> bool:
        """将语音与BGM混合"""
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
        """生成冥想引导音频（自动混入BGM）"""
        if title:
            safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).strip()
            filename = f"meditation_{safe_title}_{uuid.uuid4().hex[:8]}.mp3"
        else:
            filename = f"meditation_{uuid.uuid4().hex}.mp3"

        voice_filename = f"voice_{uuid.uuid4().hex[:8]}.mp3"

        try:
            audio_url = await self.text_to_speech(
                text=script,
                filename=voice_filename,
                rate="-35%",
                volume="+0%",
                pitch="+0Hz",
                language=language
            )
        except Exception as exc:
            logger.warning(f"MiniMax TTS failed, falling back to Edge-TTS: {exc}")
            return await edge_tts_service.generate_meditation_audio(
                script=script,
                title=title,
                language=language
            )

        voice_path = os.path.join(self.audio_dir, voice_filename)
        mixed_path = os.path.join(self.audio_dir, filename)

        mixed = self._mix_with_bgm(voice_path, mixed_path)

        if mixed:
            try:
                os.remove(voice_path)
            except OSError:
                pass
            audio_url = f"/static/audios/{filename}"
        else:
            try:
                os.rename(voice_path, mixed_path)
                audio_url = f"/static/audios/{filename}"
            except OSError:
                filename = voice_filename

        return {
            "audio_url": audio_url,
            "filename": filename
        }


# 创建全局实例
minimax_tts_service = MiniMaxTTSService()
