/**
 * 冥想音频本地存储服务
 * 将聊天页面生成的冥想音频保存到 localStorage，供 Meditation 页面播放
 */

export interface MeditationRecord {
  id: string;
  title: string;
  text: string;
  audioUrl: string;
  createdAt: string; // ISO string
}

const STORAGE_KEY = 'meditation_history';

export function getMeditationHistory(): MeditationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as MeditationRecord[];
  } catch {
    return [];
  }
}

export function addMeditationRecord(record: MeditationRecord): void {
  const list = getMeditationHistory();
  list.unshift(record); // 最新的排在前面
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function removeMeditationRecord(id: string): void {
  const list = getMeditationHistory().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
