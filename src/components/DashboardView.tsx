import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  PlusCircle,
  FileText,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Info,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';
import { DashboardStats, ScamReport } from '../types';
import { getDashboardStats, getStoredScamReports } from '../services/storage';
import { SAMPLE_OFFERS } from '../data/sampleOffers';
import { INITIAL_SCAM_PATTERNS } from '../data/mockData';

interface DashboardViewProps {
  onNavigate: (tab: 'analyzer' | 'database' | 'report' | 'how-it-works', sampleId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [stats] = useState<DashboardStats>(() => getDashboardStats());
  const [recentReports] = useState<ScamReport[]>(() => getStoredScamReports().slice(0, 5));

  // Category breakdown
  const categoryBreakdown = [
    { name: 'Security Deposit & Police Clearance', count: 38, pct: '36%', color: 'bg-red-500' },
    { name: 'Registration & Portal Activation Fee', count: 29, pct: '28%', color: 'bg-orange-500' },
    { name: 'Fake Recruiter Impersonation (Domain typo)', count: 21, pct: '20%', color: 'bg-amber-500' },
    { name: 'Task & Review Daily Payout Scams', count: 16, pct: '16%', color: 'bg-blue-500' }
  ];

  return (
    <div className="space-y-8 py-2">
      {/* 1. Landing Hero Section */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-md text-xs font-semibold text-blue-700">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Cybersecurity Intelligence for College Students & Fresh Graduates</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 text-balance leading-tight">
            Check an internship offer before you trust it.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Protect yourself against fake recruiter impersonation, ₹2,000+ UPI clearance fee demands, and fraudulent offer letters before paying money or sharing confidential documents.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('analyzer')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-all"
            >
              <FileText className="w-4 h-4" />
              Analyze an Offer
            </button>

            <button
              onClick={() => onNavigate('database')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
            >
              <Search className="w-4 h-4" />
              View Scam Reports
            </button>
          </div>
        </div>

        {/* Clear Assessment Warning Box */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-700 font-semibold">Important Notice: </strong>
            OfferCheck generates an algorithmic risk assessment based on transparent heuristics and community-logged incidents. It does not constitute a commercial or legal guarantee of authenticity.
          </span>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">
            Total Offers Analyzed
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {stats.totalAnalyzed.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium pt-1">
            <TrendingUp className="w-3 h-3" />
            <span>Active scanning active</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">
            High-Risk Offers Flagged
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-600 font-mono tabular-nums">
            {stats.highRiskDetected.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-medium pt-1">
            Prevented financial loss
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">
            Scam Reports Submitted
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono tabular-nums">
            {stats.scamReportsLogged.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-medium pt-1">
            Community contributors
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">
            Scam Patterns Monitored
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {INITIAL_SCAM_PATTERNS.length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium pt-1">
            Continuous threat catalog
          </div>
        </div>
      </div>

      {/* 3. Demo Mode Quick Launch Cards */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Demo Mode: Test Predefined Sample Offers
            </h2>
            <p className="text-xs text-slate-500">
              Select any curated real-world offer archetype to immediately observe the risk scoring logic.
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-600">
            3 Ready Benchmarks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAMPLE_OFFERS.map(sample => {
            let badgeStyle = 'text-emerald-700 bg-emerald-50 border-emerald-200';
            let iconColor = 'text-emerald-600';
            let Icon = ShieldCheck;
            if (sample.type === 'SUSPICIOUS') {
              badgeStyle = 'text-amber-800 bg-amber-50 border-amber-200';
              iconColor = 'text-amber-600';
              Icon = AlertTriangle;
            } else if (sample.type === 'HIGH_RISK') {
              badgeStyle = 'text-red-700 bg-red-50 border-red-200';
              iconColor = 'text-red-600';
              Icon = AlertOctagon;
            }

            return (
              <div
                key={sample.id}
                className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${badgeStyle}`}>
                      {sample.badgeLabel}
                    </span>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {sample.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3">
                    {sample.description}
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('analyzer', sample.id)}
                  className="mt-4 pt-2 border-t border-slate-200/60 inline-flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  <span>Run Analysis on Sample</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Common Scam Patterns & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scam Patterns Breakdown (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Prevalent Internship Scam Archetypes
              </h3>
              <p className="text-xs text-slate-500">
                Patterns documented across campus job postings, WhatsApp groups, and Telegram.
              </p>
            </div>
            <button
              onClick={() => onNavigate('database')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Explore all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {INITIAL_SCAM_PATTERNS.slice(0, 4).map(pattern => (
              <div
                key={pattern.id}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {pattern.title}
                  </h4>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded shrink-0 ${
                    pattern.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {pattern.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {pattern.description}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span>Demanded: <strong className="text-slate-800">{pattern.typicalAmount}</strong></span>
                  <span>·</span>
                  <span>Category: {pattern.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Category Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Scam Category Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Relative frequency of reported fraud methods.
            </p>
          </div>

          <div className="space-y-4 pt-1">
            {categoryBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 truncate pr-2">
                    {item.name}
                  </span>
                  <span className="font-mono text-slate-500 shrink-0">
                    {item.pct}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color}`}
                    style={{ width: item.pct }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                The Zero-Fee Golden Rule
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Legitimate companies pay you for internships. Any company requesting money for application, training, laptops, or verification is violating labor practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Recent Community Reports */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Recent Community Scam Reports
            </h3>
            <p className="text-xs text-slate-500">
              Latest incidents submitted by students to alert peers.
            </p>
          </div>
          <button
            onClick={() => onNavigate('database')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View all reports</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentReports.map(rep => (
            <div key={rep.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {rep.companyName}
                  </span>
                  <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                    rep.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {rep.severity}
                  </span>
                </div>
                <div className="text-slate-600 line-clamp-1">
                  {rep.description}
                </div>
                <div className="text-slate-400 text-[11px]">
                  Channel: {rep.channel} · Reported {rep.reportedDate}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-1">
                <span className="font-semibold text-red-600 font-mono">
                  {rep.amountRequested}
                </span>
                <button
                  onClick={() => onNavigate('database')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Transparency Pipeline Teaser */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Open & Explainable Intelligence
          </div>
          <h3 className="text-xl sm:text-2xl font-bold mt-1">
            How OfferCheck Analyzes Offers
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            We do not rely on opaque or hallucinatory AI scorecards. Every risk calculation is driven by transparent regex entity extraction, heuristic cybersecurity rules, and verified database matches.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 text-xs">
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 space-y-1">
            <div className="font-bold text-blue-400">1. Text Ingestion</div>
            <div className="text-slate-300">Extracts emails, phone numbers, UPI IDs, URLs, and fee terms.</div>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 space-y-1">
            <div className="font-bold text-blue-400">2. DB Cross-Check</div>
            <div className="text-slate-300">Compares against known scammer UPIs, phone numbers, and past reports.</div>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 space-y-1">
            <div className="font-bold text-blue-400">3. 18 Rule Heuristics</div>
            <div className="text-slate-300">Evaluates typosquats, urgency triggers, unvetted screening, and deposits.</div>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 space-y-1">
            <div className="font-bold text-blue-400">4. Actionable Report</div>
            <div className="text-slate-300">Delivers explainable score, evidence quotes, and student safety checklist.</div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => onNavigate('how-it-works')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
          >
            <span>Read full methodology and verification guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
