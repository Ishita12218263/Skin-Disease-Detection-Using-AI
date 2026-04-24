import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function MedicalDisclaimer() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-8 shadow-sm"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ShieldAlert className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-bold text-red-800 uppercase tracking-wider flex items-center gap-2">
            Critical Medical Disclaimer
          </h3>
          <div className="mt-2 text-sm text-red-700 space-y-2">
            <p>
              This application is an AI-powered informational tool. It is <strong>NOT</strong> a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p>
              Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. 
              <strong> Never disregard professional medical advice or delay in seeking it because of something you have read on this app.</strong>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
