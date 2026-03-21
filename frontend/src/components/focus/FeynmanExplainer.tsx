"use client";

import { useState } from 'react';
import { Mic, Send, Lightbulb, PlayCircle, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTreeStore } from '@/store/useTreeStore';

export default function FeynmanExplainer({ nodeName, nodeId }: { nodeName: string, nodeId?: string }) {
  const [explanation, setExplanation] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const adjustMastery = useTreeStore((state) => state.adjustMastery);

  const getFeedback = () => {
    setFeedback("Solid explanation! You simplified the jargon well. However, you might want to clarify the 'moment of inertia' part—try using the 'spinning ice skater' analogy to make it even simpler for a layman.");
    if (nodeId) adjustMastery(nodeId, 8);
  };

  return (
    <div className="forge-card space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter italic">Feynman Explainer</h2>
          <p className="text-[#f9a84d] text-[10px] font-bold uppercase tracking-widest opacity-60">Teach it to the AI</p>
        </div>
        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
          <Mic size={20} />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-white/50 text-xs leading-relaxed">
          "If you can't explain it simply, you don't understand it well enough." Explain <span className="text-[#f9a84d] font-bold">{nodeName}</span> as if you were teaching a 10-year-old.
        </p>

        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Start teaching..."
          className="w-full h-32 bg-white/5 border border-[#43261a] rounded-xl p-4 text-sm text-[#f9e8d2] focus:outline-none focus:border-[#f9a84d]/50 transition-all resize-none"
        />

        {!feedback ? (
          <button 
            onClick={getFeedback}
            className="w-full py-4 bg-[#2d150d] border border-[#f9a84d]/30 text-[#f9a84d] rounded-xl font-black uppercase tracking-tighter text-xs hover:bg-[#f9a84d]/10 transition-all flex items-center justify-center gap-2"
          >
            Submit Explanation <Send size={14} />
          </button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 bg-[#f9a84d]/5 border border-[#f9a84d]/20 rounded-2xl relative"
          >
            <div className="absolute -top-3 left-4 bg-[#1a0b06] px-2 text-[10px] font-black text-[#f9a84d] uppercase tracking-widest flex items-center gap-1">
              <Star size={10} fill="currentColor" /> AI Tutor Feedback
            </div>
            <p className="text-[#f9e8d2] text-sm italic leading-relaxed">
              {feedback}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
