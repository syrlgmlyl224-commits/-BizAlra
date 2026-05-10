import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wand2,
  CreditCard,
  HeadphonesIcon,
  TrendingUp,
  Sparkles,
  Download,
  Copy,
  Check,
  User,
  MessageSquare,
  BarChart3,
  DollarSign,
  Clock,
  Camera,
  RefreshCw,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import {
  loadCreations,
  trackDownload,
  type Creation,
  type CreationType,
} from "@/lib/creations-store";

const TYPE_ICON: Record<CreationType, React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>> = {
  message: MessageSquare,
  analytics: BarChart3,
  pricing: DollarSign,
  time: Clock,
  image: Camera,
  photo: Camera,
};

const DashboardPage = () => {
  const { t, lang } = useI18n();
  const { user } = useAuth();  const navigate = useNavigate();  const isHe = lang === "he";
  const userName = user?.user_metadata?.full_name || (isHe ? "אורח" : "Guest");

  const [creations, setCreations] = useState<Creation[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const refreshData = useCallback(() => {
    setCreations(loadCreations());
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    refreshData();
    window.addEventListener("storage", refreshData);
    return () => window.removeEventListener("storage", refreshData);
  }, [refreshData, user]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(isHe ? "he-IL" : "en-US", { day: "numeric", month: "short" });

  const handleCopyCreation = (creation: Creation) => {
    navigator.clipboard.writeText(creation.content);
    setCopiedId(creation.id);
    window.setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadCreation = (creation: Creation) => {
    const blob = new Blob([creation.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bizaira-${creation.type}-${creation.id.slice(0, 6)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    trackDownload();
    refreshData();
  };

  const typeLabel = (type: CreationType) => {
    const labels: Record<CreationType, { he: string; en: string }> = {
      message: { he: "הודעה", en: "Message" },
      analytics: { he: "ניתוח עסקי", en: "Analytics" },
      pricing: { he: "תמחור", en: "Pricing" },
      time: { he: "ניהול זמן", en: "Time" },
      image: { he: "תמונה", en: "Image" },
      photo: { he: "סטודיו", en: "Photo" },
    };
    return isHe ? labels[type].he : labels[type].en;
  };

  const dashboardCards = [
    {
      title: isHe ? "התחל ליצור" : "Start Creating",
      description: isHe ? "צור תוכן עסקי מתקדם עם AI" : "Create advanced business content with AI",
      icon: Wand2,
      href: "/create",
      primary: true,
      color: "#000810",
    },
    {
      title: isHe ? "אזור אישי" : "Personal Area",
      description: isHe ? "נהל את הפרופיל וההעדפות שלך" : "Manage your profile and preferences",
      icon: User,
      href: "/profile",
      primary: false,
      color: "#000810",
    },
    {
      title: isHe ? "מעקב פעילות" : "Activity Tracker",
      description: isHe ? "צפה בסטטיסטיקות השימוש שלך" : "View your usage statistics",
      icon: TrendingUp,
      href: "/dashboard",
      primary: false,
      color: "#000810",
    },
    {
      title: isHe ? "ניהול מנוי" : "Subscription",
      description: isHe ? "נהל את התוכנית והתשלומים שלך" : "Manage your plan and payments",
      icon: CreditCard,
      href: "/pricing",
      primary: false,
      color: "#000810",
    },
    {
      title: isHe ? "תמיכה" : "Support",
      description: isHe ? "קבל עזרה ותמיכה מקצועית" : "Get help and professional support",
      icon: HeadphonesIcon,
      href: "/support",
      primary: false,
      color: "#000810",
    },
  ];

  const hasName = !!user?.user_metadata?.full_name;
  const greetingTitle = hasName ? `Hi ${userName},` : "Hello, Guest.";
  const greetingSubtitle = hasName
    ? isHe
      ? "ברוך הבא לאזור האישי הפרטי שלך."
      : "Welcome to your Personal Area."
    : "Welcome to your personal workspace.";

  const MIDNIGHT_NAVY = "#0a0a0a";
  const SURFACE_NAVY = "#1a1a2e";
  const OFF_WHITE = "#f5f5f5";
  const CREAM_BG = "#f5f5f5";
  const GOLD = "#D4AF37";

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: MIDNIGHT_NAVY, fontFamily: "Heebo, Assistant, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="rounded-[32px] border p-10 shadow-[0_24px_60px_-30px_rgba(26,26,46,0.12)]" style={{ backgroundColor: SURFACE_NAVY, borderColor: OFF_WHITE, color: OFF_WHITE }}>
          <div className="grid gap-10 lg:grid-cols-[1.8fr_1fr] items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#6B6B6B] mb-4">{isHe ? "האזור האישי" : "Personal Area"}</p>
              <h1 className="text-4xl sm:text-5xl leading-tight mb-4" style={{ fontWeight: 300, color: OFF_WHITE }}>
                {greetingTitle}
              </h1>
              <p className="max-w-2xl text-base leading-8" style={{ fontWeight: 300, color: OFF_WHITE }}>
                {greetingSubtitle}
              </p>
            </div>
            <div className="rounded-[28px] border p-6 shadow-[0_16px_40px_-24px_rgba(26,26,46,0.18)]" style={{ backgroundColor: SURFACE_NAVY, borderColor: '#2a2a3e', color: OFF_WHITE }}>
              <p className="text-[11px] uppercase tracking-[0.3em] mb-4" style={{ color: OFF_WHITE }}>{isHe ? "סטטוס" : "Status"}</p>
              <p className="text-3xl font-semibold" style={{ color: OFF_WHITE, fontWeight: 500 }}>
                {isHe ? "חלל פרטי" : "Boutique Private"}
              </p>
              <p className="mt-3 text-sm leading-6" style={{ color: OFF_WHITE, fontWeight: 300 }}>
                {isHe ? "חלל עדין וממותג לעבודה עסקית אישית." : "A delicate, branded space for your personal business work."}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[28px] p-6 shadow-[0_18px_45px_-24px_rgba(26,26,46,0.18)] border" style={{ backgroundColor: SURFACE_NAVY, borderColor: '#2a2a3e', color: OFF_WHITE }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: MIDNIGHT_NAVY }}>
                <TrendingUp size={24} style={{ color: OFF_WHITE }} strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-semibold" style={{ color: OFF_WHITE, fontWeight: 500 }}>5</span>
            </div>
            <p className="text-sm" style={{ fontWeight: 300, color: OFF_WHITE }}>{isHe ? "פעילויות הושלמו" : "Activities Completed"}</p>
            <div className="mt-4 w-full rounded-full h-2" style={{ backgroundColor: '#2a2a3e' }}>
              <div className="h-2 rounded-full" style={{ width: "100%", backgroundColor: OFF_WHITE }}></div>
            </div>
            <p className="text-xs mt-2" style={{ color: OFF_WHITE }}>5/5</p>
          </div>

          <div className="rounded-[28px] p-6 shadow-[0_18px_45px_-24px_rgba(26,26,46,0.18)] border" style={{ backgroundColor: SURFACE_NAVY, borderColor: OFF_WHITE, color: OFF_WHITE }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: MIDNIGHT_NAVY }}>
                <Sparkles size={24} style={{ color: OFF_WHITE }} strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-semibold" style={{ color: OFF_WHITE, fontWeight: 500 }}>0</span>
            </div>
            <p className="text-sm" style={{ fontWeight: 300, color: OFF_WHITE }}>{isHe ? "יצירות AI" : "AI Generations"}</p>
            <div className="mt-4 w-full rounded-full h-2" style={{ backgroundColor: '#2a2a3e' }}>
              <div className="h-2 rounded-full" style={{ width: "0%", backgroundColor: OFF_WHITE }}></div>
            </div>
            <p className="text-xs mt-2" style={{ color: OFF_WHITE }}>0/∞</p>
          </div>

          <div className="rounded-[28px] p-6 shadow-[0_18px_45px_-24px_rgba(26,26,46,0.18)] border" style={{ backgroundColor: SURFACE_NAVY, borderColor: '#2a2a3e', color: OFF_WHITE }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: MIDNIGHT_NAVY }}>
                <MessageSquare size={24} style={{ color: OFF_WHITE }} strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-semibold" style={{ color: OFF_WHITE, fontWeight: 500 }}>0</span>
            </div>
            <p className="text-sm" style={{ fontWeight: 300, color: OFF_WHITE }}>{isHe ? "הודעות נשלחו" : "Messages Sent"}</p>
            <div className="mt-4 w-full bg-gray-600 rounded-full h-2">
              <div className="h-2 rounded-full" style={{ width: "0%", backgroundColor: OFF_WHITE }}></div>
            </div>
            <p className="text-xs mt-2" style={{ color: OFF_WHITE }}>0/∞</p>
          </div>

          <div className="rounded-[28px] p-6 shadow-[0_18px_45px_-24px_rgba(26,26,46,0.18)] border" style={{ backgroundColor: SURFACE_NAVY, borderColor: '#2a2a3e', color: OFF_WHITE }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: MIDNIGHT_NAVY }}>
                <BarChart3 size={24} style={{ color: OFF_WHITE }} strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-semibold" style={{ color: OFF_WHITE, fontWeight: 500 }}>0</span>
            </div>
            <p className="text-sm" style={{ fontWeight: 300, color: OFF_WHITE }}>{isHe ? "דוחות נוצרו" : "Reports Created"}</p>
            <div className="mt-4 w-full rounded-full h-2" style={{ backgroundColor: '#2a2a3e' }}>
              <div className="h-2 rounded-full" style={{ width: "0%", backgroundColor: OFF_WHITE }}></div>
            </div>
            <p className="text-xs mt-2" style={{ color: OFF_WHITE }}>0/∞</p>
          </div>
        </div>

        {/* Upgrade to PRO Button */}
        <div className="mt-10 text-center">
          <button className="px-8 py-4 rounded-[20px] text-white font-light text-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1" style={{ backgroundColor: MIDNIGHT_NAVY, boxShadow: "0 12px 32px -8px rgba(10,10,10,0.24)" }}>
            {isHe ? "שדרג ל-PRO" : "Upgrade to PRO"}
          </button>
        </div>
          {dashboardCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <Link
                key={card.title}
                to={card.href}
                className={`
                  group relative overflow-hidden rounded-[28px] transition-all duration-300 hover:scale-105 hover:-translate-y-2
                  ${card.primary ? 'bg-[#0a0a0a] text-white' : 'bg-[#1a1a2e] text-[#f5f5f5] border'}

                `}
                style={{
                  borderColor: card.primary ? 'transparent' : '#2a2a3e',
                  boxShadow: card.primary
                    ? '0 22px 60px -24px rgba(1, 18, 36, 0.45)'
                    : '0 18px 45px -24px rgba(1, 18, 36, 0.18)',
                }}
              >
                <div className="p-8 h-full flex flex-col">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl border mb-6" style={{ borderColor: card.primary ? "rgba(255,255,255,0.2)" : "rgba(1,18,36,0.14)", backgroundColor: card.primary ? "rgba(255,255,255,0.1)" : "#FCF7EE" }}>
                    <IconComponent size={26} strokeWidth={1.5} style={{ color: card.primary ? "#FFFFFF" : "#000810" }} />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3" style={{ fontWeight: 500, color: card.primary ? "#FFFFFF" : "#000810" }}>
                    {card.title}
                  </h3>
                  <p className="text-sm leading-7" style={{ fontWeight: 300, color: card.primary ? "rgba(255,255,255,0.86)" : "#5B5B5B" }}>
                    {card.description}
                  </p>
                  <div className={`mt-6 h-1 rounded-full ${card.primary ? "bg-white/20" : "bg-[#000810]/30 group-hover:bg-[#000810]/50"}`} />
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{
                       background: `linear-gradient(135deg, rgba(0, 8, 16, 0.1) 0%, transparent 50%)`,
                       filter: 'blur(20px)',
                     }} />
              </Link>
            );
          })}
        </div>

        {/* Recent Activity Section */}
        <div className="mb-16">
          <div
            className="rounded-3xl p-10 border"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(247, 242, 233, 0.95) 100%)",
              borderColor: "rgba(1, 18, 36, 0.08)",
              boxShadow: "0 24px 48px -12px rgba(1, 18, 36, 0.12)",
            }}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-10">
              <div>
                <h2 className="text-4xl font-semibold mb-4" style={{ fontWeight: 300, color: NAVY }}>
                  {isHe ? "פעילות אחרונה" : "Recent Activity"}
                </h2>
                <p className="text-lg max-w-2xl" style={{ fontWeight: 300, color: "#5B5B5B", opacity: 0.9 }}>
                  {isHe ? "צפה ביצירות האחרונות שלך ובפעילות המערכת" : "View your recent creations and system activity"}
                </p>
              </div>
              <button
                onClick={refreshData}
                className="group inline-flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                style={{
                  background: "#000810",
                  border: "1px solid rgba(1, 18, 36, 0.12)",
                  color: "#FFFFFF",
                  fontWeight: 300,
                  boxShadow: "0 8px 24px -8px rgba(1, 18, 36, 0.2)",
                }}
              >
                <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                {isHe ? "רענן" : "Refresh"}
              </button>
            </div>

            {creations.length > 0 ? (
              <div className="space-y-6">
                {creations.slice(0, 5).map((creation) => (
                  <div
                    key={creation.id}
                    className="group rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1"
                    style={{
                      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(247, 242, 233, 0.95) 100%)",
                      border: "1px solid rgba(13, 35, 68, 0.08)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 18px 34px -22px rgba(13, 35, 68, 0.12)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#000810]/10 group-hover:bg-[#000810]/15 transition-colors duration-300">
                        {React.createElement(TYPE_ICON[creation.type], { size: 24, style: { color: "#000810" } })}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold mb-1" style={{ fontWeight: 500, color: NAVY }}>
                            {typeLabel(creation.type)}
                          </h4>
                          <p className="text-sm" style={{ fontWeight: 300, color: "#5B5B5B", opacity: 0.85 }}>
                            {formatDate(creation.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleCopyCreation(creation)}
                          className="group/btn p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                          style={{
                          background: "rgba(1, 18, 36, 0.06)",
                          border: "1px solid rgba(1, 18, 36, 0.12)",
                          color: copiedId === creation.id ? "#4CAF50" : "#000810",
                          }}
                        >
                          {copiedId === creation.id ? (
                            <Check size={18} />
                          ) : (
                            <Copy size={18} className="group-hover/btn:text-[#000810]" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDownloadCreation(creation)}
                          className="group/btn p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                          style={{
                          background: "rgba(1, 18, 36, 0.06)",
                          border: "1px solid rgba(1, 18, 36, 0.12)",
                          color: "#000810",
                          }}
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6" style={{ background: "rgba(13, 35, 68, 0.06)", border: "2px solid rgba(13, 35, 68, 0.08)" }}>
                  <Sparkles size={40} style={{ color: NAVY, opacity: 0.6 }} />
                </div>
                <h3 className="text-2xl font-semibold mb-4" style={{ fontWeight: 500, color: NAVY }}>
                  {isHe ? "אין פעילות עדיין" : "No Activity Yet"}
                </h3>
                <p className="text-lg max-w-md mx-auto mb-8" style={{ fontWeight: 300, color: "#5B5B5B", opacity: 0.9 }}>
                  {isHe ? "התחל ליצור תוכן עסקי מתקדם עם הכלים שלנו" : "Start creating advanced business content with our tools"}
                </p>
                <Link
                  to="/create"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37 0%, #C4A037 100%)",
                    color: "#000000",
                    fontWeight: 700,
                    boxShadow: "0 12px 32px -8px rgba(212, 175, 55, 0.4)",
                  }}
                >
                  <Sparkles size={20} />
                  {isHe ? "התחל עכשיו" : "Start Now"}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default DashboardPage;
