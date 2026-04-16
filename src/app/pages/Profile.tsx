import { useNavigate } from "react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useLanguage } from "../context/LanguageContext";

export default function Profile() {
  const navigate = useNavigate();
  const { avatar, name } = useUser();
  const { t } = useLanguage();

  const menuItems = [
    { title: t('profile.account'), action: () => navigate('/account-settings') },
    { title: t('profile.changePassword'), action: () => {} },
    { title: t('profile.language'), action: () => navigate('/language') },
    { title: t('profile.helpFeedback'), action: () => {} },
    { title: t('profile.about'), action: () => navigate('/about') },
    { title: t('profile.logout'), action: () => navigate('/') },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F3EEEA] p-6 pt-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold">{t('profile.title')}</h1>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#4A235A]/20 mb-4">
          <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-2xl font-bold mb-2 font-[IM_FELL_DW_Pica]">{name}</h2>
        <button className="bg-[#8E44AD] text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            {t('profile.vip')}
        </button>
      </div>

      <div className="bg-[#F3EEEA] space-y-1">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border-b border-gray-300 cursor-pointer hover:bg-black/5 transition-colors"
            onClick={item.action}
          >
            <span className="text-lg font-medium">{item.title}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
}