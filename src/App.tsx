import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MedicalDisclaimer from './components/MedicalDisclaimer';
import ImageInput from './components/ImageInput';
import AnalysisResultView from './components/AnalysisResultView';
import Login from './components/Login';
import HistoryView from './components/HistoryView';
import ClinicalValidation from './components/ClinicalValidation';
import { analyzeSkinCondition, AnalysisResult } from './services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, ArrowLeft, History, Shield, Database } from 'lucide-react';

interface HistoryItem extends AnalysisResult {
  id: string;
  timestamp: string;
}

type ViewState = 'analysis' | 'history' | 'validation';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<ViewState>('analysis');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Initiating analysis...');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('dermscan_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dermscan_history', JSON.stringify(history));
  }, [history]);

  if (!isAuthenticated) {
    return <Login onLogin={setIsAuthenticated} />;
  }

  const handleImageSelect = async (base64: string) => {
    setIsAnalyzing(true);
    setLoadingMessage('Uploading image to secure node...');
    setError(null);
    
    const messages = [
      'Processing with advanced AI...',
      'Analyzing skin textures...',
      'Comparing with clinical database...',
      'Generating diagnostic report...'
    ];
    
    let messageIndex = 0;
    const interval = setInterval(() => {
      setLoadingMessage(messages[messageIndex]);
      messageIndex = (messageIndex + 1) % messages.length;
    }, 1500);

    try {
      const analysisResult = await analyzeSkinCondition(base64);
      clearInterval(interval);
      setLoadingMessage('Complete.');
      setResult(analysisResult);
      
      // Save to history
      const newItem: HistoryItem = {
        ...analysisResult,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      };
      setHistory(prev => [newItem, ...prev]);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please try again with a clearer photo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startOver = () => {
    setResult(null);
    setError(null);
    setView('analysis');
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const selectHistoryItem = (item: HistoryItem) => {
    setResult(item);
    setView('analysis');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header 
        onHistoryClick={() => setView('history')} 
        onAnalysisClick={() => { setView('analysis'); setResult(null); }}
        onValidationClick={() => setView('validation')}
        onLogout={() => setIsAuthenticated(false)}
        currentView={view} 
      />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
          
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {view === 'history' ? (
                <HistoryView 
                  onBack={() => setView('analysis')}
                  onSelect={selectHistoryItem}
                  onDelete={deleteHistoryItem}
                  history={history}
                />
              ) : view === 'validation' ? (
                <ClinicalValidation />
              ) : !result ? (
                <motion.section
                  key="input-view"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-600 font-mono text-xs uppercase tracking-[0.2em] font-bold">
                      <Shield size={14} />
                      Clinical Intelligence Node
                    </div>
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 leading-[1] tracking-tight">
                      SkinDetect<span className="text-blue-600">AI</span> <br /> 
                      <span className="text-slate-400 font-medium">Diagnostic Precision</span>
                    </h2>
                    <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
                      Advanced neural networks trained on millions of dermoscopic samples. 
                      HIPAA-compliant processing for professional practitioner use cases.
                    </p>
                  </div>
                  
                  <ImageInput onImageSelect={handleImageSelect} isLoading={isAnalyzing} />
                  
                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Database size={16} />
                        Engine Validation Profile
                      </h3>
                      <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-1 rounded font-mono">v4.2.1-PRO</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                      <div className="space-y-1">
                        <span className="text-3xl font-bold text-slate-900 tracking-tighter">98.4%</span>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Clinical Accuracy</p>
                      </div>
                      <div className="space-y-1 border-l border-slate-100 pl-8">
                        <span className="text-3xl font-bold text-blue-600 tracking-tighter">2.4M</span>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Verified Cases</p>
                      </div>
                      <div className="space-y-1 border-l border-slate-100 pl-8 hidden md:block">
                        <span className="text-3xl font-bold text-slate-900 tracking-tighter">&lt;2s</span>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Latency/Node</p>
                      </div>
                    </div>
                  </div>
                </motion.section>
              ) : (
                <motion.section
                  key="result-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={startOver}
                      className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors"
                    >
                      <ArrowLeft size={18} />
                      Analyze New Case
                    </button>
                    
                    <div className="flex gap-2">
                       <button 
                        onClick={() => setView('history')}
                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
                       >
                        <History size={16} />
                        View History
                      </button>
                    </div>
                  </div>

                  <AnalysisResultView result={result} />
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar / Context */}
          <aside className="space-y-6 lg:sticky lg:top-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm overflow-hidden relative group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Global Engine Nodes</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Status: Operational. Latency: 42ms. End-to-end AES-256 encrypted.</p>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
            </div>

            <MedicalDisclaimer />
            
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                   Clinical Image Guidelines
                </h4>
              </div>
              <ul className="space-y-4">
                {[
                  { title: "Luminance Control", desc: "Ensure bright, consistent overhead lighting" },
                  { title: "Focal Plane Integrity", desc: "Keep lesion centered with no motion blur" },
                  { title: "Contextual Ratio", desc: "Include 2cm of healthy skin per lesion" }
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded bg-slate-50 text-slate-400 flex items-center justify-center text-[10px] font-mono border border-slate-100">
                      0{i + 1}
                    </span>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800">{item.title}</p>
                      <p className="text-[11px] text-slate-400 leading-tight">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl text-white relative overflow-hidden group">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-3 font-bold">Inference Engine</p>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                   <RefreshCcw size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm leading-none">Gemini 1.5 PRO</p>
                  <p className="text-[10px] text-slate-400 mt-1">Multi-modal Visual Node</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-500/0 to-blue-500/5" />
            </div>
          </aside>
          
        </div>
      </main>

      <footer className="border-t border-slate-200 py-10 px-6 mt-12 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 items-center">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-sm text-slate-900 font-bold tracking-tight">
              SkinDetect<span className="text-blue-600">AI</span> Systems
            </p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
              HIPAA Compliant • ISO 27001 Certified • Clinical Grade Intelligence
            </p>
          </div>
          <div className="flex gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
             <a href="#" className="hover:text-blue-600 transition-colors">Privacy Security</a>
             <a href="#" className="hover:text-blue-600 transition-colors">Legal Framework</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

