import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Volume2,
  Video,
  Image,
  Type,
  Plus,
  Download,
  Trash2,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { getActivityStats } from "@/lib/activity-tracker";

const DEEP_MIDNIGHT_BLUE = "#000810";
const CLEAN_WHITE = "#FFFFFF";
const COOL_GRAY = "#6B7280";
const SOFT_BORDER = "#E5E7EB";

const tabs = [
  { id: "text", labelHe: "טקסט", labelEn: "Text", icon: Type },
  { id: "image", labelHe: "תמונה", labelEn: "Image", icon: Image },
  { id: "video", labelHe: "וידאו", labelEn: "Video", icon: Video },
  { id: "audio", labelHe: "אודיו", labelEn: "Audio", icon: Volume2 },
];

const cards = [
  { id: "creations", labelHe: "יצירות", labelEn: "Creations", icon: Plus },
  { id: "downloads", labelHe: "הורדות", labelEn: "Downloads", icon: Download },
  { id: "deletions", labelHe: "מחיקות", labelEn: "Deletions", icon: Trash2 },
];

const ProfilePage = () => {
  const { lang } = useI18n();
  const isHe = lang === "he";
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  const [stats, setStats] = useState(() => getActivityStats());

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    setStats(getActivityStats());
  }, [user, navigate]);

  const { creationsCount, downloadsCount, deletionsCount, totalActions, limit, nextRenewalDate, weeklyTotal, dailyTotal, firstUseDate } = stats;
  const remainingCredits = limit - totalActions;
  const remainingPercent = limit > 0 ? Math.min(100, Math.round((remainingCredits / limit) * 100)) : 0;
  const progressStyle = {
    width: `${remainingPercent}%`,
    backgroundColor: DEEP_MIDNIGHT_BLUE,
    marginInlineStart: isHe ? "auto" : undefined,
  };

  const planLabel = profile?.plan ? `${profile.plan} Plan` : (isHe ? "Free Plan" : "Free Plan");
  const firstUseLabel = firstUseDate
    ? new Date(firstUseDate).toLocaleDateString(isHe ? "he-IL" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : isHe ? "טרם נקבע" : "Not set";
  const renewalLabel = nextRenewalDate
    ? nextRenewalDate.toLocaleDateString(isHe ? "he-IL" : "en-US", {
        day: "numeric",
        month: "short",
      })
    : isHe ? "טרם נקבע" : "Not set";

  return (
    <div
      className="min-h-screen pb-20"
      style={{ backgroundColor: CLEAN_WHITE, color: DEEP_MIDNIGHT_BLUE }}
      dir={isHe ? "rtl" : "ltr"}
    >
      {/* Top Section */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => navigate("/pricing")}
            className="rounded-lg bg-[#000810] px-4 py-2 text-sm font-medium text-white hover:bg-[#000a1a]"
          >
            {isHe ? "שדרג ל-PRO" : "Upgrade to PRO"}
          </button>
          <div className="text-right">
            <div className="text-sm font-medium" style={{ color: DEEP_MIDNIGHT_BLUE }}>
              {isHe ? "קרדיטים" : "Credits"}
            </div>
            <div className="text-sm font-medium" style={{ color: DEEP_MIDNIGHT_BLUE }}>
              {planLabel}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-2xl font-bold mb-3" style={{ color: DEEP_MIDNIGHT_BLUE }}>
            {remainingCredits} / {limit}
          </p>
          <div className="h-1 overflow-hidden rounded-full bg-[#E5E7EB]">
            <div className="h-full transition-all duration-500" style={progressStyle} />
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="px-6 mb-8">
        {/* Data Rows */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Calendar size={16} style={{ color: COOL_GRAY }} />
              <span className="text-sm" style={{ color: COOL_GRAY }}>
                {isHe ? "שימוש ראשון" : "First Use"}
              </span>
            </div>
            <p className="text-lg font-medium" style={{ color: DEEP_MIDNIGHT_BLUE }}>
              {firstUseLabel}
            </p>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RefreshCw size={16} style={{ color: COOL_GRAY }} />
              <span className="text-sm" style={{ color: COOL_GRAY }}>
                {isHe ? "חידוש הבא" : "Next Renewal"}
              </span>
            </div>
            <p className="text-lg font-medium" style={{ color: DEEP_MIDNIGHT_BLUE }}>
              {renewalLabel}
            </p>
          </div>

          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Calendar size={16} style={{ color: COOL_GRAY }} />
              <span className="text-sm" style={{ color: COOL_GRAY }}>
                {isHe ? "סכום פעולה שבועי" : "Weekly Action Total"}
              </span>
            </div>
            <p className="text-lg font-medium" style={{ color: DEEP_MIDNIGHT_BLUE }}>
              {weeklyTotal}
            </p>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Calendar size={16} style={{ color: COOL_GRAY }} />
              <span className="text-sm" style={{ color: COOL_GRAY }}>
                {isHe ? "סכום פעולה יומי" : "Daily Action Total"}
              </span>
            </div>
            <p className="text-lg font-medium" style={{ color: DEEP_MIDNIGHT_BLUE }}>
              {dailyTotal}
            </p>
          </div>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-3 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            const value =
              card.id === "creations"
                ? creationsCount
                : card.id === "downloads"
                ? downloadsCount
                : deletionsCount;

            return (
              <div
                key={card.id}
                className="rounded-lg border border-[#DFE3EA] bg-white p-4 text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#E5E7EB]">
                  <Icon size={20} style={{ color: DEEP_MIDNIGHT_BLUE }} />
                </div>
                <p className="text-2xl font-bold" style={{ color: DEEP_MIDNIGHT_BLUE }}>
                  {value ?? 0}
                </p>
                <p className="mt-1 text-xs" style={{ color: COOL_GRAY }}>
                  {isHe ? card.labelHe : card.labelEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 rounded-lg px-3 py-2 text-center text-xs font-semibold transition-colors duration-200 ${
                  isActive
                    ? "bg-[#000810] text-white"
                    : "text-[#000810]"
                }`}
                style={{ margin: "0 2px" }}
              >
                <Icon size={18} className="mb-1" />
                <div>{isHe ? tab.labelHe : tab.labelEn}</div>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default ProfilePage;
