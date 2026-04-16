import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Trash2 } from "lucide-react";
import { PlayCircleIcon, PauseCircleIcon } from "../components/Icons";
import imgKoala from "@/assets/8e3a8ca18b6104070e04a9f1cdd5980d520b3a7d.png";
import { getMeditationHistory, removeMeditationRecord, MeditationRecord } from "../services/meditationStorage";
import { useLanguage } from "../context/LanguageContext";

export default function Meditation() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [records, setRecords] = useState<MeditationRecord[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setRecords(getMeditationHistory());
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlay = (record: MeditationRecord) => {
    // 如果正在播放这个，暂停
    if (playingId === record.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingId(null);
      return;
    }

    // 停止之前的音频
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const newAudio = new Audio(record.audioUrl);
    audioRef.current = newAudio;
    newAudio.volume = 0.5;
    setPlayingId(record.id);

    newAudio.play().catch(e => {
      if (e.name === 'AbortError') return;
      console.error("Audio play failed", e);
      if (audioRef.current === newAudio) {
        setPlayingId(null);
      }
    });

    newAudio.onended = () => setPlayingId(null);
  };

  const handleDelete = (id: string) => {
    if (playingId === id && audioRef.current) {
      audioRef.current.pause();
      setPlayingId(null);
    }
    removeMeditationRecord(id);
    setRecords(getMeditationHistory());
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F3EEEA] p-6 pt-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-2xl font-bold">
          <ArrowLeft />
        </button>
        <h1 className="text-[32px] font-bold font-[IM_FELL_DW_Pica]">{t('meditation.title')}</h1>
      </div>

      {records.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-lg">{t('meditation.empty')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id} className="bg-[#F4EFE9] rounded-[20px] p-4 flex items-center justify-between shadow-sm border border-gray-200 transition-colors hover:bg-white/50">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img src={imgKoala} alt={record.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-lg font-[IM_FELL_DW_Pica] block truncate">{record.title}</span>
                  <span className="text-xs text-gray-500">{formatDate(record.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handlePlay(record)}
                  className="w-10 h-10 hover:scale-110 transition-transform"
                >
                  {playingId === record.id ? (
                    <PauseCircleIcon className="w-full h-full text-[#6E3677]" />
                  ) : (
                    <PlayCircleIcon className="w-full h-full text-[#6E3677]" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
