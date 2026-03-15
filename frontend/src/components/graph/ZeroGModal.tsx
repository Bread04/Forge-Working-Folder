"use client";

import { useState } from 'react';
import { X, Brain, Zap, ArrowRight, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SwipeQuiz {
  statement: string;
  is_true: boolean;
}

interface ZeroGModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeName: string;
  content: {
    analogy_expansion: string;
    tether_action: string;
    swipe_quiz: SwipeQuiz[];
  };
}

export default function ZeroGModal({ isOpen, onClose, nodeName, content }: ZeroGModalProps) {
  const [view, setView] = useState<'overview' | 'quiz'>('overview');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleQuizAnswer = (answer: boolean) => {
    if (answer === content.swipe_quiz[currentQuizIndex].is_true) {
      setQuizScore(prev => prev + 1);
    }

    if (currentQuizIndex < 3) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

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

              {view === 'overview' ? (
                <div className="space-y-8">
                  {/* Analogy */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#f9a84d] text-xs font-black uppercase italic">
                      <Zap size={14} fill="currentColor" /> Analogy Expansion
                    </div>
                    <p className="text-[#f9e8d2] text-lg font-light leading-relaxed italic">
                      "{content.analogy_expansion}"
                    </p>
                  </div>

                  {/* Tether Action */}
                  <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase mb-2">
                       Tether Action (Practical Use)
                    </div>
                    <p className="text-white/80 text-sm font-medium">
                      {content.tether_action}
                    </p>
                  </div>

                  <button 
                    onClick={() => setView('quiz')}
                    className="w-full py-5 bg-[#f9a84d] hover:bg-[#ffbd71] text-[#1a0b06] rounded-2xl font-black uppercase tracking-tighter flex items-center justify-center gap-2 transition-all group"
                  >
                    Initiate Swipe Quiz <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="min-h-[300px] flex flex-col">
                  {!showResult ? (
                    <>
                      <div className="mb-8">
                        <div className="flex justify-between text-[10px] font-bold text-white/30 uppercase mb-2">
                          <span>Pulse Tracking</span>
                          <span>{currentQuizIndex + 1} / 4</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#f9a84d]" style={{ width: `${((currentQuizIndex + 1) / 4) * 100}%` }} />
                        </div>
                      </div>

                      <div className="flex-1 flex items-center justify-center py-8">
                        <p className="text-2xl font-bold text-white text-center leading-tight">
                          {content.swipe_quiz[currentQuizIndex].statement}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-8">
                        <button 
                          onClick={() => handleQuizAnswer(false)}
                          className="py-6 bg-white/5 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/30 text-white rounded-2xl font-bold uppercase tracking-widest transition-all"
                        >
                          False
                        </button>
                        <button 
                          onClick={() => handleQuizAnswer(true)}
                          className="py-6 bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 text-white rounded-2xl font-bold uppercase tracking-widest transition-all"
                        >
                          True
                        </button>
                      </div>
                    </>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex-1 flex flex-col items-center justify-center text-center py-8"
                    >
                      <div className="w-24 h-24 bg-[#ffd700] rounded-full flex items-center justify-center text-[#1a0b06] mb-6 shadow-[0_0_40px_rgba(255,215,0,0.3)]">
                        <Check size={48} strokeWidth={4} />
                      </div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-2">Mastery Synced</h3>
                      <p className="text-white/40 mb-8">You achieved {quizScore}/4 on the neural pulse.</p>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => {
                            setView('overview');
                            setShowResult(false);
                            setCurrentQuizIndex(0);
                            setQuizScore(0);
                          }}
                          className="px-8 py-4 border border-[#43261a] text-white/60 rounded-xl font-bold uppercase text-[10px] hover:bg-white/5"
                        >
                          Retry Quiz
                        </button>
                        <button 
                          onClick={onClose}
                          className="px-8 py-4 bg-[#f9a84d] text-[#1a0b06] rounded-xl font-black uppercase text-[10px] hover:bg-[#ffbd71]"
                        >
                          Return to Tree
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
