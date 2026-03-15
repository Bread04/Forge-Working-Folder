"use client";

import { useState } from 'react';
import { Brain, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BlurtingCanvas({ nodeName, sourceContent }: { nodeName: string, sourceContent: string }) {
  const [blurtText, setBlurtText] = useState('');
  const [result, setResult] = useState<{ score: number, missed: string[] } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeBlurt = async () => {
    setIsAnalyzing(true);
    // Simulation of AI comparison logic
    setTimeout(() => {
      setResult({
        score: 75,
        missed: ['Entropy', 'Second Law of Thermodynamics', 'Energy Dissipation']
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="forge-card space-y-6 min-h-[500px] flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">Blurting Canvas</h2>
          <p className="text-[#f9a84d] text-[10px] font-bold uppercase tracking-widest opacity-60">Node: {nodeName}</p>
        </div>
        <div className="p-3 bg-[#f9a84d]/10 rounded-xl text-[#f9a84d]">
          <Brain size={24} />
        </div>
      </div>

      {!result ? (
        <>
          <textarea
            value={blurtText}
            onChange={(e) => setBlurtText(e.target.value)}
            placeholder="Type everything you remember about this concept... Don't filter, just blurt."
            className="flex-1 w-full bg-white/5 border border-[#43261a] rounded-2xl p-6 text-[#f9e8d2] placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-[#f9a84d]/50 transition-all resize-none font-light leading-relaxed"
          />
          <button 
            onClick={analyzeBlurt}
            disabled={isAnalyzing || !blurtText}
            className="w-full py-5 bg-[#f9a84d] hover:bg-[#ffbd71] text-[#1a0b06] rounded-2xl font-black uppercase tracking-tighter disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isAnalyzing ? 'Neural Analysis in Progress...' : 'Submit for AI Verification'}
          </button>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 flex-1"
        >
          <div className="flex items-center gap-8 p-6 bg-white/5 rounded-3xl border border-white/5">
            <div className="text-5xl font-black text-[#f9a84d] italic">{result.score}%</div>
            <div>
              <p className="text-white font-bold uppercase text-xs tracking-widest">Memory Sync Score</p>
              <p className="text-white/40 text-[10px]">Your recall accuracy based on source vectors.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-rose-400 text-xs font-black uppercase italic">
              <AlertCircle size={14} /> Missed Critical Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.missed.map(word => (
                <span key={word} className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full text-[10px] font-bold">
                  {word}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 italic text-sm">
            "You have a strong grasp of the core mechanics, but remember to anchor the discussion in entropy dissipation to complete the concept."
          </div>

          <button 
            onClick={() => { setResult(null); setBlurtText(''); }}
            className="w-full py-4 border border-[#43261a] text-[#f9a84d] rounded-xl font-bold uppercase text-xs hover:bg-[#f9a84d]/5 flex items-center justify-center gap-2"
          >
            <RefreshCcw size={14} /> Try Again
          </button>
        </motion.div>
      )}
    </div>
  );
}
