import React, { useState } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { AnalyzerView } from './components/AnalyzerView';
import { ScamDatabaseView } from './components/ScamDatabaseView';
import { HowItWorksView } from './components/HowItWorksView';
import { ReportScamModal } from './components/ReportScamModal';
import { ScamReport } from './types';
import { ShieldAlert, Heart, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'analyzer' | 'database' | 'report' | 'how-it-works'
  >('dashboard');

  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportPrefillData, setReportPrefillData] = useState<Partial<ScamReport> | null>(null);

  const handleNavigate = (
    tab: 'analyzer' | 'database' | 'report' | 'how-it-works',
    sampleId?: string
  ) => {
    if (tab === 'analyzer') {
      setSelectedSampleId(sampleId || null);
      setActiveTab('analyzer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'report') {
      setReportPrefillData(null);
      setIsReportModalOpen(true);
    } else {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReportScamFromAnalysis = (prefillData: Partial<ScamReport>) => {
    setReportPrefillData(prefillData);
    setIsReportModalOpen(true);
  };

  const handleReportCreated = (newReport: ScamReport) => {
    // When a report is created, switch to database to show it
    setActiveTab('database');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <Header
        activeTab={activeTab === 'report' ? 'report' : activeTab}
        setActiveTab={tab => {
          if (tab === 'report') {
            setReportPrefillData(null);
            setIsReportModalOpen(true);
          } else {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView onNavigate={handleNavigate} />
        )}

        {activeTab === 'analyzer' && (
          <AnalyzerView
            initialSampleId={selectedSampleId}
            onReportScam={handleReportScamFromAnalysis}
          />
        )}

        {activeTab === 'database' && (
          <ScamDatabaseView
            onOpenReportModal={() => {
              setReportPrefillData(null);
              setIsReportModalOpen(true);
            }}
          />
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorksView
            onAnalyzeClick={() => {
              setSelectedSampleId(null);
              setActiveTab('analyzer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Global Report Scam Modal */}
      <ReportScamModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setReportPrefillData(null);
        }}
        onSuccess={handleReportCreated}
        prefillData={reportPrefillData}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800">OfferCheck</span>
            <span>· Open Student Cyber Defense Initiative</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                setActiveTab('how-it-works');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                setActiveTab('database');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors"
            >
              Scam Database
            </button>
            <button
              onClick={() => {
                setReportPrefillData(null);
                setIsReportModalOpen(true);
              }}
              className="hover:text-slate-900 transition-colors"
            >
              Report a Scam
            </button>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <span>Cybercrime Portal (1930)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="text-slate-400 text-center md:text-right">
            Risk scores represent heuristic estimates, not legal verification.
          </div>
        </div>
      </footer>
    </div>
  );
}
