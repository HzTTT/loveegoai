import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { EyeIcon } from "../components/Icons";
import imgKoala from "@/assets/8e3a8ca18b6104070e04a9f1cdd5980d520b3a7d.png";
import { register } from "../services/authService";
import { useLanguage } from "../context/LanguageContext";

export default function SignUp() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError(t('auth.fillAll'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }
    if (password.length < 6) {
      setError(t('auth.passwordTooShort'));
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register({ email, password, name });
      navigate('/');
    } catch (e: any) {
      setError(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F3EEEA] p-8 pt-20">
      <h1 className="text-[40px] font-bold mb-8 font-['IM_Fell_DW_Pica']">{t('auth.signUp')}</h1>

      <div className="w-40 h-40 rounded-full overflow-hidden mb-8 shadow-md bg-pink-200 flex items-center justify-center">
         <img src={imgKoala} alt="Koala Avatar" className="w-full h-full object-cover border-4 border-[#4A235A]/20 rounded-full" />
      </div>

      <div className="w-full max-w-xs space-y-6">
        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2">{error}</div>
        )}

        <div className="space-y-2">
            <label className="block font-bold ml-1 font-[IM_FELL_DW_Pica] text-[20px]">{t('auth.name')}</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black outline-none py-2 px-1 transition-colors"
            />
        </div>

        <div className="space-y-2">
            <label className="block font-bold ml-1 font-[IM_FELL_DW_Pica] text-[20px]">{t('auth.email')}</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black outline-none py-2 px-1 transition-colors"
            />
        </div>

        <div className="space-y-2 relative">
            <label className="block font-bold ml-1 font-[IM_FELL_DW_Pica] text-[20px]">{t('auth.password')}</label>
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black outline-none py-2 px-1 transition-colors pr-8"
                />
                <button className="absolute right-0 top-2 text-[#D87234]" onClick={() => setShowPassword(!showPassword)}>
                    <EyeIcon className="w-6 h-4" />
                </button>
            </div>
        </div>

        <div className="space-y-2 relative">
            <label className="block font-bold ml-1 font-[IM_FELL_DW_Pica] text-[20px]">{t('auth.confirmPassword')}</label>
            <div className="relative">
                <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSignUp()}
                    className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black outline-none py-2 px-1 transition-colors pr-8"
                />
                <button className="absolute right-0 top-2 text-[#D87234]" onClick={() => setShowConfirm(!showConfirm)}>
                    <EyeIcon className="w-6 h-4" />
                </button>
            </div>
        </div>

        <button
            onClick={handleSignUp}
            disabled={loading}
            className={`w-full bg-[#222] text-white rounded-[50px] py-4 mt-8 text-xl font-bold transition-colors font-['IM_Fell_DW_Pica'] ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black'}`}
        >
            {loading ? t('auth.signingUp') : t('auth.signUp')}
        </button>

        <div className="text-center text-sm mt-4">
            <span className="text-gray-500">{t('auth.hasAccount')} </span>
            <Link to="/" className="text-[#D87234] font-bold">{t('auth.login')}</Link>
        </div>
      </div>
    </div>
  );
}
