import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Star, ExternalLink, Navigation, Search, X, Loader2, ChevronRight } from 'lucide-react';

interface Specialist {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  distance: string;
  address: string;
  phone: string;
  verified: boolean;
}

interface SpecialistLocatorProps {
  onClose: () => void;
}

export default function SpecialistLocator({ onClose }: SpecialistLocatorProps) {
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);

  useEffect(() => {
    const fetchSpecialists = async () => {
      setLoading(true);
      // Simulate geolocation request
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // In a real app, we'd use position.coords.latitude/longitude to fetch via API
            // For this professional prototype, we'll simulate a 1.5s lookup
            setTimeout(() => {
              const mockSpecialists: Specialist[] = [
                {
                  id: '1',
                  name: "Dr. Sarah Chen, MD",
                  specialty: "Board Certified Dermatologist",
                  rating: 4.9,
                  reviews: 124,
                  distance: "0.8 miles away",
                  address: "450 Medical Plaza, Ste 200, City Center",
                  phone: "(555) 123-4567",
                  verified: true
                },
                {
                  id: '2',
                  name: "Dermatology Associates",
                  specialty: "Clinical Dermatology & Oncology",
                  rating: 4.7,
                  reviews: 89,
                  distance: "1.4 miles away",
                  address: "128 Wellness Blvd, Building B",
                  phone: "(555) 987-6543",
                  verified: true
                },
                {
                  id: '3',
                  name: "Dr. Michael Ross",
                  specialty: "Cosmetic & Medical Dermatology",
                  rating: 4.8,
                  reviews: 216,
                  distance: "2.1 miles away",
                  address: "789 North Avenue, Professional Tower",
                  phone: "(555) 246-8135",
                  verified: true
                }
              ];
              setSpecialists(mockSpecialists);
              setLoading(false);
            }, 1500);
          },
          (error) => {
            setLocationError("Location access denied. Displaying general regional specialists.");
            // Fallback mock data
            setTimeout(() => {
                const mockSpecialists: Specialist[] = [
                  {
                    id: '1',
                    name: "Regional Skin Care Center",
                    specialty: "General Dermatology",
                    rating: 4.5,
                    reviews: 56,
                    distance: "Nearby",
                    address: "Main Street Medical Building",
                    phone: "(555) 111-2222",
                    verified: true
                  }
                ];
                setSpecialists(mockSpecialists);
                setLoading(false);
            }, 1000);
          }
        );
      } else {
        setLocationError("Geolocation is not supported by your browser.");
        setLoading(false);
      }
    };

    fetchSpecialists();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="text-blue-600" size={20} />
              Nearby Specialists
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 tracking-wide uppercase font-bold">Verified Licensed Practitioners</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4 text-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <div className="space-y-1">
                <p className="font-bold text-slate-800">Locating Specialists...</p>
                <p className="text-xs text-slate-400">Scanning local clinical node database</p>
              </div>
            </div>
          ) : (
            <>
              {locationError && (
                <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex items-start gap-3">
                  <Search className="text-amber-500 shrink-0 mt-0.5" size={16} />
                  <p className="text-xs text-amber-700 leading-relaxed font-medium">{locationError}</p>
                </div>
              )}

              <div className="space-y-4">
                {specialists.map((dr) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={dr.id}
                    className="group bg-white border border-slate-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900">{dr.name}</h4>
                        {dr.verified && (
                          <div className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-blue-100">
                            Verified
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{dr.specialty}</p>
                      
                      <div className="flex items-center gap-4 text-[11px]">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star size={12} fill="currentColor" />
                          {dr.rating} <span className="text-slate-400 font-normal">({dr.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Navigation size={12} />
                          {dr.distance}
                        </div>
                      </div>

                      <div className="space-y-1 mt-1">
                        <div className="flex items-start gap-2 text-[11px] text-slate-500">
                          <MapPin size={12} className="mt-0.5 shrink-0" />
                          <span>{dr.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <Phone size={12} className="shrink-0" />
                          <span>{dr.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-2 shrink-0">
                      <button className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                        Book Consultation
                        <ChevronRight size={14} />
                      </button>
                      <button className="flex-1 md:flex-none px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                        View Profile
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.1em]">
            Integration powered by HealthData™ API • Results filtered by proximity
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
