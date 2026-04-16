import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Globe } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { LANGUAGE_OPTIONS, Language } from "../i18n/translations";

export default function LanguageSelection() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    navigate('/onboarding');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F3EEEA] p-6 pt-16 items-center">
      <Globe size={48} className="text-[#6E3677] mb-6" />
      <h1 className="text-[36px] font-bold font-['IM_Fell_DW_Pica'] text-center mb-2">
        {t('language.title')}
      </h1>
      <p className="text-gray-500 text-center mb-12">
        {t('language.subtitle')}
      </p>

      <div className="w-full space-y-4 max-w-sm">
        {LANGUAGE_OPTIONS.map((opt, index) => (
          <motion.button
            key={opt.code}
            onClick={() => handleSelect(opt.code)}
            className={`w-full flex items-center gap-4 p-5 rounded-[20px] border-2 transition-colors text-left ${
              language === opt.code
                ? 'border-[#6E3677] bg-white shadow-md'
                : 'border-gray-200 bg-white/50 hover:bg-white'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-3xl">{opt.flag}</span>
            <span className="text-xl font-bold font-['IM_Fell_DW_Pica']">{opt.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
