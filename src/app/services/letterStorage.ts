/**
 * 信件本地存储服务
 * 将 API 生成的每日信件保存到 localStorage
 */

export interface LetterRecord {
  id: string;
  date: string;
  coverIndex: number;
  content: string;
  language?: string;
  createdAt: string;
}

const STORAGE_KEY = 'letter_history';

export function getLetterHistory(): LetterRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LetterRecord[];
  } catch {
    return [];
  }
}

export function addLetterRecord(record: LetterRecord): void {
  const list = getLetterHistory();
  list.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getLetterById(id: string): LetterRecord | undefined {
  return getLetterHistory().find(r => r.id === id);
}

export function getTodayLocalLetter(language?: string): LetterRecord | undefined {
  const today = new Date().toISOString().slice(0, 10);
  return getLetterHistory().find(r => r.date === today && (!language || r.language === language));
}
