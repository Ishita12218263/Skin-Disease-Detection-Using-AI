import React from 'react';
import { ShieldCheck, History, Activity } from 'lucide-react';

interface HeaderProps {
  onHistoryClick: () => void;
  onAnalysisClick: () => void;
  onValidationClick: () => void;
  onLogout: () => void;
  currentView: 'analysis' | 'history' | 'validation';
}

export default function Header({ onHistoryClick, onAnalysisClick, onValidationClick, onLogout, currentView }: HeaderProps) {
  return (
    <header className="py-6 px-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200 cursor-pointer hover:bg-blue-700 transition-colors"
            onClick={onAnalysisClick}
          >
            <ShieldCheck size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 leading-none cursor-pointer" onClick={onAnalysisClick}>
              SkinDetect<span className="text-blue-600">AI</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest leading-none">
                Clinical Node US-EAST
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-8 mr-8 text-[11px] font-bold uppercase tracking-widest">
            <button 
              onClick={onAnalysisClick}
              className={`hover:text-blue-600 transition-colors flex items-center gap-2 ${currentView === 'analysis' ? 'text-blue-600' : 'text-slate-400'}`}
            >
              <Activity size={14} />
              Diagnostic Tool
            </button>
            <button 
              onClick={onValidationClick}
              className={`hover:text-blue-600 transition-colors ${currentView === 'validation' ? 'text-blue-600' : 'text-slate-400'}`}
            >
              Clinical Validation
            </button>
          </nav>

          <button 
            onClick={onHistoryClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
              currentView === 'history' 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' 
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <History size={16} />
            History
          </button>
          
          <div className="w-px h-6 bg-slate-200 mx-2 hidden md:block" />
          
          <button 
            onClick={onLogout}
            className="hidden md:block px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-900 transition-colors shadow-sm"
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}

