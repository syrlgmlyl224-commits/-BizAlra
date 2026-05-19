import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import bizairaLogo from "@/assets/bizaira-logo.png";
import { useI18n } from "@/lib/i18n";

const OnboardingWelcome = () => {
  const navigate = useNavigate();
  const { lang, setLang, t } = useI18n();
  const isHe = lang === "he";

  const handleSelect = (option: "en" | "he") => {
    setLang(option);
  };

  const handleContinue = () => {
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-[#000B18] flex items-center justify-center px-4 py-10" dir={isHe ? "rtl" : "ltr"}>
      <div className="w-full max-w-3xl">
        <div className="rounded-[28px] border border-[#F5F5DC]/10 bg-[#000B18]/60 backdrop-blur-xl p-8 shadow-[0_40px_120px_rgba(0,11,24,0.24)]">
          <div className="text-center">
            <img src={bizairaLogo} alt="BizAIra" className="mx-auto h-12" />
            <p className="mt-6 text-xs uppercase tracking-[0.35em] text-[#F5F5DC]/70">
              {t("onboarding.welcome.step")}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[0.08em] text-[#F5F5DC]">
              {t("onboarding.welcome.title")}
            </h1>
            <p className="mt-4 text-sm leading-7 text-[#F5F5DC]/75 max-w-2xl mx-auto">
              {t("onboarding.welcome.description")}
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {([
              { key: "en", label: t("onboarding.languages.english") },
              { key: "he", label: t("onboarding.languages.hebrew") },
            ] as const).map((option) => {
              const selected = lang === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => handleSelect(option.key)}
                  className={`min-h-[11rem] rounded-[24px] border p-6 text-left text-sm font-semibold transition-all duration-300 ${
                    selected
                      ? "border-[#F5F5DC]/40 bg-[#F5F5DC]/10 text-[#F5F5DC]"
                      : "border-[#F5F5DC]/10 bg-[#000B18]/40 text-[#F5F5DC]/90 hover:border-[#F5F5DC]/25 hover:bg-[#F5F5DC]/08"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="mt-8 rounded-[24px] border border-[#F5F5DC]/10 bg-[#F5F5DC]/5 p-5 text-center text-sm text-[#F5F5DC]/75">
            {t("onboarding.selectedLanguage", { lang: isHe ? "עברית" : "English" })}
          </div>

          <button
            onClick={handleContinue}
            className="mt-6 w-full rounded-[24px] bg-[#F5F5DC] px-6 py-4 text-sm font-semibold text-[#000B18] uppercase tracking-[0.08em] transition duration-300"
          >
            {t("onboarding.continue")}
            <ArrowRight size={16} className="inline-block ms-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWelcome;
