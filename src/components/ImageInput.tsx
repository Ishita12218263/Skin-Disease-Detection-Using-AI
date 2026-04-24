import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, RefreshCcw, CameraIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageInputProps {
  onImageSelect: (base64: string) => void;
  isLoading: boolean;
  loadingMessage?: string;
}

export default function ImageInput({ onImageSelect, isLoading, loadingMessage }: ImageInputProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const cleanBase64 = base64.split(',')[1];
      setPreview(base64);
      onImageSelect(cleanBase64);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const base64 = canvas.toDataURL('image/jpeg');
      const cleanBase64 = base64.split(',')[1];
      setPreview(base64);
      onImageSelect(cleanBase64);
      stopCamera();
    }
  };

  const reset = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <AnimatePresence mode="wait">
        {!preview && !isCameraOpen ? (
          <motion.div
            key="input-selection"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-blue-50/20 hover:border-blue-400 shadow-sm'
            }`}
            onDragEnter={onDrag}
            onDragLeave={onDrag}
            onDragOver={onDrag}
            onDrop={onDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-0">
                <Camera size={40} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-slate-800">Upload Affected Skin Area</h2>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  For the most accurate AI analysis, ensure the image is well-lit and in clear focus.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-blue-200 active:scale-95 transition-all"
                >
                  Select Photo
                </button>
                <button
                  onClick={startCamera}
                  className="bg-white border border-slate-300 text-slate-700 px-8 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                >
                  Capture Live
                </button>
              </div>
            </div>
          </motion.div>
        ) : isCameraOpen ? (
          <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative rounded-2xl overflow-hidden bg-black aspect-square max-h-[500px]"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-0 w-full flex justify-center gap-4 px-6">
              <button
                onClick={stopCamera}
                className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <X size={24} />
              </button>
              <button
                onClick={capturePhoto}
                className="p-5 bg-white rounded-full text-emerald-600 shadow-xl hover:scale-105 transition-transform"
              >
                <CameraIcon size={32} fill="currentColor" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl bg-white border border-slate-100"
          >
            <img src={preview!} alt="Preview" className="w-full h-auto max-h-[500px] object-contain bg-slate-50" />
            
            {isLoading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="text-blue-600"
                >
                  <RefreshCcw size={48} />
                </motion.div>
                <p className="font-display font-semibold text-slate-800 text-lg">{loadingMessage || 'Analyzing Skin Tissue...'}</p>
                <p className="text-blue-600/80 text-sm font-medium animate-pulse">Running AI Dermatological Model</p>
              </div>
            )}
            
            <button
              onClick={reset}
              disabled={isLoading}
              className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
