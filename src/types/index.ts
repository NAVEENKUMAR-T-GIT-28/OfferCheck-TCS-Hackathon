export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ScamCategory =
  | 'Registration Fee Scam'
  | 'Security Deposit Scam'
  | 'Fake Interview Scam'
  | 'Fake Internship Certificate'
  | 'UPI / Direct Payment Scam'
  | 'Recruiter Impersonation'
  | 'Phishing / Credential Theft'
  | 'Task / Daily Work Scam';

export interface DetectedFlag {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  evidence: string;
  ruleCategory: string;
  points: number;
}

export interface PositiveSignal {
  id: string;
  title: string;
  description: string;
}

export interface ScamReport {
  id: string;
  companyName: string;
  recruiterName: string;
  recruiterPhone: string;
  recruiterEmail: string;
  recruiterUpi: string;
  channel: string;
  category: ScamCategory;
  amountRequested: string;
  currency: string;
  description: string;
  evidenceSnippet: string;
  url: string;
  reportedDate: string;
  reportCount: number;
  status: 'Verified Pattern' | 'Under Review' | 'Community Flagged';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface KnownScamPattern {
  id: string;
  title: string;
  category: ScamCategory;
  patternSignature: string;
  indicators: string[];
  typicalAmount: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
}

export interface AnalysisInput {
  offerText: string;
  companyName: string;
  recruiterEmail: string;
  recruiterPhone: string;
  recruiterUrl: string;
  jdText?: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  score: number; // 0 - 100
  riskLevel: RiskLevel;
  summary: string;
  input: AnalysisInput;
  flags: DetectedFlag[];
  positiveSignals: PositiveSignal[];
  evidenceSnippets: string[];
  matchedPatterns: string[];
  matchedScamReports: ScamReport[];
  recommendedActions: string[];
  checklistItems: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  detail: string;
  priority: 'high' | 'recommended' | 'standard';
  completed: boolean;
}

export interface SampleOffer {
  id: string;
  title: string;
  type: 'SAFE' | 'SUSPICIOUS' | 'HIGH_RISK';
  badgeLabel: string;
  companyName: string;
  recruiterEmail: string;
  recruiterPhone: string;
  recruiterUrl: string;
  offerText: string;
  jdText: string;
  description: string;
}

export interface DashboardStats {
  totalAnalyzed: number;
  highRiskDetected: number;
  scamReportsLogged: number;
  knownPatternsTracked: number;
}
