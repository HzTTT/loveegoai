import { API_BASE, getToken } from './api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: string;
  mode: string;
}

/**
 * 流式发送消息 (SSE)
 * onToken: 每收到一个 token 回调
 * onMode: 收到 mode 信息回调
 * 返回完整文本
 */
export const sendMessageStream = async (
  message: string,
  history: ChatMessage[],
  language: string = 'en',
  onToken: (token: string) => void,
  onMode?: (mode: string) => void,
): Promise<string> => {
  const recentHistory = history.slice(-6);
  const token = getToken();

  const response = await fetch(`${API_BASE}/chat/message/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      message,
      mode: 'changemind',
      history: recentHistory,
      language,
    }),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      try {
        const data = JSON.parse(line.slice(6));
        if (data.type === 'token') {
          fullText += data.content;
          onToken(fullText);
        } else if (data.type === 'mode' && onMode) {
          onMode(data.mode);
        } else if (data.type === 'error') {
          fullText = data.content || 'Service error, please try again.';
          onToken(fullText);
        }
      } catch {
        // 忽略解析错误
      }
    }
  }

  return fullText;
};
