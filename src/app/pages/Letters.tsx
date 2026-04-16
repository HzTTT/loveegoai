import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getLetterById, LetterRecord } from "../services/letterStorage";
import { fetchTodayLetter } from "../services/letterService";
import { useLanguage } from "../context/LanguageContext";

export default function Letters() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const [letter, setLetter] = useState<LetterRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLetter = async () => {
      try {
        if (id) {
          // 按 ID 从本地读取
          const local = getLetterById(id);
          if (local) {
            setLetter(local);
          } else {
            setError(t('letters.notFound'));
          }
        } else {
          // 无 ID，获取今日信件
          const record = await fetchTodayLetter(language);
          setLetter(record);
        }
      } catch (e: any) {
        setError(e.message || "Failed to load letter");
      } finally {
        setLoading(false);
      }
    };
    loadLetter();
  }, [id, language]);

  const paragraphs = letter?.content?.split('\n').filter(p => p.trim()) || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#F3EEEA] relative overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => navigate('/home')}
          className="w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-sm shadow-sm hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 pt-24 pb-12 max-w-md mx-auto">
          {/* Title */}
          <h1 className="text-[42px] leading-tight font-['Imperial_Script'] text-center mb-8 text-[#2C1810] font-[IM_FELL_DW_Pica] whitespace-pre-line">
            {t('letters.title')}
          </h1>

          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#6E3677]" />
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 py-10">{error}</div>
          )}

          {letter && (
            <>
              {/* Letter Content */}
              <div className="space-y-6 text-[17px] text-[#4A3B32] leading-[1.8] font-['Nunito'] tracking-wide text-justify">
                {paragraphs.map((p, i) => (
                  <p key={i} className="font-[IM_FELL_DW_Pica]">{p}</p>
                ))}
              </div>

              {/* Signature */}
              <div className="mt-12 text-right">
                <p className="font-['Imperial_Script'] text-3xl text-[#2C1810] font-[IM_FELL_DW_Pica]">
                  {t('letters.signature')}
                </p>
                <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest font-['Nunito'] font-[IM_FELL_DW_Pica]">
                  {t('letters.from')}
                </p>
                <p className="text-xs text-gray-400 mt-1">{letter.date}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
