import { api } from './api';

export interface MeditationResult {
  id: string;
  title: string;
  text: string;
  audio_url: string;
  duration: number;
}

interface ChatMessage {
  role: string;
  content: string;
}

export async function generateMeditation(
  userInput: string,
  duration: number = 10,
  language: string = 'en',
  chatHistory?: ChatMessage[]
): Promise<MeditationResult> {
  return api.post<MeditationResult>('/meditation/generate', {
    user_input: userInput,
    duration,
    language,
    chat_history: chatHistory || undefined,
  });
}
