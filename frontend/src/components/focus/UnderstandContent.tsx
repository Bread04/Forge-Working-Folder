"use client";

import { useState } from 'react';
import { Lightbulb, Rocket, HelpCircle, User, BookOpen, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ExpansionType = 'eli5' | 'real_world' | 'socratic';

interface UnderstandContentProps {
  nodeName: string;
}

export default function UnderstandContent({ nodeName }: UnderstandContentProps) {
  const [activeFramework, setActiveFramework] = useState<ExpansionType | null>(null);

  return (
    <div className="forge-card min-h-[500px] flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-black uppercase tracking-tighter italic">Understand Deeply</h2>
        <p className="text-[#f9a84d] text-[10px] font-bold uppercase tracking-widest opacity-60">Expand your neural connections</p>
      </div>

      {!activeFramework ? (
        <div className="space-y-4 flex-1">
          <FrameworkOption 
            icon={<User size={20} />} 
            title="Explain Like I'm..." 
            desc="Senior Dev, Historical Figure, or 5-year-old" 
            onClick={() => setActiveFramework('eli5')} 
          />
          <FrameworkOption 
            icon={<Rocket size={20} />} 
            title="Real-World Application" 
            desc="Theory meet Practice" 
            onClick={() => setActiveFramework('real_world')} 
          />
          <FrameworkOption 
            icon={<HelpCircle size={20} />} 
            title="Socratic Method" 
            desc="Self-discovery through inquiry" 
            onClick={() => setActiveFramework('socratic')} 
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <button 
            onClick={() => setActiveFramework(null)}
            className="text-[10px] uppercase font-black tracking-widest text-[#f9a84d]/60 mb-6 hover:text-[#f9a84d] flex items-center gap-1"
          >
            ← Back to frameworks
          </button>
          
          <ExpansionView type={activeFramework} nodeName={nodeName} />
        </div>
      )}

      {/* Insight Footer */}
      {!activeFramework && (
        <div className="mt-8 p-4 bg-[#f9a84d]/5 border border-[#f9a84d]/10 rounded-xl flex items-start gap-3">
          <Lightbulb className="text-[#f9a84d] shrink-0" size={18} />
          <p className="text-[10px] text-[#f9e8d2]/70 leading-relaxed font-medium italic">
            "Knowledge is not just about facts, but about the connections you make between them."
          </p>
        </div>
      )}
    </div>
  );
}

function FrameworkOption({ icon, title, desc, onClick }: { icon: any, title: string, desc: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full p-5 bg-[#2d150d] border border-[#f9a84d]/10 rounded-2xl flex items-center gap-4 group hover:border-[#f9a84d]/40 transition-all hover:bg-[#f9a84d]/5 text-left"
    >
      <div className="p-3 bg-white/5 rounded-xl text-[#f9a84d] group-hover:scale-110 transition-transform">{icon}</div>
      <div className="flex-1">
        <h3 className="text-sm font-black text-[#f9e8d2] uppercase tracking-tighter">{title}</h3>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-tight">{desc}</p>
      </div>
      <ChevronRight className="text-white/20 group-hover:text-[#f9a84d] transition-colors" size={16} />
    </button>
  );
}

function ExpansionView({ type, nodeName }: { type: ExpansionType, nodeName: string }) {
  const [persona, setPersona] = useState<'senior' | 'historic' | 'child'>('senior');

  if (type === 'eli5') {
    return (
      <div className="space-y-6">
        <div className="flex gap-2 p-1 bg-black/20 rounded-lg border border-white/5">
          {(['senior', 'historic', 'child'] as const).map(p => (
            <button 
              key={p}
              onClick={() => setPersona(p)}
              className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all ${persona === p ? 'bg-[#f9a84d] text-[#1a0b06]' : 'text-white/40 hover:text-white'}`}
            >
              {p === 'senior' ? 'Senior Dev' : p === 'historic' ? 'Aristotle' : '5 Year Old'}
            </button>
          ))}
        </div>

        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl relative">
          <BookOpen className="absolute -top-3 -right-3 text-[#f9a84d]/20" size={48} />
          <p className="text-sm text-[#f9e8d2] leading-relaxed italic">
            {persona === 'senior' && `Look, ${nodeName} is basically an abstraction layer. If you ignore the boilerplate, it's just a way to handle state mutations without race conditions. In a high-concurrency environment, you'd use this to ensure sequential processing...`}
            {persona === 'historic' && `My student, consider ${nodeName} as the 'First Principle' of this system. Just as the stars follow eternal laws, this concept governs the flow of information. It is the telos—the ultimate purpose—of your data...`}
            {persona === 'child' && `Imagine you have a big box of Lego bricks. ${nodeName} is like the special instruction book that tells you exactly where to put each piece so your castle doesn't fall down! It keeps everything safe and tidy...`}
          </p>
        </div>
      </div>
    );
  }

  if (type === 'real_world') {
    return (
      <div className="space-y-6">
        <div className="p-5 bg-green-500/10 border border-green-500/20 rounded-2xl">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-green-400 mb-2 truncate">Project Implementation</h4>
          <p className="text-sm text-[#f9e8d2] leading-relaxed">
            In a **FinTech app**, {nodeName} would be used to validate transaction logs before archiving. This prevents data corruption during peak traffic spikes.
          </p>
        </div>
        <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2 truncate">Social Media Logic</h4>
          <p className="text-sm text-[#f9e8d2] leading-relaxed">
            When you **Double-tap** a photo, {nodeName} ensures your 'Like' count is updated instantly on your screen while syncing with the server in the background.
          </p>
        </div>
      </div>
    );
  }

  if (type === 'socratic') {
    return (
      <div className="space-y-6">
        <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-2xl relative">
          <HelpCircle className="absolute -top-3 -right-3 text-purple-400/20" size={48} />
          <p className="text-sm text-[#f9e8d2] italic mb-4">"If we remove the current dependency, what happens to the stability of {nodeName}?"</p>
          <p className="text-xs text-white/40 leading-relaxed font-bold uppercase tracking-widest">
            Think about the ripple effect. If X changes, does Y still hold true?
          </p>
        </div>
        <input 
          type="text" 
          placeholder="Reflect and answer..." 
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-[#f9e8d2] focus:outline-none focus:border-[#f9a84d]/50 transition-all"
        />
      </div>
    );
  }

  return null;
}
