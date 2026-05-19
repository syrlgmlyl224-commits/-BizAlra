import { Check, Rocket } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const PricingPage = () => {
  const { t, lang } = useI18n();

  const plans = [
    {
      name: "Free",
      price: lang === "he" ? "₪0" : "$0",
      priceLabel: t("pricing.startFree"),
      highlight: false,
      features: [
        "2 AI creations / month",
        "Standard quality",
        "Watermark",
        "Basic controls",
        "Selected tools",
      ],
      featuresHe: [
        "2 יצירות AI בחודש",
        "איכות סטנדרטית",
        "סימן מים",
        "שליטה בסיסית",
        "כלים נבחרים",
      ],
    },
    {
      name: "Pro",
      price: lang === "he" ? "₪29" : "$9",
      period: lang === "he" ? "/ לחודש" : "/ month",
      priceLabel: t("pricing.upgradeNow"),
      highlight: true,
      features: [
        "Unlimited creations",
        "Presentations, product photos",
        "AI Messages",
        "High quality",
        "No watermarks",
        "Full control of all tools",
      ],
      featuresHe: [
        "יצירות ללא הגבלה",
        "תמונות מוצר, תוכן שיווקי",
        "הודעות AI",
        "איכות גבוהה",
        "ללא סימני מים",
        "שליטה מלאה בכל הכלים",
      ],
    },
    {
      name: "Business",
      price: lang === "he" ? "₪59" : "$19",
      period: lang === "he" ? "/ לחודש" : "/ month",
      priceLabel: t("pricing.upgradeNow"),
      highlight: false,
      features: [
        "Everything in Pro",
        "Maximum file quality",
        "Advanced business analytics",
        "Smart pricing system",
        "Smart time management",
        "Multiple versions per creation",
        "AI processing priority",
        "Large image packs",
      ],
      featuresHe: [
        "הכל ב-Pro",
        "איכות קבצים מקסימלית",
        "ניתוח עסקי מתקדם",
        "מערכת תמחור חכמה",
        "ניהול זמן חכם",
        "יצירת גרסאות מרובות",
        "עדיפות בעיבוד AI",
        "חבילות תמונות גדולות",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#001830]" dir={lang === "he" ? "rtl" : "ltr"} style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-[#001830] sm:text-4xl">
            {t("pricing.title")}
          </h1>
          <p className="mt-4 text-base leading-7 text-[#475569] sm:text-lg">
            {t("pricing.subtitle")}
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {plans.map((plan, i) => {
            const featureList = lang === "he" ? plan.featuresHe : plan.features;
            const isPro = plan.highlight;
            return (
              <div
                key={plan.name}
                className={`group relative flex min-h-[30rem] flex-col justify-between overflow-hidden rounded-[16px] border border-[#E0E0E0] bg-white/90 p-6 text-[#001830] transition-all duration-300 ease-in-out hover:bg-[#0a192f] hover:text-white ${
                  isPro ? "lg:min-h-[34rem] shadow-sm ring-1 ring-[#2563EB]/10" : "shadow-sm"
                }`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {isPro && (
                  <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full border border-[#2563EB]/30 bg-white/95 px-4 py-1 text-xs font-semibold tracking-[0.12em] text-[#2563EB] shadow-sm">
                    {lang === "he" ? "הפופולרי ביותר" : "Most Popular"}
                  </div>
                )}

                <div className="space-y-8 pt-6 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-[#E0E0E0] bg-[#F8F9FA] text-[#001830] transition-colors duration-300 group-hover:border-transparent group-hover:bg-white/10 group-hover:text-white">
                    <Check size={26} strokeWidth={2} className="transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <div className="space-y-4 px-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#64748B]">
                      {lang === "he" ? "תוכנית" : "Plan"}
                    </p>
                    <h2 className="text-2xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-white">
                      {plan.name}
                    </h2>
                    <div className="space-y-1">
                      <p className="text-5xl font-bold tracking-tight transition-colors duration-300 group-hover:text-white">
                        {plan.price}
                      </p>
                      {'period' in plan && (
                        <p className="text-sm text-[#64748B] transition-colors duration-300 group-hover:text-white/80">
                          {(plan as any).period}
                        </p>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 px-2 text-left text-[#475569] transition-colors duration-300 group-hover:text-white/90">
                    {featureList.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm leading-6">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E0E0E0] bg-[#F8F9FA] text-[#001830] transition-colors duration-300 group-hover:border-white group-hover:bg-white/10 group-hover:text-white">
                          <Check size={14} strokeWidth={2} />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-[#E0E0E0] bg-white px-5 py-3 text-sm font-semibold text-[#001830] transition-all duration-300 hover:bg-white/10 hover:text-white group-hover:border-transparent group-hover:bg-white/10 group-hover:text-white">
                  <Rocket size={16} className="transition-colors duration-300 group-hover:text-white" />
                  {plan.name === "Free" ? t("pricing.startFree") : t("pricing.upgradeNow")}
                </button>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-[#64748B]">{t("pricing.footer")}</p>
      </div>
    </div>
  );
};

export default PricingPage;
