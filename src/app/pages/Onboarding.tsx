import { useNavigate } from "react-router";
import { motion } from "motion/react";
import image_97ac94f021156f1a38050147918480b893974952 from '@/assets/97ac94f021156f1a38050147918480b893974952.png'
import { useLanguage } from "../context/LanguageContext";

export default function Onboarding() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col h-screen bg-[#F3EEEA] relative overflow-hidden cursor-pointer" onClick={() => navigate('/home')}>
      <div className="mt-20 px-8">
        <h1 className="text-[56px] font-['ADLaM_Display'] flex items-center gap-2 mt-8 font-[IM_FELL_DW_Pica]">
          {t('onboarding.welcome')}
        </h1>
      </div>
      
      <div className="absolute bottom-0 right-0 w-[90%] max-w-md translate-y-4">
        <motion.img 
          src={image_97ac94f021156f1a38050147918480b893974952} 
          alt="Peeking Koala" 
          className="w-full h-auto object-contain"
          initial={{ x: 200, opacity: 0 }}
          animate={{ 
            x: 0,
            opacity: 1
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut"
          }}
        />
      </div>
    </div>
  );
}