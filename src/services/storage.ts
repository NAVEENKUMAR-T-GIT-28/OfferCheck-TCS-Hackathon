import { ScamReport, AnalysisResult, DashboardStats } from '../types';
import { INITIAL_SCAM_REPORTS, INITIAL_SCAM_PATTERNS } from '../data/mockData';

const REPORTS_KEY = 'offercheck_scam_reports_v1';
const HISTORY_KEY = 'offercheck_analysis_history_v1';
const STATS_KEY = 'offercheck_dashboard_stats_v1';

export function getStoredScamReports(): ScamReport[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (!raw) {
      localStorage.setItem(REPORTS_KEY, JSON.stringify(INITIAL_SCAM_REPORTS));
      return INITIAL_SCAM_REPORTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SCAM_REPORTS;
  } catch (err) {
    console.warn('Error reading scam reports from localStorage', err);
    return INITIAL_SCAM_REPORTS;
  }
}

export function saveScamReport(report: Omit<ScamReport, 'id' | 'reportedDate' | 'reportCount' | 'status'>): ScamReport {
  const reports = getStoredScamReports();
  const newReport: ScamReport = {
    ...report,
    id: `rep-${Date.now().toString().slice(-6)}`,
    reportedDate: new Date().toISOString().split('T')[0],
    reportCount: 1,
    status: 'Community Flagged'
  };

  const updated = [newReport, ...reports];
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
    incrementStats('scamReportsLogged');
  } catch (err) {
    console.error('Failed to save scam report', err);
  }
  return newReport;
}

export function getAnalysisHistory(): AnalysisResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Error reading analysis history', err);
    return [];
  }
}

export function saveAnalysisToHistory(result: AnalysisResult): void {
  try {
    const history = getAnalysisHistory();
    // Keep max 20 most recent
    const updated = [result, ...history].slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    incrementStats('totalAnalyzed');
    if (result.riskLevel === 'HIGH' || result.riskLevel === 'CRITICAL') {
      incrementStats('highRiskDetected');
    }
  } catch (err) {
    console.error('Failed to save analysis history', err);
  }
}

export function getDashboardStats(): DashboardStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    const reports = getStoredScamReports();
    const history = getAnalysisHistory();
    const highRiskCount = history.filter(h => h.riskLevel === 'HIGH' || h.riskLevel === 'CRITICAL').length;

    if (!raw) {
      const initialStats: DashboardStats = {
        totalAnalyzed: 148 + history.length,
        highRiskDetected: 64 + highRiskCount,
        scamReportsLogged: reports.length,
        knownPatternsTracked: INITIAL_SCAM_PATTERNS.length
      };
      localStorage.setItem(STATS_KEY, JSON.stringify(initialStats));
      return initialStats;
    }
    const parsed: DashboardStats = JSON.parse(raw);
    return {
      totalAnalyzed: Math.max(parsed.totalAnalyzed, 148 + history.length),
      highRiskDetected: Math.max(parsed.highRiskDetected, 64 + highRiskCount),
      scamReportsLogged: reports.length,
      knownPatternsTracked: INITIAL_SCAM_PATTERNS.length
    };
  } catch (err) {
    return {
      totalAnalyzed: 152,
      highRiskDetected: 67,
      scamReportsLogged: INITIAL_SCAM_REPORTS.length,
      knownPatternsTracked: INITIAL_SCAM_PATTERNS.length
    };
  }
}

function incrementStats(key: keyof DashboardStats): void {
  try {
    const current = getDashboardStats();
    current[key] = (current[key] || 0) + 1;
    localStorage.setItem(STATS_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn('Failed to increment stats', err);
  }
}

export function resetSampleData(): void {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(INITIAL_SCAM_REPORTS));
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(STATS_KEY);
}
