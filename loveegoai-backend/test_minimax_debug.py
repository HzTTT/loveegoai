"""测试 MiniMax TTS API"""
import requests
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("MINIMAX_API_KEY")
group_id = os.getenv("MINIMAX_GROUP_ID")

url = f"https://api.minimaxi.com/v1/text_to_speech?GroupId={group_id}"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

payload = {
    "text": "这是一个测试",
    "voice_id": "female-shaonv",
    "speed": 1.0,
    "vol": 1.0,
    "audio_sample_rate": 32000,
    "bitrate": 128000
}

print(f"Testing MiniMax API...")
print(f"URL: {url}")
print(f"Payload: {payload}")

try:
    response = requests.post(url, headers=headers, json=payload, timeout=60)
    print(f"\nStatus Code: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    print(f"Content Length: {len(response.content)}")
    print(f"Content Type: {response.headers.get('Content-Type')}")

    if len(response.content) < 500:
        print(f"Response Content: {response.content}")
    else:
        print(f"Response Content (first 200 bytes): {response.content[:200]}")

    response.raise_for_status()

    if len(response.content) > 0:
        with open("test_output.mp3", "wb") as f:
            f.write(response.content)
        print(f"\nAudio saved to test_output.mp3")
    else:
        print("\nERROR: Response content is empty!")

except Exception as e:
    print(f"\nError: {e}")
    import traceback
    traceback.print_exc()
