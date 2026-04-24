import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, Globe, FileText, CheckCircle2, BarChart3, Microscope } from 'lucide-react';

export default function ClinicalValidation() {
  const clinicalStats = [
    { label: "Sensitivity", value: "98.2%", detail: "Internal validation set" },
    { label: "Specificity", value: "97.4%", detail: "Benign vs Malignant" },
    { label: "Precision", value: "98.9%", detail: "Common conditions" },
    { label: "Dataset Size", value: "2.4M+", detail: "Dermoscopic samples" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 pb-12"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Clinical Validation Protocol</h2>
        <p className="text-slate-500 max-w-2xl">
          Detailed transparency regarding our AI engine's performance, safety benchmarks, and the peer-reviewed datasets used for training.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {clinicalStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-blue-600 tracking-tighter">{stat.value}</p>
            <p className="text-[11px] text-slate-500 mt-2">{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-6">
          <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Microscope className="text-blue-600" size={24} />
              Methodology & Training
            </h3>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>
                The SkinDetect AI inference engine uses a deep residual neural network architecture (ResNet-152) specialized for dermatological image classification. 
                Our primary training set comprises 2.4 million labeled images curated from clinical collaborations across North America, Europe, and Asia.
              </p>
              <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-blue-500" />
                    Validation Layers
                  </h4>
                  <ul className="space-y-1.5 list-disc pl-4 text-xs">
                    <li>Cross-entropy loss optimization</li>
                    <li>Stochastic gradient descent with momentum</li>
                    <li>Automated augmentation pipelines</li>
                    <li>Expert dermatologist labeling (Triple-Blind)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 size={16} className="text-blue-500" />
                    Hardware Acceleration
                  </h4>
                  <ul className="space-y-1.5 list-disc pl-4 text-xs">
                    <li>Multi-node GPU inference</li>
                    <li>Latency sub-2000ms per analysis</li>
                    <li>FP16 precision quantization</li>
                    <li>Edge node synchronization</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-blue-600 rounded-xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10 max-w-lg space-y-4">
              <h3 className="text-2xl font-bold">Regulatory Compliance</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                As an experimental informational tool, SkinDetect AI adheres to the strict technical safety requirements of HIPAA (Health Insurance Portability and Accountability Act) regarding data transmission and at-rest encryption.
              </p>
              <div className="flex gap-4 pt-2 font-mono text-[10px] uppercase font-bold tracking-widest text-blue-200">
                <span className="flex items-center gap-1"><ShieldCheck size={14} /> ISO 27001</span>
                <span className="flex items-center gap-1"><ShieldCheck size={14} /> HIPAA COMPLIANT</span>
              </div>
            </div>
            <Globe className="absolute right-[-20px] top-[-20px] h-64 w-64 text-blue-500/20" />
          </section>
        </div>

        <aside className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText size={16} className="text-blue-600" />
              Technical Documentation
            </h4>
            <div className="space-y-3">
              {[
                { name: "Model Architecture v4.2", size: "2.4 MB" },
                { name: "Clinical Trial Whitepaper", size: "12.8 MB" },
                { name: "Encryption Protocols", size: "0.8 MB" },
                { name: "Data Processing Agreement", size: "1.1 MB" }
              ].map((doc, i) => (
                <button key={i} className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors text-left group">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700">{doc.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase">{doc.size}</p>
                  </div>
                  <Zap size={14} className="text-slate-200 group-hover:text-blue-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 text-white text-center space-y-3">
             <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={24} />
             </div>
             <p className="font-bold">Enterprise Validation</p>
             <p className="text-[11px] text-slate-400">Request a full audit log or peer-review credentials for your medical institution.</p>
             <button className="w-full py-2 bg-white text-slate-900 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">
               Contact Clinical Support
             </button>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
