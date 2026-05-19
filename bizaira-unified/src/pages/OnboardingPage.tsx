import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft, ArrowRight, Briefcase, User, Mail, Lock, Wand2, BarChart3, MessageSquare, Camera, Check } from "lucide-react";
import bizairaLogo from "@/assets/bizaira-logo.png";
import { useI18n } from "@/lib/i18n";
import { getGuestSession } from "@/lib/guest-session";
import { safeGetSessionItem } from "@/lib/safe-storage";

const BUSINESS_TYPE_KEYS = [
  "fashion", "food", "beauty", "realEstate", "digital", "services", "health", "education", "other",
] as const;

type BusinessTypeKey = (typeof BUSINESS_TYPE_KEYS)[number];

const OnboardingPage = () => {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [businessType, setBusinessType] = useState<BusinessTypeKey | "">("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const businessTypes = BUSINESS_TYPE_KEYS.map((key) => ({ key, label: t(`onboarding.business.${key}`) }));
  const BackArrow = lang === "he" ? ArrowLeft : ArrowRight;
  const NextArrow = lang === "he" ? ArrowRight : ArrowLeft;

  const selectedBusinessLabel = businessTypes.find((item) => item.key === businessType)?.label || "";
  const canContinueStep1 = userName.trim().length > 0;
  const canContinueStep2 = email.trim().length > 0 && password.trim().length > 0;

  const handleFinish = () => {
    const isGuest = safeGetSessionItem("onboarding_complete") === "true" && !!getGuestSession();
    navigate(isGuest ? "/" : "/dashboard");
  };

  const features = [
    {
      icon: Wand2,
      title: t("onboarding.page.features.title.marketing"),
      desc: t("onboarding.page.features.desc.marketing"),
    },
    {
      icon: BarChart3,
      title: t("onboarding.page.features.title.analytics"),
      desc: t("onboarding.page.features.desc.analytics"),
    },
    {
      icon: MessageSquare,
      title: t("onboarding.page.features.title.messages"),
      desc: t("onboarding.page.features.desc.messages"),
    },
    {
      icon: Camera,
      title: t("onboarding.page.features.title.photos"),
      desc: t("onboarding.page.features.desc.photos"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#000B18] flex items-center justify-center px-4 py-10" dir={lang === "he" ? "rtl" : "ltr"}>
      <div className="w-full max-w-3xl">
        <div className="rounded-[28px] border border-[#F5F5DC]/10 bg-[#000B18]/60 backdrop-blur-xl p-8 shadow-[0_40px_120px_rgba(0,11,24,0.2)]">
          <div className="text-center mb-10">
            <img src={bizairaLogo} alt="BizAIra" className="mx-auto h-12" />
            <div className="mt-4 text-xs uppercase tracking-[0.4em] text-[#F5F5DC]/70">
              {t("onboarding.stepCounter", { num: step + 1, total: 4 })}
            </div>
          </div>

          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-semibold tracking-[0.08em] text-[#F5F5DC]">
                  {t("onboarding.page.business.title")}
                </h1>
                <p className="mt-4 text-sm leading-7 text-[#F5F5DC]/75">
                  {t("onboarding.welcome.description")}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {businessTypes.map((type) => (
                  <button
                    key={type.key}
                    onClick={() => setBusinessType(type.key)}
                    className={`min-h-[10rem] rounded-[24px] border p-5 text-left transition-all duration-300 ${
                      businessType === type.key
                        ? "border-[#F5F5DC]/40 bg-[#F5F5DC]/10"
                        : "border-[#F5F5DC]/10 bg-[#000B18]/40 hover:border-[#F5F5DC]/25 hover:bg-[#F5F5DC]/08"
                    }`}
                  >
                    <span className="text-sm font-semibold text-[#F5F5DC]">{type.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => businessType && setStep(1)}
                disabled={!businessType}
                className="w-full rounded-[20px] bg-[#F5F5DC] px-6 py-3 text-sm font-semibold text-[#000B18] uppercase tracking-[0.08em] transition duration-300 disabled:opacity-40"
              >
                {t("onboarding.continue")}
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-semibold tracking-[0.08em] text-[#F5F5DC]">
                  {t("onboarding.page.name.title")}
                </h1>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-[#F5F5DC]/80">{t("auth.fullName")}</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder={t("onboarding.page.name.placeholder")}
                  className="w-full rounded-[20px] border border-[#F5F5DC]/10 bg-[#000B18]/30 px-4 py-3 text-[#F5F5DC] placeholder:text-[#F5F5DC]/70 outline-none transition focus:border-[#F5F5DC]/30 focus:ring-2 focus:ring-[#F5F5DC]/10"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setStep(0)}
                  className="w-full rounded-[20px] border border-[#F5F5DC]/15 bg-[#000B18]/30 px-6 py-3 text-sm font-semibold text-[#F5F5DC] transition hover:border-[#F5F5DC]/30"
                >
                  <BackArrow size={16} className="inline-block" />
                </button>
                <button
                  onClick={() => canContinueStep1 && setStep(2)}
                  disabled={!canContinueStep1}
                  className="w-full rounded-[20px] bg-[#F5F5DC] px-6 py-3 text-sm font-semibold text-[#000B18] uppercase tracking-[0.08em] transition duration-300 disabled:opacity-40"
                >
                  {t("onboarding.continue")}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-semibold tracking-[0.08em] text-[#F5F5DC]">
                  {t("onboarding.page.login.title")}
                </h1>
                <p className="mt-4 text-sm leading-7 text-[#F5F5DC]/75">
                  {t("onboarding.welcome.description")}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#F5F5DC]/80">{t("auth.emailLabel")}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full rounded-[20px] border border-[#F5F5DC]/10 bg-[#000B18]/30 px-4 py-3 text-[#F5F5DC] placeholder:text-[#F5F5DC]/70 outline-none transition focus:border-[#F5F5DC]/30 focus:ring-2 focus:ring-[#F5F5DC]/10"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#F5F5DC]/80">{t("auth.passwordLabel")}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-[20px] border border-[#F5F5DC]/10 bg-[#000B18]/30 px-4 py-3 text-[#F5F5DC] placeholder:text-[#F5F5DC]/70 outline-none transition focus:border-[#F5F5DC]/30 focus:ring-2 focus:ring-[#F5F5DC]/10"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setStep(1)}
                  className="w-full rounded-[20px] border border-[#F5F5DC]/15 bg-[#000B18]/30 px-6 py-3 text-sm font-semibold text-[#F5F5DC] transition hover:border-[#F5F5DC]/30"
                >
                  <BackArrow size={16} className="inline-block" />
                </button>
                <button
                  onClick={() => canContinueStep2 && setStep(3)}
                  disabled={!canContinueStep2}
                  className="w-full rounded-[20px] bg-[#F5F5DC] px-6 py-3 text-sm font-semibold text-[#000B18] uppercase tracking-[0.08em] transition duration-300 disabled:opacity-40"
                >
                  {t("auth.createAccount")}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.35em] text-[#F5F5DC]/60">
                  {t("onboarding.businessInfo.title")}
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-[0.08em] text-[#F5F5DC]">
                  {t("onboarding.businessInfo.perfect")}
                </h1>
                <p className="mt-4 text-sm leading-7 text-[#F5F5DC]/70 max-w-2xl mx-auto">
                  {t("onboarding.businessInfo.confirmationDescription", { businessType: selectedBusinessLabel })}
                </p>
              </div>

              <div className="space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="rounded-[24px] border border-[#F5F5DC]/10 bg-[#000B18]/30 p-5 flex items-start gap-4">
                      <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-3xl border border-[#F5F5DC]/15 bg-[#F5F5DC]/10 text-[#F5F5DC]">
                        <Check size={18} />
                      </div>
                      <div>
                        <h2 className="text-base font-semibold text-[#F5F5DC]">{feature.title}</h2>
                        <p className="mt-1 text-sm leading-6 text-[#F5F5DC]/75">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleFinish}
                className="w-full rounded-[24px] bg-[#F5F5DC] px-8 py-4 text-sm font-semibold text-[#000B18] uppercase tracking-[0.08em] transition duration-300"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Sparkles size={16} />
                  {t("onboarding.page.getStarted")}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
