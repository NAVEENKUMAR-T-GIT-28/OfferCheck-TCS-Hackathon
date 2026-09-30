import React from 'react';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  ArrowDown,
  ExternalLink,
  PhoneCall,
  Lock,
  Building,
  Mail,
  AlertOctagon
} from 'lucide-react';

interface HowItWorksViewProps {
  onAnalyzeClick: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onAnalyzeClick }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 mb-2">
          <span>Methodology & Transparency</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          How OfferCheck Analyzes Offers
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Learn how our deterministic rule engine and community intelligence protect students from recruitment scams, fee coercion, and credential theft.
        </p>
      </div>

      {/* Visual Pipeline Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900">
          The OfferCheck Analysis Pipeline
        </h2>

        {/* Step-by-step Flowchart */}
        <div className="flex flex-col items-center space-y-2 max-w-xl mx-auto">
          {/* Node 1 */}
          <div className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-center">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step 1</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">Input & Content Ingestion</div>
            <div className="text-xs text-slate-500 mt-1">
              User submits message text, recruiter email, phone number, website link, or job description.
            </div>
          </div>

          <ArrowDown className="w-5 h-5 text-slate-400" />

          {/* Node 2 */}
          <div className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-center">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step 2</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">Entity & Identifier Extraction</div>
            <div className="text-xs text-slate-500 mt-1">
              Deterministic regex extracts emails, domains, phone numbers, UPI handles (@okaxis, @paytm), payment amounts, and URLs.
            </div>
          </div>

          <ArrowDown className="w-5 h-5 text-slate-400" />

          {/* Node 3 */}
          <div className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-center">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step 3</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">Rule & Behavioral Pattern Analysis</div>
            <div className="text-xs text-slate-500 mt-1">
              Evaluates 18 specific heuristics: registration fees, police clearance demands, urgency tactics, direct selection claims, and domain typosquats.
            </div>
          </div>

          <ArrowDown className="w-5 h-5 text-slate-400" />

          {/* Node 4 */}
          <div className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-center">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step 4</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">Scam Database Cross-Check</div>
            <div className="text-xs text-slate-500 mt-1">
              Cross-references extracted phone numbers, UPI IDs, and email domains against community-reported fraud incidents.
            </div>
          </div>

          <ArrowDown className="w-5 h-5 text-slate-400" />

          {/* Node 5 */}
          <div className="w-full bg-blue-50 border border-blue-300 rounded-xl p-4 text-center">
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">Step 5</div>
            <div className="text-sm font-bold text-blue-950 mt-0.5">Risk Score & Evidence Synthesis</div>
            <div className="text-xs text-blue-800 mt-1">
              Computes normalized score (0–100), risk tier (LOW, MEDIUM, HIGH, CRITICAL), and cites exact message evidence snippets.
            </div>
          </div>

          <ArrowDown className="w-5 h-5 text-blue-400" />

          {/* Node 6 */}
          <div className="w-full bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-center">
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Output</div>
            <div className="text-sm font-bold text-emerald-950 mt-0.5">Actionable Safety Checklist</div>
            <div className="text-xs text-emerald-800 mt-1">
              Delivers tailored checklist steps (e.g. MCA search, domain verification, placement cell contact).
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Distinction */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Core Principles & Distinctions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Detected Signals vs Guesswork
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every red flag is backed by a specific phrase, URL, or domain extracted directly from your input text. There are no black-box scores.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Search className="w-4 h-4 text-blue-600" />
              Database Matches
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When a recruiter’s phone number, UPI ID, or company alias has already victimized students, OfferCheck highlights the prior incident immediately.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Objective Risk Estimation
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our wording states "Potential risk detected" or "Further verification recommended". We never claim to deliver a legal guarantee of authenticity.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Student Action Empowerment
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              The goal is to equip students with independent verification steps so they don’t fall prey to time-pressured fraud tactics.
            </p>
          </div>
        </div>
      </div>

      {/* Practical Verification Guide for Students */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Independent Verification Manual for Students
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="border-l-2 border-blue-600 pl-4 py-1 space-y-1">
            <div className="font-bold text-slate-900">1. The MCA (Ministry of Corporate Affairs) Master Data Check</div>
            <p className="text-slate-600">
              Visit <a href="https://www.mca.gov.in" target="_blank" rel="noreferrer" className="text-blue-600 underline">mca.gov.in</a> and check Company Master Data. If an Indian private limited company claims to operate, it must have a valid CIN (Corporate Identification Number) and active status.
            </p>
          </div>

          <div className="border-l-2 border-blue-600 pl-4 py-1 space-y-1">
            <div className="font-bold text-slate-900">2. Inspect Email Headers & Suffixes</div>
            <p className="text-slate-600">
              Look closely at the email domain. Imposters often use subtle modifications like <code className="bg-slate-100 px-1 py-0.5 rounded text-red-600">@tcs-careers.org</code> or <code className="bg-slate-100 px-1 py-0.5 rounded text-red-600">@wipro-recruitment.xyz</code> instead of <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700">@tcs.com</code> or <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700">@wipro.com</code>.
            </p>
          </div>

          <div className="border-l-2 border-blue-600 pl-4 py-1 space-y-1">
            <div className="font-bold text-slate-900">3. College Training & Placement Cell Validation</div>
            <p className="text-slate-600">
              Before agreeing to join or signing any bond, forward the offer letter to your college T&P officer. Placement cells keep records of authorized campus recruiters and blacklisted agencies.
            </p>
          </div>

          <div className="border-l-2 border-blue-600 pl-4 py-1 space-y-1">
            <div className="font-bold text-slate-900">4. What To Do If Money Was Already Transferred</div>
            <p className="text-slate-600">
              Immediately call the National Cyber Crime Helpline at <strong className="text-slate-900">1930</strong> (India) within the "golden hour" to request a financial freeze on the beneficiary UPI handle, and lodge an official complaint at <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="text-blue-600 underline">cybercrime.gov.in</a>.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Have a suspicious offer to check right now?
          </span>
          <button
            onClick={onAnalyzeClick}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            Launch Offer Analyzer
          </button>
        </div>
      </div>
    </div>
  );
};
