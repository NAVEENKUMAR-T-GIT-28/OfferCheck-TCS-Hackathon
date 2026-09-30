import React, { useState } from 'react';
import { X, Flag, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { ScamCategory, ScamReport } from '../types';
import { saveScamReport } from '../services/storage';

interface ReportScamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newReport: ScamReport) => void;
  prefillData?: Partial<ScamReport> | null;
}

export const ReportScamModal: React.FC<ReportScamModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  prefillData
}) => {
  const [companyName, setCompanyName] = useState(prefillData?.companyName || '');
  const [recruiterName, setRecruiterName] = useState(prefillData?.recruiterName || '');
  const [recruiterPhone, setRecruiterPhone] = useState(prefillData?.recruiterPhone || '');
  const [recruiterEmail, setRecruiterEmail] = useState(prefillData?.recruiterEmail || '');
  const [recruiterUpi, setRecruiterUpi] = useState(prefillData?.recruiterUpi || '');
  const [channel, setChannel] = useState(prefillData?.channel || 'WhatsApp');
  const [category, setCategory] = useState<ScamCategory>(
    (prefillData?.category as ScamCategory) || 'Security Deposit Scam'
  );
  const [amountRequested, setAmountRequested] = useState(prefillData?.amountRequested || '');
  const [description, setDescription] = useState(prefillData?.description || '');
  const [evidenceSnippet, setEvidenceSnippet] = useState(prefillData?.evidenceSnippet || '');
  const [url, setUrl] = useState(prefillData?.url || '');

  const [submitted, setSubmitted] = useState(false);
  const [createdReport, setCreatedReport] = useState<ScamReport | null>(null);
  const [error, setError] = useState('');

  // Update when prefillData changes
  React.useEffect(() => {
    if (prefillData) {
      if (prefillData.companyName) setCompanyName(prefillData.companyName);
      if (prefillData.recruiterEmail) setRecruiterEmail(prefillData.recruiterEmail);
      if (prefillData.recruiterPhone) setRecruiterPhone(prefillData.recruiterPhone);
      if (prefillData.recruiterUpi) setRecruiterUpi(prefillData.recruiterUpi);
      if (prefillData.category) setCategory(prefillData.category as ScamCategory);
      if (prefillData.description) setDescription(prefillData.description);
      if (prefillData.evidenceSnippet) setEvidenceSnippet(prefillData.evidenceSnippet);
      if (prefillData.url) setUrl(prefillData.url);
    }
  }, [prefillData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setError('Please provide the claimed company or organization name.');
      return;
    }
    if (!description.trim() && !evidenceSnippet.trim()) {
      setError('Please provide a short description or paste the evidence text of what occurred.');
      return;
    }

    setError('');

    // Determine severity
    let severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' = 'HIGH';
    if (
      amountRequested.toLowerCase().includes('deposit') ||
      recruiterUpi ||
      category === 'Security Deposit Scam' ||
      category === 'UPI / Direct Payment Scam'
    ) {
      severity = 'CRITICAL';
    } else if (category === 'Fake Internship Certificate') {
      severity = 'MEDIUM';
    }

    const saved = saveScamReport({
      companyName: companyName.trim(),
      recruiterName: recruiterName.trim(),
      recruiterPhone: recruiterPhone.trim(),
      recruiterEmail: recruiterEmail.trim(),
      recruiterUpi: recruiterUpi.trim(),
      channel,
      category,
      amountRequested: amountRequested.trim() || 'Unspecified',
      currency: 'INR',
      description: description.trim(),
      evidenceSnippet: evidenceSnippet.trim(),
      url: url.trim(),
      severity
    });

    setCreatedReport(saved);
    setSubmitted(true);
    onSuccess(saved);
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setCreatedReport(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in fade-in-50">
        {submitted && createdReport ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Scam Report Successfully Logged
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Your submission has been recorded as Incident #{createdReport.id} in the OfferCheck community repository. It is now instantly searchable to protect fellow students.
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg max-w-sm mx-auto text-xs text-left space-y-1">
              <div className="font-semibold text-slate-800">{createdReport.companyName}</div>
              <div className="text-slate-600">Category: {createdReport.category}</div>
              <div className="text-slate-600 font-mono">Report ID: {createdReport.id}</div>
            </div>
            <div className="pt-2">
              <button
                onClick={handleResetForm}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                View in Scam Database
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                    Community Scam Intelligence
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Report a Suspicious Offer or Scam
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Anonymously document fake recruiters, money demands, or deceptive internship schemes.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Claimed Company / Organization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="e.g. TCS (Impersonated), Apex Tech"
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Scam Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as ScamCategory)}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 text-slate-900 bg-white"
                  >
                    <option value="Security Deposit Scam">Security Deposit Scam</option>
                    <option value="Registration Fee Scam">Registration Fee Scam</option>
                    <option value="UPI / Direct Payment Scam">UPI / Direct Payment Scam</option>
                    <option value="Recruiter Impersonation">Recruiter Impersonation</option>
                    <option value="Fake Interview Scam">Fake Interview Scam</option>
                    <option value="Task / Daily Work Scam">Task / Daily Work Scam</option>
                    <option value="Fake Internship Certificate">Fake Internship Certificate</option>
                    <option value="Phishing / Credential Theft">Phishing / Credential Theft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Recruiter Name / Alias
                  </label>
                  <input
                    type="text"
                    value={recruiterName}
                    onChange={e => setRecruiterName(e.target.value)}
                    placeholder="e.g. Anil Sharma, HR Team"
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Channel
                  </label>
                  <select
                    value={channel}
                    onChange={e => setChannel(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 text-slate-900 bg-white"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Telegram">Telegram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Email">Email</option>
                    <option value="Instagram">Instagram</option>
                    <option value="SMS">SMS</option>
                    <option value="Campus Job Board">Campus Job Board</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount Demanded
                  </label>
                  <input
                    type="text"
                    value={amountRequested}
                    onChange={e => setAmountRequested(e.target.value)}
                    placeholder="e.g. ₹2,500 or ₹1,200"
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 text-slate-900"
                  />
                </div>
              </div>

              {/* Identifiers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={recruiterPhone}
                    onChange={e => setRecruiterPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Recruiter Email Address
                  </label>
                  <input
                    type="email"
                    value={recruiterEmail}
                    onChange={e => setRecruiterEmail(e.target.value)}
                    placeholder="e.g. tcs.desk@gmail.com"
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    UPI ID Used (if any)
                  </label>
                  <input
                    type="text"
                    value={recruiterUpi}
                    onChange={e => setRecruiterUpi(e.target.value)}
                    placeholder="e.g. tcshr.verify@okaxis"
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Website URL / Link Provided
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="e.g. https://bit.ly/verify or fake website"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Incident Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe what the recruiter said, what fee was demanded, or how you identified the anomaly..."
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Evidence Snippet / Original Message
                </label>
                <textarea
                  rows={2}
                  value={evidenceSnippet}
                  onChange={e => setEvidenceSnippet(e.target.value)}
                  placeholder="Exact quote from the message or email..."
                  className="w-full font-mono text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 text-slate-900"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-[11px] leading-relaxed">
                <span className="font-semibold text-slate-700">Privacy & Anonymization:</span> Do not include your own personal Aadhaar number, banking credentials, or student roll number. Reports are sanitized to strictly document scammer identifiers and protect candidate confidentiality.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  Submit Scam Intelligence
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
