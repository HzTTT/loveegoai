import { useNavigate } from "react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useLanguage } from "../context/LanguageContext";

export default function AccountSettings() {
  const navigate = useNavigate();
  const { name } = useUser();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-[#F3EEEA] p-6 pt-12 font-['Nunito']">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">{t('account.title')}</h1>
      </div>

      <div className="space-y-6 bg-[#F3EEEA]">
        {/* Email */}
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium">{t('account.email')}</span>
            <span className="font-medium">elena*****@gmail.com</span>
        </div>

        {/* Phone */}
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium">{t('account.phone')}</span>
            <span className="font-medium">175131******11</span>
        </div>

        {/* WeChat */}
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium">{t('account.wechat')}</span>
            <span className="font-medium text-gray-800">{t('account.bound')}</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-8 space-y-4">
            <button className="w-full bg-[#FCE4D6] text-[#D87234] rounded-full py-3 font-bold text-sm hover:bg-[#FAD0C4] transition-colors">
                {t('account.changePassword')}
            </button>
            <button className="w-full bg-[#FCE4D6] text-[#D87234] rounded-full py-3 font-bold text-sm hover:bg-[#FAD0C4] transition-colors">
                {t('account.logoutAll')}
            </button>
            <button className="w-full bg-[#FCE4D6] text-[#D87234] rounded-full py-3 font-bold text-sm hover:bg-[#FAD0C4] transition-colors">
                {t('account.deleteAccount')}
            </button>
        </div>
      </div>
    </div>
  );
}
