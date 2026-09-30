import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Info,
  ShieldCheck,
  Share2,
  Copy,
  Check,
  Flag,
  ArrowRight,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AnalysisResult, ScamReport } from '../types';

interface VisualRiskReportProps {
  result: AnalysisResult;
  onReset: () => void;
  onReportScam: (prefillData: Partial<ScamReport>) => void;
}

export const VisualRiskReport: React.FC<VisualRiskReportProps> = ({
  result,
  onReset,
  onReportScam
}) => {
  const [checklist, setChecklist] = useState(result.checklistItems);
  const [copied, setCopied] = useState(false);
  const [expandedFlagId, setExpandedFlagId] = useState<string | null>(null);

  const toggleChecklist = (id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = checklist.filter(c => c.completed).length;

  const getScoreTheme = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return {
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          barColor: 'bg-red-600',
          badgeBg: 'bg-red-600 text-white',
          icon: AlertOctagon,
          label: 'CRITICAL RISK'
        };
      case 'HIGH':
        return {
          textColor: 'text-orange-700',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          barColor: 'bg-orange-500',
          badgeBg: 'bg-orange-600 text-white',
          icon: AlertTriangle,
          label: 'HIGH RISK'
        };
      case 'MEDIUM':
        return {
          textColor: 'text-amber-800',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          barColor: 'bg-amber-500',
          badgeBg: 'bg-amber-600 text-white',
          icon: AlertTriangle,
          label: 'MEDIUM RISK'
        };
      case 'LOW':
      default:
        return {
          textColor: 'text-emerald-800',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          barColor: 'bg-emerald-600',
          badgeBg: 'bg-emerald-700 text-white',
          icon: ShieldCheck,
          label: 'LOW RISK'
        };
    }
  };

  const theme = getScoreTheme(result.riskLevel);
  const StatusIcon = theme.icon;

  const handleCopyReport = () => {
    const reportText = `OFFERCHECK RISK ASSESSMENT REPORT
Generated: ${new Date(result.timestamp).toLocaleString()}
Company Claimed: ${result.input.companyName || 'Not specified'}
Recruiter Email: ${result.input.recruiterEmail || 'Not specified'}
Risk Level: ${result.riskLevel} (${result.score}/100)

DETECTED RED FLAGS:
${result.flags.map(f => `- [${f.severity}] ${f.title}: ${f.evidence}`).join('\n')}

POSITIVE SIGNALS:
${result.positiveSignals.length > 0 ? result.positiveSignals.map(p => `- ${p.title}: ${p.description}`).join('\n') : '- None identified.'}

RECOMMENDED ACTIONS:
${result.recommendedActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

Disclaimer: This automated assessment provides an objective risk estimate based on known patterns and rule heuristics. It cannot provide a legal guarantee of authenticity.
Verified via OfferCheck (Community Student Cyber Defense)`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleStartReportModal = () => {
    // Determine category based on flags
    let cat = 'Recruiter Impersonation';
    if (result.flags.some(f => f.id === 'rule-police-clearance-scam' || f.id === 'rule-upfront-payment')) {
      cat = 'Security Deposit Scam';
    } else if (result.flags.some(f => f.id === 'rule-upi-payment')) {
      cat = 'UPI / Direct Payment Scam';
    } else if (result.flags.some(f => f.id === 'rule-credential-theft')) {
      cat = 'Phishing / Credential Theft';
    }

    onReportScam({
      companyName: result.input.companyName || (result.matchedScamReports[0]?.companyName ?? ''),
      recruiterEmail: result.input.recruiterEmail,
      recruiterPhone: result.input.recruiterPhone,
      url: result.input.recruiterUrl,
      description: result.summary,
      evidenceSnippet: result.evidenceSnippets[0] || result.input.offerText.slice(0, 200),
      category: cat as any
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 sm:p-4 text-xs text-slate-600 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-700">Official Assessment Notice: </span>
          This analysis is a heuristics-based cybersecurity risk assessment. It flags potential anomalies and known deception patterns to assist in student verification, but cannot guarantee that an offer is either genuine or fraudulent.
        </div>
      </div>

      {/* Main Scorecard Card */}
      <div className={`border rounded-xl p-5 sm:p-8 ${theme.bgColor} ${theme.borderColor}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 text-xs font-bold tracking-wider rounded ${theme.badgeBg}`}>
                {theme.label}
              </span>
              <span className="text-xs text-slate-500">
                Evaluation ID #{result.id.slice(-6)} · {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Risk Score: <span className={`font-mono tabular-nums ${theme.textColor}`}>{result.score}</span>
              <span className="text-lg font-normal text-slate-500"> / 100</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-700 max-w-2xl">
              {result.summary}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3 shrink-0">
            <div className="w-full sm:w-48 bg-white/80 p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Threat Gauge</span>
                <span className="font-mono font-semibold">{result.score}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${theme.barColor} transition-all duration-700`}
                  style={{ width: `${Math.max(5, result.score)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopyReport}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors"
                title="Copy assessment to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Report'}
              </button>

              <button
                onClick={handleStartReportModal}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm"
              >
                <Flag className="w-3.5 h-3.5" />
                Report Scam
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Database Direct Match Alert (if any) */}
      {result.matchedScamReports.length > 0 && (
        <div className="border border-red-300 bg-red-50/90 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-red-900">
                  Critical Database Intelligence Match
                </h4>
                <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                  {result.matchedScamReports.length} Flagged Match{result.matchedScamReports.length > 1 ? 'es' : ''}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-red-800">
                Identifiers submitted with this offer directly match known scam complaints previously submitted to the OfferCheck repository.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {result.matchedScamReports.map(rep => (
                  <div key={rep.id} className="bg-white p-3 rounded border border-red-200 text-xs space-y-1">
                    <div className="font-semibold text-slate-900">{rep.companyName}</div>
                    <div className="text-slate-600">Category: {rep.category}</div>
                    <div className="text-red-700 font-medium">Demanded: {rep.amountRequested} via {rep.channel}</div>
                    <div className="text-slate-500 text-[11px] truncate">Pattern: {rep.evidenceSnippet}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detected Red Flags Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Detected Red Flags ({result.flags.length})
            </h3>
            <p className="text-xs text-slate-500">
              Behavioral, linguistic, and domain anomalies identified in the offer content.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {result.flags.reduce((acc, f) => acc + f.points, 0)} total risk points
          </span>
        </div>

        {result.flags.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-sm">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            No red flags detected based on rule heuristics and database lookups.
          </div>
        ) : (
          <div className="space-y-3">
            {result.flags.map(flag => {
              const isExpanded = expandedFlagId === flag.id;
              const severityBadge =
                flag.severity === 'CRITICAL'
                  ? 'bg-red-100 text-red-800 border-red-200'
                  : flag.severity === 'HIGH'
                  ? 'bg-orange-100 text-orange-800 border-orange-200'
                  : 'bg-amber-100 text-amber-800 border-amber-200';

              return (
                <div
                  key={flag.id}
                  className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 text-[11px] font-semibold rounded border ${severityBadge}`}>
                          {flag.severity}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {flag.ruleCategory}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          +{flag.points} pts
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {flag.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600">
                        {flag.description}
                      </p>
                    </div>

                    <button
                      onClick={() => setExpandedFlagId(isExpanded ? null : flag.id)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      aria-label="Toggle evidence view"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Evidence Quote */}
                  <div className="mt-3 pt-2 border-t border-slate-200/60">
                    <div className="text-xs font-semibold text-slate-700 mb-1">
                      Evidence Detected:
                    </div>
                    <div className="text-xs font-mono bg-white p-2.5 rounded border border-slate-200 text-slate-800 break-all">
                      "{flag.evidence}"
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Positive Signals Section (if any) */}
      {result.positiveSignals.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Positive Signals Identified ({result.positiveSignals.length})
            </h3>
            <p className="text-xs text-slate-500">
              Attributes aligning with legitimate professional recruitment standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {result.positiveSignals.map(pos => (
              <div key={pos.id} className="p-3 bg-emerald-50/50 border border-emerald-200/70 rounded-lg text-xs space-y-1">
                <div className="font-semibold text-emerald-900">{pos.title}</div>
                <div className="text-slate-600">{pos.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Next Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Recommended Action Plan
          </h3>
          <p className="text-xs text-slate-500">
            Immediate steps to safeguard your finances, personal identity, and academic record.
          </p>
        </div>

        <ol className="space-y-2.5">
          {result.recommendedActions.map((action, idx) => (
            <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-800">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{action}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Interactive Safety Checklist */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Student Safety Checklist
            </h3>
            <p className="text-xs text-slate-500">
              Mark off verification steps as you independently inspect the offer.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-blue-600">
              {completedCount} of {checklist.length} Completed
            </span>
            <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all"
                style={{ width: `${(completedCount / checklist.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {checklist.map(item => (
            <div
              key={item.id}
              onClick={() => toggleChecklist(item.id)}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                item.completed
                  ? 'bg-slate-50 border-slate-200 text-slate-500'
                  : 'bg-white border-slate-200 hover:border-blue-300 text-slate-900'
              }`}
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => {}} // handled by parent onClick
                className="w-4 h-4 rounded text-blue-600 mt-0.5 cursor-pointer"
              />
              <div className="flex-1">
                <div className={`text-xs sm:text-sm font-semibold ${item.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                  {item.text}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {item.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Analyze Another Offer
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleCopyReport}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            {copied ? 'Copied to Clipboard' : 'Share Report'}
          </button>

          <button
            onClick={handleStartReportModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            <Flag className="w-4 h-4" />
            File Scam Report
          </button>
        </div>
      </div>
    </div>
  );
};
