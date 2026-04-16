import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../context/UserContext";
import { motion } from "motion/react";
import imgUserAvatarFallback from "@/assets/b8d0c94852c1f1ec0942e2d0ea326153cd3f2b47.png";
import { Mail, Sparkles, Heart, Leaf, Loader2 } from "lucide-react";
import { getLetterHistory, LetterRecord } from "../services/letterStorage";
import { fetchTodayLetter } from "../services/letterService";
import { COVER_IMAGES } from "../services/letterCovers";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const navigate = useNavigate();
  const { avatar } = useUser();
  const { t, language } = useLanguage();
  const [letters, setLetters] = useState<LetterRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const currentAvatar = avatar || imgUserAvatarFallback;

  useEffect(() => {
    setLetters(getLetterHistory());
  }, []);

  const hasTodayLetter = letters.length > 0 && letters[0].date === new Date().toISOString().slice(0, 10);

  const handleGetTodayLetter = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const record = await fetchTodayLetter(language);
      setLetters(getLetterHistory());
      navigate(`/letters/${record.id}`);
    } catch (e) {
      console.error("Failed to get letter", e);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F3EEEA] p-6 pb-24 font-['Nunito'] relative overflow-x-hidden">
      {/* Top Bar */}
      <div className="flex justify-end items-center mb-8 mt-4">
        <div
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#4A235A]/20 cursor-pointer shadow-sm"
            onClick={() => navigate('/profile')}
        >
          <img src={currentAvatar} alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Header Section */}
      <div className="mt-2 mb-8">
        <h1 className="text-[64px] font-normal leading-none font-['Imperial_Script'] text-black/90 mb-2">
          {t('home.title')}
        </h1>
        <motion.h2
          className="font-['IM_Fell_DW_Pica'] text-[42px] leading-tight bg-gradient-to-r from-[#4A235A] via-[#7B3F8F] to-[#9B59B6] bg-clip-text text-transparent flex items-center gap-3 font-bold drop-shadow-[0_2px_8px_rgba(74,35,90,0.3)]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Natural Planet
          <Leaf size={40} className="text-[#4A235A] translate-y-1" />
        </motion.h2>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-10">
        <motion.button
            onClick={() => navigate('/chat/detail')}
            className="flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 rounded-[20px] font-bold font-['IM_Fell_DW_Pica'] text-[18px] shadow-md"
            whileHover={{ scale: 1.02, backgroundColor: "#000000" }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
        >
            {t('home.chat')} <Sparkles size={18} className="text-white" />
        </motion.button>
        <motion.button
            onClick={() => navigate('/meditation')}
            className="flex items-center gap-2 border border-[#1a1a1a] text-[#1a1a1a] px-6 py-3 rounded-[20px] font-bold font-['IM_Fell_DW_Pica'] text-[18px]"
            whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.05)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
        >
            {t('home.meditation')} <Heart size={18} />
        </motion.button>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-[#D3CDC6] mb-8" />

      {/* Letters Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold font-['IM_Fell_DW_Pica'] text-[32px] text-black">{t('home.letters')}</span>
          <Mail size={24} className="text-black" />
        </div>
      </div>

      {/* Today's Letter Button */}
      {!hasTodayLetter && (
        <motion.button
          onClick={handleGetTodayLetter}
          disabled={loading}
          className="mb-6 w-full flex items-center justify-center gap-3 bg-[#6E3677] text-white py-4 rounded-[20px] font-bold font-['IM_Fell_DW_Pica'] text-lg shadow-md disabled:opacity-60"
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
        >
          {loading ? (
            <><Loader2 size={20} className="animate-spin" /> {t('home.generating')}</>
          ) : (
            <><Mail size={20} /> {t('home.getTodayLetter')}</>
          )}
        </motion.button>
      )}

      {/* Letters List */}
      <div className="space-y-4">
        {letters.map((letter, index) => (
          <motion.div
            key={letter.id}
            onClick={() => navigate(`/letters/${letter.id}`)}
            className="rounded-[20px] overflow-hidden relative cursor-pointer h-48 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            whileHover={{ y: -4, boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}
            whileTap={{ scale: 0.98 }}
          >
            <img
              src={COVER_IMAGES[letter.coverIndex % COVER_IMAGES.length]}
              alt="Letter cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <p className="text-white font-bold font-['IM_Fell_DW_Pica'] text-xl">
                {t('home.letterCardTitle')}
              </p>
              <p className="text-white/70 text-sm mt-1">{formatDate(letter.date)}</p>
            </div>
          </motion.div>
        ))}

        {letters.length === 0 && !loading && (
          <p className="text-center text-gray-400 py-10">{t('home.noLetters')}</p>
        )}
      </div>
    </div>
  );
}
