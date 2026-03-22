"use client";

import { useState } from 'react';
import { X, Brain, Zap, ArrowRight, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTreeStore } from '@/store/useTreeStore';

interface ZeroGModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeName: string;
  nodeId?: string;
  content: string;
}

export default function ZeroGModal({ isOpen, onClose, nodeName, nodeId, content }: ZeroGModalProps) {
  const adjustMastery = useTreeStore((state) => state.adjustMastery);
  const isBeginnerMind = useTreeStore((state) => state.isBeginnerMind);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-xl bg-[#1a0b06] border border-[#43261a] rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative"
          >
            {/* Header / Mastery Indicator */}
            <div className="h-1 bg-gradient-to-r from-[#f9a84d] to-[#ffd700]" />
            
            <div className="p-8">
              <button 
                onClick={onClose} 
                className="absolute top-6 right-8 text-white/20 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-[#2d150d] border border-[#43261a] rounded-2xl flex items-center justify-center text-[#f9a84d]">
                  <Brain size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">{nodeName}</h2>
                  <p className="text-[#f9a84d] text-[10px] font-bold uppercase tracking-widest mt-1">Zero-G Conceptual Node</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Analogy */}
                <div className={`p-6 rounded-2xl transition-all duration-500 ${isBeginnerMind ? 'bg-[#f9a84d]/10 border-2 border-[#f9a84d] shadow-[0_0_30px_rgba(249,168,77,0.2)]' : 'bg-white/5 border border-white/10'}`}>
                  <div className="flex items-center gap-2 text-[#f9a84d] text-xs font-black uppercase italic mb-3">
                    <Zap size={14} fill="currentColor" /> Neural Analogy
                  </div>
                  <p className="text-[#f9e8d2] text-xl font-light italic leading-relaxed">
                    "{content}"
                  </p>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-4">
                  <p className="text-white/60 text-sm italic">
                    For deeper challenges, quizzes, and practice, click the node and open the <strong>Revise</strong> or <strong>Sparring Mode</strong> panel.
                  </p>
                  <button 
                    onClick={onClose}
                    className="w-full py-5 bg-[#f9a84d] hover:bg-[#ffbd71] text-[#1a0b06] rounded-2xl font-black uppercase tracking-tighter transition-all"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
