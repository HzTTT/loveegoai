import { useNavigate } from "react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function About() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-[#F3EEEA] p-6 pt-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">{t('about.title')}</h1>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-[#F3EEEA] border-b border-gray-200 cursor-pointer hover:bg-black/5 transition-colors">
            <span className="text-lg font-medium">{t('about.terms')}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex items-center justify-between p-4 bg-[#F3EEEA] border-b border-gray-200 cursor-pointer hover:bg-black/5 transition-colors">
            <span className="text-lg font-medium">{t('about.privacy')}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
