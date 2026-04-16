import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { FacebookIcon, GoogleIcon } from "../components/Icons";
import imgKoala from "@/assets/8e3a8ca18b6104070e04a9f1cdd5980d520b3a7d.png";
import { login } from "../services/authService";
import { useUser } from "../context/UserContext";
import { useLanguage } from "../context/LanguageContext";

export default function SignIn() {
  const navigate = useNavigate();
  const { setName } = useUser();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError(t('auth.fillAll'));
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      setName(email.split('@')[0]);
      navigate('/home');
    } catch (e: any) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F3EEEA] p-8 pt-20">
      <h1 className="text-[40px] font-bold mb-8 font-['IM_Fell_DW_Pica']">{t('auth.signIn')}</h1>

      <div className="w-40 h-40 rounded-full overflow-hidden mb-12 shadow-md">
        <img src={imgKoala} alt="Koala Avatar" className="w-full h-full object-cover border-4 border-[#4A235A]/20 rounded-full" />
      </div>

      <div className="w-full max-w-xs space-y-6">
        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2">{error}</div>
        )}

        <div className="space-y-2">
            <label className="block font-bold ml-1 font-[IM_FELL_DW_Pica] text-[20px]">{t('auth.email')}</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black outline-none py-2 px-1 transition-colors"
            />
        </div>

        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="block font-bold ml-1 font-[IM_FELL_DW_Pica] text-[20px]">{t('auth.password')}</label>
                <Link to="#" className="text-[#D87234] text-xs font-bold">{t('auth.forgotPassword')}</Link>
            </div>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black outline-none py-2 px-1 transition-colors"
            />
        </div>

        <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full bg-[#222] text-white rounded-[50px] py-4 mt-8 text-xl font-bold transition-colors font-['IM_Fell_DW_Pica'] ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black'}`}
        >
            {loading ? t('auth.loggingIn') : t('auth.login')}
        </button>

        <div className="text-center text-sm"><span className="text-gray-500">{t('auth.noAccount')} </span><Link to="/signup" className="text-[#D87234] font-bold">{t('auth.signUp')}</Link></div>

        <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
                <div className="absolute w-full border-t border-gray-300"></div>
                <span className="relative bg-[#F3EEEA] px-4 text-[#D87234] text-sm">{t('auth.signInWith')}</span>
            </div>

            <div className="flex justify-center gap-6">
                <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm">
                    <FacebookIcon className="w-8 h-8" />
                </button>
                <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm">
                     <span className="text-[#0077B5] font-bold text-xl">in</span>
                </button>
                <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm">
                    <GoogleIcon className="w-8 h-8" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
