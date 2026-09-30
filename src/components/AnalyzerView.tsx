import React, { useState } from 'react';
import {
  FileText,
  Search,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';
import { AnalysisInput, AnalysisResult, ScamReport } from '../types';
import { SAMPLE_OFFERS } from '../data/sampleOffers';
import { analyzeOffer } from '../services/riskEngine';
import { saveAnalysisToHistory, getStoredScamReports } from '../services/storage';
import { VisualRiskReport } from './VisualRiskReport';

interface AnalyzerViewProps {
  onReportScam: (prefillData: Partial<ScamReport>) => void;
  initialSampleId?: string | null;
}

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({
  onReportScam,
  initialSampleId
}) => {
  const [offerText, setOfferText] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [recruiterPhone, setRecruiterPhone] = useState('');
  const [recruiterUrl, setRecruiterUrl] = useState('');
  const [jdText, setJdText] = useState('');
  const [showJdField, setShowJdField] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedSample, setSelectedSample] = useState<string | null>(initialSampleId || null);

  // If initialSampleId is provided, pre-populate
  React.useEffect(() => {
    if (initialSampleId) {
      handleSelectSample(initialSampleId);
    }
  }, [initialSampleId]);

  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_OFFERS.find(s => s.id === sampleId);
    if (!sample) return;

    setSelectedSample(sampleId);
    setCompanyName(sample.companyName);
    setRecruiterEmail(sample.recruiterEmail);
    setRecruiterPhone(sample.recruiterPhone);
    setRecruiterUrl(sample.recruiterUrl);
    setOfferText(sample.offerText);
    setJdText(sample.jdText);
    setShowJdField(Boolean(sample.jdText));
    setResult(null);
  };

  const handleClear = () => {
    setOfferText('');
    setCompanyName('');
    setRecruiterEmail('');
    setRecruiterPhone('');
    setRecruiterUrl('');
    setJdText('');
    setSelectedSample(null);
    setResult(null);
  };

  const handleRunAnalysis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!offerText.trim() && !companyName.trim() && !recruiterEmail.trim()) {
      alert('Please paste an offer message or enter company/recruiter details to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep('1/4: Parsing submitted text and contact metadata...');

    await new Promise(r => setTimeout(r, 220));
    setAnalysisStep('2/4: Cross-referencing known scam reports & phone/UPI records...');

    await new Promise(r => setTimeout(r, 280));
    setAnalysisStep('3/4: Executing 18 deterministic cybersecurity rule heuristics...');

    await new Promise(r => setTimeout(r, 250));
    setAnalysisStep('4/4: Synthesizing risk score and compiling safety checklist...');

    const storedReports = getStoredScamReports();
    const input: AnalysisInput = {
      offerText,
      companyName,
      recruiterEmail,
      recruiterPhone,
      recruiterUrl,
      jdText
    };

    const evaluation = analyzeOffer(input, storedReports);
    saveAnalysisToHistory(evaluation);

    await new Promise(r => setTimeout(r, 180));
    setResult(evaluation);
    setIsAnalyzing(false);
    setAnalysisStep('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Title Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Internship & Job Offer Risk Analyzer
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Paste the message, email, or offer details you received. Our engine evaluates monetary demands, typosquatted domains, UPI requests, urgency coercion, and known scam patterns.
        </p>
      </div>

      {/* Try Sample Offer Quick Selector */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Demo Mode: Try Sample Offers
            </span>
          </div>
          <span className="text-xs text-slate-500">
            Click any preset to test the analysis engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_OFFERS.map(sample => {
            const isSelected = selectedSample === sample.id;
            let badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
            let Icon = ShieldCheck;
            if (sample.type === 'SUSPICIOUS') {
              badgeColor = 'text-amber-800 bg-amber-50 border-amber-200';
              Icon = AlertTriangle;
            } else if (sample.type === 'HIGH_RISK') {
              badgeColor = 'text-red-700 bg-red-50 border-red-200';
              Icon = ShieldAlert;
            }

            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample.id)}
                className={`text-left p-3 rounded-lg border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-100 bg-blue-50/40'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`px-2 py-0.5 font-semibold text-[10px] rounded border ${badgeColor}`}>
                      {sample.badgeLabel}
                    </span>
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="font-bold text-slate-900 line-clamp-1 mb-1">
                    {sample.title}
                  </div>
                  <p className="text-slate-600 line-clamp-2 text-[11px]">
                    {sample.description}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200/60 text-[11px] font-semibold text-blue-600 flex items-center justify-between">
                  <span>Load Preset</span>
                  <span>→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Analyzer Form or Visual Report */}
      {result ? (
        <VisualRiskReport
          result={result}
          onReset={() => setResult(null)}
          onReportScam={onReportScam}
        />
      ) : (
        <form onSubmit={handleRunAnalysis} className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
            {/* Offer Textarea */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Offer / Internship Message Text <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-slate-500">
                  Paste WhatsApp message, email body, or DM
                </span>
              </div>
              <textarea
                rows={7}
                value={offerText}
                onChange={e => setOfferText(e.target.value)}
                placeholder="Example: 'Congratulations! You are shortlisted for our Remote Python internship. To confirm your seat, kindly transfer Rs 2,500 towards police clearance certificate fee via UPI tcshr.verify@okaxis within 2 hours...'"
                className="w-full text-sm font-sans p-3.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400 text-slate-900 transition-all"
                required
              />
            </div>

            {/* Entity Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Claimed Company / Organization Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="e.g. Tata Consultancy Services, Infosys, TechNova"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recruiter Contact Email
                </label>
                <input
                  type="email"
                  value={recruiterEmail}
                  onChange={e => setRecruiterEmail(e.target.value)}
                  placeholder="e.g. hr.onboarding@gmail.com or campus@infosys.com"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recruiter Phone / WhatsApp Number
                </label>
                <input
                  type="text"
                  value={recruiterPhone}
                  onChange={e => setRecruiterPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company Website / Recruiter Profile URL
                </label>
                <input
                  type="text"
                  value={recruiterUrl}
                  onChange={e => setRecruiterUrl(e.target.value)}
                  placeholder="e.g. https://bit.ly/hire-intern or https://careers.infosys.com"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900"
                />
              </div>
            </div>

            {/* Optional JD Accordion */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowJdField(!showJdField)}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1.5 focus:outline-none"
              >
                <span>{showJdField ? '− Hide' : '+ Optional: Add Job Description (JD) text'}</span>
              </button>

              {showJdField && (
                <div className="mt-3">
                  <textarea
                    rows={4}
                    value={jdText}
                    onChange={e => setJdText(e.target.value)}
                    placeholder="Paste eligibility requirements, stipend promises, or job description details..."
                    className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Action Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleClear}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Input
            </button>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 rounded-lg shadow-sm transition-all"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Offer...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze Offer Authenticity</span>
                </>
              )}
            </button>
          </div>

          {/* Asynchronous Analysis Step Banner */}
          {isAnalyzing && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2 animate-pulse">
              <div className="flex items-center justify-between text-xs text-blue-900 font-semibold">
                <span>OfferCheck Risk Engine in Progress</span>
                <span className="font-mono">Processing...</span>
              </div>
              <div className="text-xs text-blue-700 font-mono">
                {analysisStep}
              </div>
              <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-2/3 animate-pulse" />
              </div>
            </div>
          )}
        </form>
      )}

      {/* Safety Notice Footer */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 space-y-1">
        <div className="font-semibold text-slate-700">Student Privacy Commitment:</div>
        <div>
          OfferCheck does not store personal applicant names, college roll numbers, or private resumes. Analysis is executed client-side with transparent rule heuristics and community scam cross-checks.
        </div>
      </div>
    </div>
  );
};
