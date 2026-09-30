import React from 'react';
import { ShieldAlert, PlusCircle, Search, FileText, BarChart3, HelpCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'analyzer' | 'database' | 'report' | 'how-it-works';
  setActiveTab: (tab: 'dashboard' | 'analyzer' | 'database' | 'report' | 'how-it-works') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  OfferCheck
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs text-slate-500 font-normal">
                  Internship Scam Defense
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'dashboard'
                  ? 'text-blue-600 bg-blue-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </span>
            </button>

            <button
              onClick={() => setActiveTab('analyzer')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'analyzer'
                  ? 'text-blue-600 bg-blue-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Analyze Offer
              </span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'database'
                  ? 'text-blue-600 bg-blue-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Search className="w-4 h-4" />
                Scam Database
              </span>
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'report'
                  ? 'text-blue-600 bg-blue-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4" />
                Report Scam
              </span>
            </button>

            <button
              onClick={() => setActiveTab('how-it-works')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'how-it-works'
                  ? 'text-blue-600 bg-blue-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                How It Works
              </span>
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('analyzer')}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              Analyze an Offer
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center justify-between border-t border-slate-100 py-2 overflow-x-auto gap-2 text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1.5 rounded whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`px-2.5 py-1.5 rounded whitespace-nowrap ${activeTab === 'analyzer' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'}`}
          >
            Analyze Offer
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-2.5 py-1.5 rounded whitespace-nowrap ${activeTab === 'database' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'}`}
          >
            Scam Reports
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-2.5 py-1.5 rounded whitespace-nowrap ${activeTab === 'report' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'}`}
          >
            Report Scam
          </button>
          <button
            onClick={() => setActiveTab('how-it-works')}
            className={`px-2.5 py-1.5 rounded whitespace-nowrap ${activeTab === 'how-it-works' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'}`}
          >
            Guide
          </button>
        </div>
      </div>
    </header>
  );
};
