import React, { useState } from 'react';
import { AnalysisResult } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle, Info, Stethoscope, ChevronRight, X } from 'lucide-react';
import SpecialistLocator from './SpecialistLocator';

interface AnalysisResultViewProps {
  result: AnalysisResult;
}

export default function AnalysisResultView({ result }: AnalysisResultViewProps) {
  const [showLocator, setShowLocator] = useState(false);

  const getUrgencyStyles = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Moderate': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case 'High': return <AlertTriangle className="h-5 w-5" />;
      case 'Moderate': return <Info className="h-5 w-5" />;
      default: return <CheckCircle className="h-5 w-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-8 pb-20"
    >
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-display font-bold text-slate-900 leading-tight">
              {result.conditionName}
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden max-w-[100px]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${result.confidenceScore * 100}%` }}
                  className="bg-blue-500 h-full"
                />
              </div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-tighter">
                AI Confidence: {(result.confidenceScore * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          
          <div className={`px-4 py-2 rounded-full border text-sm font-bold flex items-center gap-2 ${getUrgencyStyles(result.urgencyLevel)}`}>
            {getUrgencyIcon(result.urgencyLevel)}
            {result.urgencyLevel} Urgency
          </div>
        </div>

        <p className="text-slate-600 leading-relaxed text-lg">
          {result.description}
        </p>

        <div className="grid md:grid-cols-2 gap-8 pt-4">
          {/* Symptoms */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-slate-900 flex items-center gap-2">
              <span className="p-2 bg-slate-100 rounded-lg"><Info size={18} /></span>
              Common Symptoms
            </h4>
            <ul className="space-y-2">
              {result.commonSymptoms.map((symptom, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {symptom}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-slate-900 flex items-center gap-2">
              <span className="p-2 bg-slate-100 rounded-lg"><Stethoscope size={18} /></span>
              Clinical Guidance
            </h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                   <ChevronRight size={16} className="mt-0.5 text-emerald-500 shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Next Steps Card */}
      <div className="bg-slate-800 rounded-xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-lg">
          <h3 className="text-2xl font-display font-bold text-white">Find a Specialist</h3>
          <p className="text-slate-300">
            For a definitive diagnosis, please consult a certified dermatologist. They can perform physical exams and biopsies that AI cannot replicate.
          </p>
          <button 
            onClick={() => setShowLocator(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
          >
            Find Near Me
          </button>
        </div>
        <Stethoscope className="absolute right-[-20px] bottom-[-20px] h-64 w-64 text-slate-700 opacity-20 rotate-12" />
      </div>

      <AnimatePresence>
        {showLocator && (
          <SpecialistLocator onClose={() => setShowLocator(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
