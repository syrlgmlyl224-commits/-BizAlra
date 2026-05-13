import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { CookieConsent, setCookieConsent, loadTrackingScripts } from '@/lib/cookie-consent';
import { safeSetItem } from '@/lib/safe-storage';

interface CookieConsentPopupProps {
  onConsent: (consent: CookieConsent) => void;
  isVisible: boolean;
}

const CookieConsentPopup = ({ onConsent, isVisible }: CookieConsentPopupProps) => {
  const { t, lang } = useI18n();
  const isHe = lang === "he";
  const [showCustomize, setShowCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  if (!isVisible) return null;

  const handleAcceptAll = () => {
    const consent: CookieConsent = { analytics: true, marketing: true };
    setCookieConsent(consent);
    loadTrackingScripts(consent);
    safeSetItem("bizaira_cookie_consent_shown", "true");
    onConsent(consent);
  };

  const handleRejectAll = () => {
    const consent: CookieConsent = { analytics: false, marketing: false };
    setCookieConsent(consent);
    safeSetItem("bizaira_cookie_consent_shown", "true");
    onConsent(consent);
  };

  const handleCustomize = () => {
    setShowCustomize(!showCustomize);
  };

  const handleSaveCustom = () => {
    const consent: CookieConsent = { analytics, marketing };
    setCookieConsent(consent);
    loadTrackingScripts(consent);
    safeSetItem("bizaira_cookie_consent_shown", "true");
    onConsent(consent);
    setShowCustomize(false);
  };

  const DEEP_MIDNIGHT_BLUE = "#000810";
  const PEARL_WHITE = "#F9FAFB";
  const LIGHT_GRAY = "#E5E7EB";

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      dir={isHe ? "rtl" : "ltr"}
    >
      <div
        className="rounded-2xl p-8 max-w-md w-full shadow-xl"
        style={{ backgroundColor: "#FFFFFF", boxShadow: "0 20px 60px rgba(0, 21, 41, 0.15)" }}
      >
        {!showCustomize ? (
          <>
            {/* Header */}
            <h2
              className="text-xl font-bold text-center mb-4"
              style={{ color: DEEP_MIDNIGHT_BLUE, fontFamily: "'Assistant', sans-serif" }}
            >
              {t("cookie.settings")}
            </h2>

            {/* Message */}
            <p
              className="text-sm text-center mb-6 leading-relaxed"
              style={{ color: "#747474", fontFamily: isHe ? "'Heebo', sans-serif" : "'Assistant', sans-serif" }}
            >
              {t("cookie.consent.message")}
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAcceptAll}
                className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all duration-300 hover:shadow-lg active:scale-95"
                style={{ backgroundColor: DEEP_MIDNIGHT_BLUE, fontFamily: "'Assistant', sans-serif" }}
              >
                {t("cookie.consent.acceptAll")}
              </button>

              <button
                onClick={handleCustomize}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 border hover:shadow-lg active:scale-95"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: DEEP_MIDNIGHT_BLUE,
                  borderColor: LIGHT_GRAY,
                  fontFamily: "'Assistant', sans-serif",
                }}
              >
                {t("cookie.consent.customize")}
              </button>

              <button
                onClick={handleRejectAll}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg active:scale-95"
                style={{
                  backgroundColor: LIGHT_GRAY,
                  color: "#4B5563",
                  fontFamily: "'Assistant', sans-serif",
                }}
              >
                {t("cookie.consent.rejectNonEssential")}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Customize View */}
            <h2
              className="text-xl font-bold text-center mb-6"
              style={{ color: DEEP_MIDNIGHT_BLUE, fontFamily: "'Assistant', sans-serif" }}
            >
              {t("cookie.consent.customizeTitle")}
            </h2>

            <div className="space-y-4 mb-6">
              {/* Analytics Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded"
                  style={{ accentColor: DEEP_MIDNIGHT_BLUE }}
                />
                <span
                  className="text-sm leading-relaxed"
                  style={{ color: "#747474", fontFamily: isHe ? "'Heebo', sans-serif" : "'Assistant', sans-serif" }}
                >
                  {t("cookie.consent.analytics")}
                </span>
              </label>

              {/* Marketing Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded"
                  style={{ accentColor: DEEP_MIDNIGHT_BLUE }}
                />
                <span
                  className="text-sm leading-relaxed"
                  style={{ color: "#747474", fontFamily: isHe ? "'Heebo', sans-serif" : "'Assistant', sans-serif" }}
                >
                  {t("cookie.consent.marketing")}
                </span>
              </label>

              {/* Info Text */}
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#999999", fontFamily: isHe ? "'Heebo', sans-serif" : "'Assistant', sans-serif" }}
              >
                {t("cookie.consent.strictlyNecessary")}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSaveCustom}
                className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all duration-300 hover:shadow-lg active:scale-95"
                style={{ backgroundColor: DEEP_MIDNIGHT_BLUE, fontFamily: "'Assistant', sans-serif" }}
              >
                {t("cookie.consent.save")}
              </button>

              <button
                onClick={handleCustomize}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 border"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: DEEP_MIDNIGHT_BLUE,
                  borderColor: LIGHT_GRAY,
                  fontFamily: "'Assistant', sans-serif",
                }}
              >
                {t("cookie.consent.back")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CookieConsentPopup;