"use client";

import { useState, useEffect } from 'react';
import { Target, Bug, User, Swords, ShieldQuestion, Check, X, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTreeStore } from '@/store/useTreeStore';

type QuizType = 'truths' | 'debug' | 'roleplay' | 'boss';

interface ReviseContentProps {
  nodeName: string;
  nodeId?: string;
  context: {
    parents: string[];
    children: string[];
    siblings: string[];
  };
}

export default function ReviseContent({ nodeName, nodeId, context }: ReviseContentProps) {
  const [activeQuiz, setActiveQuiz] = useState<QuizType | null>(null);
  const adjustMastery = useTreeStore((state) => state.adjustMastery);

  useEffect(() => {
    if (nodeId) adjustMastery(nodeId, 2);
  }, [nodeId, adjustMastery]);

  return (
    <div className="forge-card min-h-[500px] flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-black uppercase tracking-tighter italic">Revise & Conquer</h2>
        <p className="text-[#f9a84d] text-[10px] font-bold uppercase tracking-widest opacity-60">Master the concept through active challenge</p>
      </div>

      {!activeQuiz ? (
        <div className="grid grid-cols-2 gap-4 flex-1">
          <QuizOption 
            icon={<ShieldQuestion size={24} />} 
            title="Two Truths & A Lie" 
            desc="Spot the hallucination" 
            onClick={() => setActiveQuiz('truths')} 
          />
          <QuizOption 
            icon={<Bug size={24} />} 
            title="Debug Disaster" 
            desc="Find the logic flaw" 
            onClick={() => setActiveQuiz('debug')} 
          />
          <QuizOption 
            icon={<User size={24} />} 
            title="Roleplay Sim" 
            desc="Applied scenario" 
            onClick={() => setActiveQuiz('roleplay')} 
          />
          <QuizOption 
            icon={<Swords size={24} />} 
            title="Boss Battle" 
            desc="Timed mastery sprint" 
            onClick={() => setActiveQuiz('boss')} 
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <button 
            onClick={() => setActiveQuiz(null)}
            className="text-[10px] uppercase font-black tracking-widest text-[#f9a84d]/60 mb-4 hover:text-[#f9a84d]"
          >
            ← Back to challenges
          </button>
          
          <QuizView type={activeQuiz} nodeName={nodeName} />
        </div>
      )}

      {/* Relational Context Teaser */}
      {!activeQuiz && (
        <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/5">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Relational Context</h4>
          <div className="flex flex-wrap gap-2">
            {context.parents.map(p => <span key={p} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] rounded border border-blue-500/20">Parent: {p}</span>)}
            {context.siblings.map(s => <span key={s} className="px-2 py-1 bg-purple-500/10 text-purple-400 text-[10px] rounded border border-purple-500/20">Sibling: {s}</span>)}
            {context.children.map(c => <span key={c} className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] rounded border border-green-500/20">Child: {c}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

function QuizOption({ icon, title, desc, onClick }: { icon: any, title: string, desc: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="p-6 bg-[#2d150d] border border-[#f9a84d]/10 rounded-2xl flex flex-col items-center justify-center text-center gap-3 group hover:border-[#f9a84d]/40 transition-all hover:bg-[#f9a84d]/5"
    >
      <div className="p-3 bg-white/5 rounded-xl text-[#f9a84d] group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <h3 className="text-sm font-black text-[#f9e8d2] uppercase tracking-tighter">{title}</h3>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{desc}</p>
      </div>
    </button>
  );
}

function QuizView({ type, nodeName }: { type: QuizType, nodeName: string }) {
  const [answered, setAnswered] = useState<number | null>(null);

  if (type === 'truths') {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <p className="text-sm text-[#f9e8d2] italic">"The agent has prepared three statements about {nodeName}. One is a hallucination. Can you find it?"</p>
        </div>
        <div className="space-y-3">
          {[
            "1. It increases efficiency by reducing overhead.",
            "2. It was originally developed as a proprietary tool by Microsoft in 2021.",
            "3. It uses a decentralized consensus mechanism."
          ].map((text, i) => (
            <button 
              key={i}
              onClick={() => setAnswered(i)}
              className={`w-full p-4 rounded-xl border transition-all text-left text-xs ${
                answered === i 
                  ? (i === 1 ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400')
                  : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'
              }`}
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'debug') {
    return (
      <div className="space-y-6">
        <p className="text-xs text-white/50">Identify the logic flaw in this {nodeName} snippet:</p>
        <pre className="p-4 bg-black/40 rounded-xl text-[10px] text-[#f9e8d2] font-mono border border-white/5 overflow-x-auto">
          {`function calculateImpact(data) {\n  const factor = 0;\n  return data.value / factor;\n}`}
        </pre>
        <div className="grid grid-cols-2 gap-4">
          <button className="p-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase hover:bg-white/10">Dividing by Zero</button>
          <button className="p-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase hover:bg-white/10">Type Mismatch</button>
        </div>
      </div>
    );
  }

  // Fallback / Placeholder for others
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 grayscale">
      <Timer size={48} className="mb-4 text-[#f9a84d]" />
      <h3 className="text-xl font-black uppercase tracking-tighter">{type} Challenge</h3>
      <p className="text-xs font-bold uppercase tracking-widest mt-2 px-10">Simulation active soon. Mastering {nodeName} requires further anchoring.</p>
    </div>
  );
}
