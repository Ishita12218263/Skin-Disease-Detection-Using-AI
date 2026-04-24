import React from 'react';
import { motion } from 'motion/react';
import { AnalysisResult } from '../services/geminiService';
import { Clock, ChevronRight, Trash2, ArrowLeft, ExternalLink } from 'lucide-react';

interface HistoryItem extends AnalysisResult {
  id: string;
  timestamp: string;
}

interface HistoryViewProps {
  onBack: () => void;
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  history: HistoryItem[];
}

export default function HistoryView({ onBack, onSelect, onDelete, history }: HistoryViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors mb-2"
          >
            <ArrowLeft size={18} />
            Back to Analysis
          </button>
          <h2 className="text-3xl font-display font-bold text-slate-900">Clinical History</h2>
          <p className="text-slate-500 text-sm">Review previous diagnostic reports and cases.</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Clock size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No History Found</h3>
            <p className="text-slate-500 max-w-xs mx-auto">Analyze a skin condition to build your local clinical database.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((item) => (
            <motion.div
              layout
              key={item.id}
              className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all flex items-center justify-between gap-4 cursor-pointer"
              onClick={() => onSelect(item)}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                  <div className="w-6 h-6 border-2 border-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  </div>
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{item.conditionName}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                      {new Date(item.timestamp).toLocaleDateString()} • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      item.urgencyLevel === 'High' ? 'bg-red-100 text-red-600' : 
                      item.urgencyLevel === 'Moderate' ? 'bg-amber-100 text-amber-600' : 
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {item.urgencyLevel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
                <ChevronRight className="text-slate-300 transition-transform group-hover:translate-x-1" size={20} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
            <ExternalLink size={12} />
            Data Integrity
          </div>
          <h3 className="text-xl font-bold">Local-Only Processing</h3>
          <p className="text-slate-400 text-sm max-w-md">
            History is stored locally in your browser session. For long-term clinical storage, consider migrating to our Enterprise Cloud nodes.
          </p>
        </div>
        <Clock className="absolute right-[-20px] bottom-[-20px] h-32 w-32 text-white/5 -rotate-12" />
      </div>
    </motion.div>
  );
}
