// Activity tracking for BizAIra dashboard stats
// Tracks first use date, creations, downloads, deletions, and general actions

import { safeGetItem, safeParseInt, safeSetItem } from "@/lib/safe-storage";

const STORAGE_KEYS = {
  firstUseDate: "bizaira_first_credit_use",
  creationsCount: "bizaira_creations_count",
  downloadsCount: "bizaira_downloads_count",
  deletionsCount: "bizaira_deletions_count",
  generalCount: "bizaira_general_count",
  weeklyCount: "bizaira_weekly_count",
  dailyCount: "bizaira_daily_count",
  lastWeeklyReset: "bizaira_last_weekly_reset",
  lastDailyReset: "bizaira_last_daily_reset",
};

const PERIOD_MONTHS = 1;
const ACTION_LIMIT = 5;

function parseISODate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getRenewalDate(firstUseDate: string): Date {
  const first = new Date(firstUseDate);
  const renewal = new Date(first);
  renewal.setMonth(renewal.getMonth() + PERIOD_MONTHS);
  return renewal;
}

function isPeriodExpired(firstUseDate: string): boolean {
  const first = parseISODate(firstUseDate);
  if (!first) return false;
  return new Date() >= getRenewalDate(firstUseDate);
}

function resetPeriod(): void {
  const now = new Date().toISOString();
  safeSetItem(STORAGE_KEYS.firstUseDate, now);
  safeSetItem(STORAGE_KEYS.creationsCount, "0");
  safeSetItem(STORAGE_KEYS.downloadsCount, "0");
  safeSetItem(STORAGE_KEYS.deletionsCount, "0");
  safeSetItem(STORAGE_KEYS.generalCount, "0");
  safeSetItem(STORAGE_KEYS.weeklyCount, "0");
  safeSetItem(STORAGE_KEYS.dailyCount, "0");
  safeSetItem(STORAGE_KEYS.lastWeeklyReset, now);
  safeSetItem(STORAGE_KEYS.lastDailyReset, now);
}

function ensureCurrentPeriod(): void {
  const firstUseDate = safeGetItem(STORAGE_KEYS.firstUseDate);
  if (!firstUseDate) return;
  if (isPeriodExpired(firstUseDate)) {
    resetPeriod();
  }
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

function getDayStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function ensureWeeklyReset(): void {
  const lastReset = safeGetItem(STORAGE_KEYS.lastWeeklyReset);
  if (!lastReset) {
    safeSetItem(STORAGE_KEYS.lastWeeklyReset, new Date().toISOString());
    return;
  }
  const lastResetDate = new Date(lastReset);
  const currentWeekStart = getWeekStart(new Date());
  if (lastResetDate < currentWeekStart) {
    safeSetItem(STORAGE_KEYS.weeklyCount, "0");
    safeSetItem(STORAGE_KEYS.lastWeeklyReset, new Date().toISOString());
  }
}

function ensureDailyReset(): void {
  const lastReset = safeGetItem(STORAGE_KEYS.lastDailyReset);
  if (!lastReset) {
    safeSetItem(STORAGE_KEYS.lastDailyReset, new Date().toISOString());
    return;
  }
  const lastResetDate = new Date(lastReset);
  const currentDayStart = getDayStart(new Date());
  if (lastResetDate < currentDayStart) {
    safeSetItem(STORAGE_KEYS.dailyCount, "0");
    safeSetItem(STORAGE_KEYS.lastDailyReset, new Date().toISOString());
  }
}

function ensureFirstUseDate(): void {
  if (!safeGetItem(STORAGE_KEYS.firstUseDate)) {
    safeSetItem(STORAGE_KEYS.firstUseDate, new Date().toISOString());
  }
}

function incrementCount(key: keyof typeof STORAGE_KEYS): void {
  const currentCount = safeParseInt(STORAGE_KEYS[key], 0);
  safeSetItem(STORAGE_KEYS[key], String(currentCount + 1));
  // Also increment weekly and daily
  ensureWeeklyReset();
  ensureDailyReset();
  const weeklyCount = safeParseInt(STORAGE_KEYS.weeklyCount, 0);
  safeSetItem(STORAGE_KEYS.weeklyCount, String(weeklyCount + 1));
  const dailyCount = safeParseInt(STORAGE_KEYS.dailyCount, 0);
  safeSetItem(STORAGE_KEYS.dailyCount, String(dailyCount + 1));
}

/**
 * Records a new creation action and updates first use date if needed
 */
export function trackCreation(): void {
  ensureCurrentPeriod();
  ensureFirstUseDate();
  ensureWeeklyReset();
  ensureDailyReset();
  incrementCount("creationsCount");
}

/**
 * Records a new download action
 */
export function trackDownload(): void {
  ensureCurrentPeriod();
  ensureFirstUseDate();
  ensureWeeklyReset();
  ensureDailyReset();
  incrementCount("downloadsCount");
}

/**
 * Records a new deletion action
 */
export function trackDeletion(): void {
  ensureCurrentPeriod();
  ensureFirstUseDate();
  ensureWeeklyReset();
  ensureDailyReset();
  incrementCount("deletionsCount");
}

/**
 * Records a general activity or business action
 */
export function trackGeneralActivity(): void {
  ensureCurrentPeriod();
  ensureFirstUseDate();
  ensureWeeklyReset();
  ensureDailyReset();
  incrementCount("generalCount");
}

/**
 * Gets the current activity stats
 */
export function getActivityStats(): {
  firstUseDate: string | null;
  creationsCount: number;
  downloadsCount: number;
  deletionsCount: number;
  generalCount: number;
  totalActions: number;
  nextRenewalDate: Date | null;
  remainingActions: number;
  limit: number;
  isLocked: boolean;
  weeklyTotal: number;
  dailyTotal: number;
} {
  ensureCurrentPeriod();
  ensureWeeklyReset();
  ensureDailyReset();
  const firstUseDate = safeGetItem(STORAGE_KEYS.firstUseDate);
  const creationsCount = safeParseInt(STORAGE_KEYS.creationsCount, 0);
  const downloadsCount = safeParseInt(STORAGE_KEYS.downloadsCount, 0);
  const deletionsCount = safeParseInt(STORAGE_KEYS.deletionsCount, 0);
  const generalCount = safeParseInt(STORAGE_KEYS.generalCount, 0);
  const weeklyTotal = safeParseInt(STORAGE_KEYS.weeklyCount, 0);
  const dailyTotal = safeParseInt(STORAGE_KEYS.dailyCount, 0);

  const totalActions = creationsCount + downloadsCount + deletionsCount + generalCount;
  const remainingActions = Math.max(0, ACTION_LIMIT - totalActions);

  let nextRenewalDate: Date | null = null;
  if (firstUseDate) {
    nextRenewalDate = getRenewalDate(firstUseDate);
  }

  return {
    firstUseDate,
    creationsCount,
    downloadsCount,
    deletionsCount,
    generalCount,
    totalActions,
    nextRenewalDate,
    remainingActions,
    limit: ACTION_LIMIT,
    isLocked: totalActions >= ACTION_LIMIT,
    weeklyTotal,
    dailyTotal,
  };
}
