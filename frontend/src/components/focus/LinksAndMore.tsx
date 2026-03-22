"use client";

import { useState } from 'react';
import { Link2, PlayCircle, BrainCircuit, ExternalLink, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LinksAndMore({ nodeName, nodeId }: { nodeName: string, nodeId?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [bridgeData, setBridgeData] = useState<{explanation: string, videoUrl: string, timestamp: string} | null>(null);

  const fetchBridgeExplanation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/bridge-gap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ concept: nodeName }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setBridgeData(data);
      }
    } catch (error) {
      console.error("Failed to bridge gap:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forge-card min-h-[400px] flex flex-col">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-2">
            <Link2 className="text-[#f9a84d]" size={24} />
            Links & More
          </h2>
          <p className="text-[#f9a84d] text-[10px] font-bold uppercase tracking-widest opacity-60">
            Stuff You Don't Understand
          </p>
        </div>
      </div>

      {!bridgeData ? (
        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 max-w-sm">
            <BrainCircuit size={48} className="mx-auto text-white/20 mb-4" />
            <p className="text-sm text-[#f9e8d2] leading-relaxed mb-6">
              Struggling with <span className="text-[#f9a84d] font-bold">{nodeName}</span>? Let the Scholar AI bridge the gap using curated video logic.
            </p>
            <button 
              onClick={fetchBridgeExplanation}
              disabled={isLoading}
              className="w-full py-4 bg-[#2d150d] border border-[#f9a84d]/30 text-[#f9a84d] rounded-xl font-black uppercase tracking-tighter text-sm hover:bg-[#f9a84d]/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><RefreshCw className="animate-spin" size={16} /> Bridging Gap...</>
              ) : (
                <><PlayCircle size={18} /> Bridge the Gap</>
              )}
            </button>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 space-y-6"
        >
          {/* AI Bridge Explanation */}
          <div className="p-6 bg-[#f9a84d]/5 border border-[#f9a84d]/20 rounded-2xl relative">
            <div className="absolute -top-3 left-4 bg-[#1a0b06] px-2 text-[10px] font-black text-[#f9a84d] uppercase tracking-widest flex items-center gap-1">
              <BrainCircuit size={12} /> Bridge Explanation
            </div>
            <p className="text-[#f9e8d2] text-sm leading-relaxed whitespace-pre-wrap">
              {bridgeData.explanation}
            </p>
          </div>

          {/* Timestamped Video Link */}
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400">
              <PlayCircle size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#f9e8d2] mb-1">Source Video</h4>
              <p className="text-[10px] text-white/50">Jump straight to the relevant explanation.</p>
            </div>
            <a 
              href={`${bridgeData.videoUrl}&t=${bridgeData.timestamp}s`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest rounded transition-all hover:bg-indigo-600 flex items-center gap-2"
            >
              Watch at {Math.floor(parseInt(bridgeData.timestamp)/60)}:{(parseInt(bridgeData.timestamp)%60).toString().padStart(2, '0')} <ExternalLink size={14} />
            </a>
          </div>

          <button 
            onClick={() => setBridgeData(null)}
            className="text-[10px] uppercase font-black tracking-widest text-white/40 hover:text-white mx-auto block mt-6"
          >
            ← Reset
          </button>
        </motion.div>
      )}
    </div>
  );
}
