import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  PlusCircle,
  AlertTriangle,
  AlertOctagon,
  Calendar,
  Phone,
  Mail,
  CreditCard,
  Building,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';
import { ScamReport, ScamCategory } from '../types';
import { getStoredScamReports } from '../services/storage';

interface ScamDatabaseViewProps {
  onOpenReportModal: () => void;
  onAnalyzeSpecificOffer?: (text: string) => void;
}

export const ScamDatabaseView: React.FC<ScamDatabaseViewProps> = ({
  onOpenReportModal,
  onAnalyzeSpecificOffer
}) => {
  const [reports, setReports] = useState<ScamReport[]>(() => getStoredScamReports());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [activeReportDetail, setActiveReportDetail] = useState<ScamReport | null>(null);

  const categories: { label: string; value: string }[] = [
    { label: 'All Categories', value: 'ALL' },
    { label: 'Security Deposit Scam', value: 'Security Deposit Scam' },
    { label: 'Registration Fee Scam', value: 'Registration Fee Scam' },
    { label: 'UPI / Direct Payment Scam', value: 'UPI / Direct Payment Scam' },
    { label: 'Recruiter Impersonation', value: 'Recruiter Impersonation' },
    { label: 'Fake Interview Scam', value: 'Fake Interview Scam' },
    { label: 'Task / Daily Work Scam', value: 'Task / Daily Work Scam' },
    { label: 'Fake Internship Certificate', value: 'Fake Internship Certificate' },
    { label: 'Phishing / Credential Theft', value: 'Phishing / Credential Theft' }
  ];

  const filteredReports = useMemo(() => {
    return reports.filter(item => {
      const matchSearch =
        searchTerm.trim() === '' ||
        item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.recruiterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.recruiterEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.recruiterPhone.includes(searchTerm) ||
        item.recruiterUpi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.evidenceSnippet.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;

      const matchSeverity =
        selectedSeverity === 'ALL' || item.severity === selectedSeverity;

      return matchSearch && matchCategory && matchSeverity;
    });
  }, [reports, searchTerm, selectedCategory, selectedSeverity]);

  const handleRefresh = () => {
    setReports(getStoredScamReports());
  };

  return (
    <div className="space-y-6 py-2">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Community Scam Repository
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Search verified recruitment deception patterns, reported fake recruiter emails, UPI addresses, and predatory internship schemes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenReportModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            Report a Scam
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by company name, phone number, email, UPI ID, or keyword (e.g. 'police clearance', 'TCS', '@okaxis')..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          {/* Category Filter Controls */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 font-semibold mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Category:
            </span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="text-xs p-1.5 rounded-md border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-blue-600"
            >
              {categories.map(c => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <span className="text-slate-500 font-semibold ml-3 mr-1">
              Severity:
            </span>
            <select
              value={selectedSeverity}
              onChange={e => setSelectedSeverity(e.target.value)}
              className="text-xs p-1.5 rounded-md border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-blue-600"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium</option>
            </select>
          </div>

          <div className="text-slate-500 font-mono">
            Showing {filteredReports.length} of {reports.length} records
          </div>
        </div>
      </div>

      {/* Reports Table / Card List */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
            <Search className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">
              No matching scam patterns found
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No reported incident matched your search criteria. Note: Absence from the database does not guarantee an offer is authentic.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setSelectedSeverity('ALL');
              }}
              className="px-3 py-1.5 text-xs text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredReports.map(item => {
            const severityClass =
              item.severity === 'CRITICAL'
                ? 'text-red-700 bg-red-50 border-red-200'
                : item.severity === 'HIGH'
                ? 'text-orange-700 bg-orange-50 border-orange-200'
                : 'text-amber-700 bg-amber-50 border-amber-200';

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all shadow-xs"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className={`px-2 py-0.5 rounded font-semibold border ${severityClass}`}>
                        {item.severity}
                      </span>
                      <span className="font-semibold text-slate-700">
                        {item.category}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Reported {item.reportedDate}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500 font-mono">
                        {item.reportCount} report{item.reportCount > 1 ? 's' : ''}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {item.companyName}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Metadata Identifiers */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
                      {item.amountRequested && (
                        <div className="flex items-center gap-1.5 text-red-700 font-medium bg-red-50/60 px-2.5 py-1 rounded border border-red-100">
                          <CreditCard className="w-3.5 h-3.5 shrink-0" />
                          <span>Demanded: {item.amountRequested}</span>
                        </div>
                      )}

                      {item.recruiterUpi && (
                        <div className="flex items-center gap-1.5 text-slate-700 font-mono bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                          <span>UPI: {item.recruiterUpi}</span>
                        </div>
                      )}

                      {item.recruiterEmail && (
                        <div className="flex items-center gap-1.5 text-slate-700 font-mono bg-slate-50 px-2.5 py-1 rounded border border-slate-200 truncate">
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{item.recruiterEmail}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 md:pt-0">
                    <span className="text-[11px] text-slate-500 font-mono">
                      ID #{item.id}
                    </span>
                    <button
                      onClick={() => setActiveReportDetail(item)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                    >
                      <span>Inspect Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {activeReportDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200 space-y-5 animate-in fade-in-50">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-semibold text-blue-600">
                  Incident Record #{activeReportDetail.id}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  {activeReportDetail.companyName}
                </h2>
                <div className="text-xs text-slate-500 mt-1">
                  Category: {activeReportDetail.category} · Status: {activeReportDetail.status}
                </div>
              </div>
              <button
                onClick={() => setActiveReportDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <div className="font-semibold text-slate-800 mb-1">
                  Incident Description:
                </div>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {activeReportDetail.description}
                </p>
              </div>

              {activeReportDetail.evidenceSnippet && (
                <div>
                  <div className="font-semibold text-slate-800 mb-1">
                    Direct Evidence Message:
                  </div>
                  <pre className="font-mono text-xs bg-slate-900 text-slate-100 p-3.5 rounded-lg whitespace-pre-wrap leading-relaxed">
                    {activeReportDetail.evidenceSnippet}
                  </pre>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-slate-500">Recruiter Contact:</div>
                  <div className="font-medium text-slate-900">{activeReportDetail.recruiterName || 'Not specified'}</div>
                  <div className="font-mono text-slate-700">{activeReportDetail.recruiterPhone || 'No phone'}</div>
                  <div className="font-mono text-slate-700">{activeReportDetail.recruiterEmail || 'No email'}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-slate-500">Payment & Channel:</div>
                  <div className="font-semibold text-red-700">Demanded: {activeReportDetail.amountRequested || 'None'}</div>
                  <div className="font-mono text-slate-700">UPI: {activeReportDetail.recruiterUpi || 'None listed'}</div>
                  <div className="text-slate-700">Offer Channel: {activeReportDetail.channel}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <span className="text-xs text-slate-500 font-mono">
                Reported on {activeReportDetail.reportedDate}
              </span>
              <button
                onClick={() => setActiveReportDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
