"""
TTS (Text-To-Speech) service using Edge-TTS with local audio fallbacks.
"""
import os
import re
import shutil
import subprocess
import uuid

import edge_tts
import imageio_ffmpeg

from app.config import settings
from app.core.logger import logger


class TTSService:
    """Edge-TTS audio generation service."""

    LANGUAGE_VOICES = {
        "en": "en-IE-EmilyNeural",
        "zh": "zh-CN-XiaoxiaoNeural",
        "ja": "ja-JP-NanamiNeural",
        "ko": "ko-KR-SunHiNeural",
    }

    BGM_PATH = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        "static",
        "BGM",
        "mixkit-valley-sunset-127.mp3",
    )

    def __init__(self):
        self.voice = settings.TTS_VOICE
        self.audio_dir = settings.AUDIO_DIR
        self.ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
        os.makedirs(self.audio_dir, exist_ok=True)

    def _get_voice(self, language: str = None) -> str:
        if language:
            return self.LANGUAGE_VOICES.get(language, self.voice)
        return self.voice

    def _safe_title(self, title: str = None) -> str:
        if not title:
            return ""
        return "".join(c for c in title if c.isalnum() or c in (" ", "-", "_")).strip()

    def _estimate_duration_seconds(self, script: str, title: str = None) -> int:
        if title:
            match = re.search(r"(\d+)\s*min", title, re.IGNORECASE)
            if match:
                return max(int(match.group(1)) * 60, 60)

        word_count = len(script.split())
        estimated = int(word_count / 2.5) if word_count else 60
        return max(estimated, 60)

    async def text_to_speech(
        self,
        text: str,
        filename: str = None,
        rate: str = "+0%",
        volume: str = "+0%",
        pitch: str = "+0Hz",
        language: str = None,
    ) -> str:
        if not filename:
            filename = f"{uuid.uuid4()}.mp3"

        if not filename.endswith(".mp3"):
            filename += ".mp3"

        audio_path = os.path.join(self.audio_dir, filename)
        voice = self._get_voice(language)

        communicate = edge_tts.Communicate(
            text=text,
            voice=voice,
            rate=rate,
            volume=volume,
            pitch=pitch,
        )

        await communicate.save(audio_path)
        print(f"[OK] TTS generated: {filename} (voice={voice})")
        return f"/static/audios/{filename}"

    def _mix_with_bgm(self, voice_path: str, output_path: str, bgm_volume: float = 0.15) -> bool:
        if not os.path.exists(self.BGM_PATH):
            print(f"[WARN] BGM file not found: {self.BGM_PATH}")
            return False

        try:
            result = subprocess.run([
                self.ffmpeg, "-y",
                "-i", voice_path,
                "-stream_loop", "-1", "-i", self.BGM_PATH,
                "-filter_complex",
                f"[1:a]volume={bgm_volume}[bgm];[0:a][bgm]amix=inputs=2:duration=first:dropout_transition=3[out]",
                "-map", "[out]",
                "-codec:a", "libmp3lame", "-b:a", "192k",
                output_path,
            ], capture_output=True, text=True, timeout=120)

            if result.returncode == 0:
                print(f"[OK] BGM mixed: {os.path.basename(output_path)}")
                return True

            print(f"[ERR] FFmpeg failed: {result.stderr[:200]}")
            return False
        except Exception as exc:
            print(f"[ERR] BGM mix error: {exc}")
            return False

    def generate_ambient_audio(self, script: str, title: str = None) -> dict:
        """Generate local ambient audio when online TTS is unavailable."""
        safe_title = self._safe_title(title)
        if safe_title:
            filename = f"meditation_{safe_title}_{uuid.uuid4().hex[:8]}.mp3"
        else:
            filename = f"meditation_{uuid.uuid4().hex}.mp3"

        output_path = os.path.join(self.audio_dir, filename)
        duration_seconds = self._estimate_duration_seconds(script, title)

        if os.path.exists(self.BGM_PATH):
            try:
                result = subprocess.run([
                    self.ffmpeg, "-y",
                    "-stream_loop", "-1", "-i", self.BGM_PATH,
                    "-t", str(duration_seconds),
                    "-codec:a", "libmp3lame", "-b:a", "192k",
                    output_path,
                ], capture_output=True, text=True, timeout=120)

                if result.returncode == 0:
                    logger.warning(f"Using ambient-only fallback audio: {filename}")
                    return {
                        "audio_url": f"/static/audios/{filename}",
                        "filename": filename,
                    }

                logger.warning(f"Ambient audio generation failed, falling back to raw BGM copy: {result.stderr[:200]}")
            except Exception as exc:
                logger.warning(f"Ambient audio generation error, falling back to raw BGM copy: {exc}")

            try:
                shutil.copyfile(self.BGM_PATH, output_path)
                logger.warning(f"Using copied BGM fallback audio: {filename}")
                return {
                    "audio_url": f"/static/audios/{filename}",
                    "filename": filename,
                }
            except Exception as exc:
                logger.error(f"BGM copy fallback failed: {exc}")

        raise RuntimeError("All local audio fallbacks failed")

    async def generate_meditation_audio(
        self,
        script: str,
        title: str = None,
        language: str = None,
    ) -> dict:
        if title:
            safe_title = self._safe_title(title)
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
                language=language,
            )
        except Exception as exc:
            logger.warning(f"Edge-TTS failed, using local ambient fallback: {exc}")
            return self.generate_ambient_audio(script=script, title=title)

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
            "filename": filename,
        }

    def get_available_voices(self) -> list:
        return [
            {"value": "zh-CN-XiaoxiaoNeural", "label": "鏅撴檽 (濂冲０, 娓╂煍)"},
            {"value": "zh-CN-YunxiNeural", "label": "浜戝笇 (鐢峰０, 骞抽潤)"},
            {"value": "zh-CN-XiaoyiNeural", "label": "鏅撲紛 (濂冲０, 娓呮柊)"},
            {"value": "zh-CN-YunjianNeural", "label": "浜戝仴 (鐢峰０, 绋抽噸)"},
            {"value": "zh-CN-XiaochenNeural", "label": "鏅撹景 (濂冲０, 鐢滅編)"},
        ]


tts_service = TTSService()
