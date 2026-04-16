import { api } from './api';
import { getTodayLocalLetter, addLetterRecord, LetterRecord } from './letterStorage';
import { COVER_IMAGES } from './letterCovers';

export interface Letter {
  id: string;
  date: string;
  cover_image: string;
  content: string;
}

/**
 * 获取今日信件：先查本地 → 没有才调 API → 拿到后存本地
 */
export async function fetchTodayLetter(language: string = 'en'): Promise<LetterRecord> {
  // 先查本地（按语言匹配）
  const local = getTodayLocalLetter(language);
  if (local) return local;

  // 调 API 生成
  const letter = await api.get<Letter>(`/letters/today?language=${language}`);

  // 随机分配封面
  const coverIndex = Math.floor(Math.random() * COVER_IMAGES.length);

  const record: LetterRecord = {
    id: letter.id,
    date: letter.date,
    coverIndex,
    content: letter.content,
    language,
    createdAt: new Date().toISOString(),
  };

  addLetterRecord(record);
  return record;
}
