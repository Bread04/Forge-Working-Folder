import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, X, Zap, ArrowRight, Brain } from 'lucide-react';

interface SparringChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeName: string;
}

const HARDCODED_CHALLENGES: Record<string, string> = {
  "Computer Science": "How does the abstract representation of data in binary enable the entire hierarchy of modern computing architectures to remain hardware-independent?",
  "Calculus": "Articulate the bridge between the instantaneous rate of change (derivative) and the accumulation of area (integral). How do they mirror each other?",
  "Linear Algebra": "Explain how a vector space can be used to represent linguistic meaning in large language models via high-dimensional geometry.",
  "Default": "How does the fundamental principle of {node} bridge the gap between theoretical understanding and its most complex practical application?"
};

const SparringChallengeModal: React.FC<SparringChallengeModalProps> = ({ isOpen, onClose, nodeName }) => {
  const [answer, setAnswer] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const question = (HARDCODED_CHALLENGES[nodeName] || HARDCODED_CHALLENGES["Default"]).replace("{node}", nodeName);

  const handleSubmit = () => {
    setIsValidating(true);
    // Hardcoded "desirable difficulty" validation logic
    setTimeout(() => {
      if (answer.length < 50) {
        setFeedback("The 'mental weight' is too light. Your articulation lacks the depth required for mastery. Try to connect the bridge with more detail (min 50 chars).");
        setIsValidating(false);
      } else {
        setFeedback(null);
        setIsValidating(false);
        // In a real app, this would unlock the node in the store
        onClose();
      }
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            className="w-full max-w-2xl bg-[#1a0b06] border-2 border-red-500/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(239,68,68,0.2)] relative"
          >
            <div className="h-2 bg-gradient-to-r from-red-600 via-[#f9a84d] to-red-600 animate-pulse" />
            
            <div className="p-10">
              <button 
                onClick={onClose} 
                className="absolute top-8 right-10 text-white/20 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                  <Swords size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">AI Sparring Partner</h2>
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1">Applying Desirable Difficulty</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="p-8 bg-white/5 border border-white/10 rounded-3xl relative group">
                  <div className="absolute -top-3 left-6 px-3 bg-[#1a0b06] border border-white/10 rounded-full text-[10px] font-black text-red-500 uppercase tracking-widest">
                    Synthesis Challenge
                  </div>
                  <p className="text-xl font-light text-[#f9e8d2] leading-relaxed italic">
                    "{question}"
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end px-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Articulate the Bridge</label>
                    <span className={`text-[10px] font-bold ${answer.length < 50 ? 'text-white/20' : 'text-green-500'}`}>
                      {answer.length} / 50 characters min
                    </span>
                  </div>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Describe the deep connection..."
                    className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/10 focus:outline-none focus:border-red-500/50 transition-all resize-none text-lg font-light leading-relaxed"
                  />
                  
                  {feedback && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium leading-relaxed"
                    >
                      {feedback}
                    </motion.div>
                  )}
                </div>

                <button 
                  onClick={handleSubmit}
                  disabled={isValidating || answer.length === 0}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all group ${
                    isValidating || answer.length === 0 
                      ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                      : 'bg-red-500 hover:bg-red-600 text-white shadow-[0_10px_30px_rgba(239,68,68,0.3)]'
                  }`}
                >
                  {isValidating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing Neural Load...
                    </>
                  ) : (
                    <>
                      Submit Synthesis
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-red-500/5 border-t border-red-500/10 p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <Brain size={20} />
              </div>
              <p className="text-[10px] text-white/40 font-bold leading-tight uppercase tracking-widest">
                The Spotter is watching. Shallow intuition yields zero growth. Push your mental limits.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SparringChallengeModal;
