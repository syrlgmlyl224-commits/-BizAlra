import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, User, Phone, Loader2, Eye, EyeOff } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { createGuestSession, updateGuestSession, getSavedGuestAnswers } from "@/lib/guest-session";

const MIDNIGHT_BLACK = "#000810";
const INPUT_BG = "#F9F9FB";
const PEARL_WHITE = "#F9FAFB";

interface AuthGatewayProps {
  onComplete: (mode: "guest" | "auth") => void;
  onboardingData?: {
    business_type: string;
    target_audience: string;
    business_goals: string;
  };
}

const AuthGateway = ({ onComplete, onboardingData }: AuthGatewayProps) => {
  const { lang, t } = useI18n();
  const navigate = useNavigate();
  const isHe = lang === "he";
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && (!name || !email || !password || !phone)) {
      toast.error(t("auth.gateway.error.fillAllFields"));
      return;
    }
    if (!isLogin && !agreePolicy) {
      toast.error(t("auth.gateway.error.acceptSecurityPolicy"));
      return;
    }
    if (isLogin && (!email || !password)) {
      toast.error(t("auth.gateway.error.fillEmailPassword"));
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(t("auth.gateway.success.login"));
        onComplete("auth");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              phone: phone,
              ...getSavedGuestAnswers(),
            },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success(t("auth.gateway.success.signup"));
        onComplete("auth");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    createGuestSession();
    updateGuestSession(onboardingData || {});
    onComplete("guest");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 py-10 overflow-y-auto"
      dir={isHe ? "rtl" : "ltr"}
      style={{ backgroundColor: PEARL_WHITE }}
    >
      <div className="w-full max-w-sm mx-auto">

        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: `linear-gradient(135deg, ${MIDNIGHT_BLACK} 0%, ${MIDNIGHT_BLACK} 100%)`, boxShadow: "0 8px 24px -4px rgba(0,31,63,0.35)" }}
          >
            <Sparkles size={28} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight" style={{ color: MIDNIGHT_BLACK, fontFamily: "'Assistant', sans-serif", fontWeight: 700 }}>
            {t("auth.gateway.joinToday")}
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight" style={{ color: MIDNIGHT_BLACK, fontFamily: "'Assistant', sans-serif", fontWeight: 700 }}>
            {isLogin ? t("auth.gateway.startNow") : ""}
          </h2>
          <p className="text-sm mt-3" style={{ color: "#747474" }}>
            {isLogin ? t("auth.gateway.signInToContinue") : t("auth.gateway.openAccount")}
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-7 space-y-5 transition-opacity duration-300 max-h-[calc(100vh-180px)] overflow-y-auto pb-8"
          style={{ backgroundColor: "#FFFFFF", boxShadow: "0 8px 40px -8px rgba(0,31,63,0.1)" }}
        >
          {/* Name field */}
          {!isLogin && (
            <FieldWrapper label={t("auth.gateway.fullName")}>
              <div className="relative">
                <User
                  size={15}
                  strokeWidth={1.5}
                  className="absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  style={{ [isHe ? "right" : "left"]: "14px" }}
                />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t("auth.gateway.fullName")}
                  className="w-full rounded-2xl py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all"
                  style={{
                    backgroundColor: INPUT_BG,
                    border: "none",
                    [isHe ? "paddingRight" : "paddingLeft"]: "40px",
                    [isHe ? "paddingLeft" : "paddingRight"]: "16px"
                  }}
                  onFocus={(e) => e.target.style.border = "1px solid #000"}
                  onBlur={(e) => e.target.style.border = "none"}
                />
              </div>
            </FieldWrapper>
          )}

          {/* Phone field */}
          {!isLogin && (
            <FieldWrapper label={t("auth.gateway.phoneNumber")}>
              <div className="relative">
                <Phone
                  size={15}
                  strokeWidth={1.5}
                  className="absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  style={{ [isHe ? "right" : "left"]: "14px" }}
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder={t("auth.gateway.phoneNumber")}
                  dir="ltr"
                  className="w-full rounded-2xl py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all"
                  style={{
                    backgroundColor: INPUT_BG,
                    border: "none",
                    [isHe ? "paddingRight" : "paddingLeft"]: "40px",
                    [isHe ? "paddingLeft" : "paddingRight"]: "16px"
                  }}
                  onFocus={(e) => e.target.style.border = "1px solid #000"}
                  onBlur={(e) => e.target.style.border = "none"}
                />
              </div>
            </FieldWrapper>
          )}

          {/* Email */}
          <FieldWrapper label={t("auth.gateway.email")}> 
            <div className="relative">
              <Mail
                size={15}
                strokeWidth={1.5}
                className="absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                style={{ [isHe ? "right" : "left"]: "14px" }}
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                dir="ltr"
                className="w-full rounded-2xl py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all"
                style={{
                  backgroundColor: INPUT_BG,
                  border: "none",
                  [isHe ? "paddingRight" : "paddingLeft"]: "40px",
                  [isHe ? "paddingLeft" : "paddingRight"]: "16px"
                }}
                onFocus={(e) => e.target.style.border = "1px solid #000"}
                onBlur={(e) => e.target.style.border = "none"}
              />
            </div>
          </FieldWrapper>

          {/* Password */}
          <FieldWrapper label={t("auth.gateway.password")}> 
            <div className="relative">
              <Lock
                size={15}
                strokeWidth={1.5}
                className="absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                style={{ [isHe ? "right" : "left"]: "14px" }}
              />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full rounded-2xl py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all"
                style={{
                  backgroundColor: INPUT_BG,
                  border: "none",
                  [isHe ? "paddingRight" : "paddingLeft"]: "40px",
                  [isHe ? "paddingLeft" : "paddingRight"]: "40px"
                }}
                onFocus={(e) => e.target.style.border = "1px solid #000"}
                onBlur={(e) => e.target.style.border = "none"}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                style={{ [isHe ? "left" : "right"]: "14px" }}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </FieldWrapper>

          {/* Security policy */}
          {!isLogin && (
            <div className="flex items-start gap-3 mt-2">
              <input
                id="security-policy"
                type="checkbox"
                checked={agreePolicy}
                onChange={(e) => setAgreePolicy(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              />
              <label htmlFor="security-policy" className="text-sm text-gray-700">
                {t("auth.gateway.privacyAgreement")}
              </label>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || (!isLogin && !agreePolicy)}
            className="w-full py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            style={{ backgroundColor: MIDNIGHT_BLACK }}
          >
            {loading
              ? <Loader2 size={18} className="animate-spin" />
              : <Sparkles size={18} />}
            {isLogin ? t("auth.gateway.startNow") : t("auth.gateway.auth.signup")}
          </button>

          {/* Toggle */}
          <div className="text-center pt-3">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-semibold transition-colors"
              style={{ color: MIDNIGHT_BLACK, fontFamily: "'Heebo', sans-serif" }}
            >
              {isLogin ? t("auth.gateway.signupPrompt") : t("auth.gateway.loginPrompt")}
            </button>
          </div>
        </form>

        {/* Continue as guest link */}
        <div className="text-center mt-6 pb-6">
          <button
            type="button"
            onClick={handleGuest}
            className="text-sm font-medium transition-colors underline"
            style={{ color: MIDNIGHT_BLACK, fontFamily: "'Heebo', sans-serif" }}
          >
            {t("auth.gateway.continueAsGuest")}
          </button>
        </div>
      </div>
    </div>
  );
};

const FieldWrapper = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block">
      {label}
    </label>
    {children}
  </div>
);

export default AuthGateway;