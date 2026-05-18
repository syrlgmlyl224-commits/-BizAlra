import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wand2, User, BarChart3, Crown, HelpCircle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import CookieConsentPopup from "@/components/CookieConsentPopup";
import { useI18n } from "@/lib/i18n";
import { safeGetItem, safeSetItem } from "@/lib/safe-storage";
import { safeGetSessionItem, safeRemoveSessionItem } from "@/lib/safe-storage";

// Luxury Color Palette
const DEEP_MIDNIGHT_BLUE = "#001830";
const PEARL_WHITE = "#FAF9F6";

const HomePage = () => {
  const { lang } = useI18n();
  const navigate = useNavigate();
  const isHe = lang === "he";
  const [showCookiePopup, setShowCookiePopup] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  useEffect(() => {
    // Check if user just completed onboarding and hasn't seen cookie consent
    const onboardingJustCompleted = safeGetSessionItem("onboarding_just_completed");
    const cookieConsentShown = safeGetItem("bizaira_cookie_consent_shown");

    if (onboardingJustCompleted && !cookieConsentShown) {
      setShowCookiePopup(true);
      // Clear the flag so it doesn't show again
      safeRemoveSessionItem("onboarding_just_completed");
    }
  }, []);

  // Feature cards for clean navigation
  const features = [
    {
      id: 1,
      icon: Wand2,
      title: isHe ? "התחל ליצור" : "Start Creating",
      desc: isHe ? "צור תוכן מותאם אישית" : "Create personalized content",
      path: "/create",
    },
    {
      id: 2,
      icon: User,
      title: isHe ? "אזור אישי" : "Personal Area",
      desc: isHe ? "נהל את הפרופיל שלך" : "Manage your profile",
      path: "/profile",
    },
    {
      id: 3,
      icon: BarChart3,
      title: isHe ? "מעקב פעילות" : "Activity Tracking",
      desc: isHe ? "צפה בסטטיסטיקות השימוש" : "View usage statistics",
      path: "/create/analytics",
    },
    {
      id: 4,
      icon: Crown,
      title: isHe ? "ניהול מנוי" : "Subscription Management",
      desc: isHe ? "שדרג את התוכנית שלך" : "Upgrade your plan",
      path: "/pricing",
    },
    {
      id: 5,
      icon: HelpCircle,
      title: isHe ? "תמיכה" : "Support",
      desc: isHe ? "קבל עזרה ותמיכה" : "Get help and support",
      path: "/support",
    },
  ];

  return (
    <div
      className="min-h-screen pb-24 px-4 sm:px-6 md:px-8"
      dir={isHe ? "rtl" : "ltr"}
      style={{ backgroundColor: PEARL_WHITE }}
    >
      {/* Clean Header with Login Button */}
      <div className="pt-12 pb-12 max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-3 text-right"
            style={{ color: DEEP_MIDNIGHT_BLUE, fontFamily: "Inter, system-ui, sans-serif", fontWeight: 700, letterSpacing: "-0.03em" }}
          >
            {isHe ? "היי, מה תרצה לבנות היום?" : "Hey, what would you like to build today?"}
          </h1>
        </div>
        <button
          onClick={() => navigate("/auth")}
          className="px-6 sm:px-8 py-3 rounded-2xl font-semibold text-white text-sm sm:text-base hover:shadow-lg transition-all duration-300 active:scale-95 shrink-0"
          style={{ backgroundColor: DEEP_MIDNIGHT_BLUE, fontFamily: "Inter, system-ui, sans-serif" }}
        >
          {isHe ? "התחברות / הרשמה" : "Login / Sign Up"}
        </button>
      </div>

      {/* Navigation Grid */}
      <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-4 md:gap-5">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            const isSelected = selectedFeature === feature.id;

            return (
              <button
                key={feature.id}
                type="button"
                onClick={() => {
                  setSelectedFeature(feature.id);
                  navigate(feature.path);
                }}
                // enforce exact midnight color when active and strong contrast for children
                className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-5 text-left shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[${DEEP_MIDNIGHT_BLUE}] ${
                  isSelected ? "shadow-md border-transparent" : "hover:shadow-md"
                }`}
                style={{ backgroundColor: isSelected ? DEEP_MIDNIGHT_BLUE : undefined }}
              >
                <div className="relative z-10">
                  <div
                    // when selected: remove dark icon container and force transparent so icon sits on midnight background
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-200 ${
                      isSelected
                        ? "border-transparent bg-transparent text-white"
                        : "border-gray-200 bg-white text-[#2D3748] group-hover:border-transparent group-hover:bg-[#001830] group-hover:text-white"
                    }`}
                  >
                    <IconComponent
                      size={24}
                      // enforce absolute icon color on hover/active
                      className={`transition-all duration-200 ${isSelected ? "text-white" : "text-[#2D3748] group-hover:text-white"}`}
                    />
                  </div>
                  <h3
                    className={`text-lg font-semibold tracking-tight transition-all duration-200 ${
                      isSelected ? "text-white" : "text-[#2D3748] group-hover:text-white"
                    }`}
                    style={{ fontFamily: "Inter, system-ui, sans-serif", color: isSelected ? "#FFFFFF" : undefined }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`mt-2 text-sm leading-6 transition-all duration-200 ${
                      isSelected ? "text-white" : "text-[#2D3748] group-hover:text-white"
                    }`}
                    style={{ color: isSelected ? "#FFFFFF" : undefined }}
                  >
                    {feature.desc}
                  </p>
                </div>
                {/* enforce group-hover strong override for all inner text/icons */}
                <style>{`.group:hover .group-hover\\:text-white{color: #FFFFFF !important}`}</style>
              </button>
            );
          })}
        </div>
      </div>
      <CookieConsentPopup 
        isVisible={showCookiePopup} 
        onConsent={() => setShowCookiePopup(false)} 
      />
      <BottomNav />
    </div>
  );
};

export default HomePage;
