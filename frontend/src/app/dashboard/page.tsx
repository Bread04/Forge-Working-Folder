"use client";

import Sidebar from '@/components/layout/Sidebar';
import PomodoroTimer from '@/components/focus/PomodoroTimer';
import ChatSidebar from '@/components/chat/ChatSidebar';
import { Zap, Target, TrendingUp, Trophy } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#1a0b06] text-[#f9e8d2]">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-10 space-y-10">
        <header className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic mb-2">Command Center</h1>
            <p className="text-[#f9a84d] text-sm font-bold uppercase tracking-widest opacity-60">Ready to forge some focus, Alex?</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-[#2d150d] border border-[#43261a] rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#ffd700]/10 rounded-xl flex items-center justify-center text-[#ffd700]">
                <Target size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase">Daily Goal</p>
                <p className="text-white font-black">4h 12m</p>
              </div>
            </div>
            <div className="bg-[#2d150d] border border-[#43261a] rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase">Streak</p>
                <p className="text-white font-black">12 Days</p>
              </div>
            </div>
          </div>
        </header>

        {/* Focus Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="forge-card relative overflow-hidden h-[400px] flex items-center justify-center">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#2d150d] to-transparent opacity-50" />
              <div className="relative z-10 w-full max-w-md">
                <PomodoroTimer />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
               <div className="forge-card flex items-center gap-6">
                 <div className="w-16 h-16 bg-[#f9a84d]/10 rounded-2xl flex items-center justify-center text-[#f9a84d]">
                   <Zap size={32} />
                 </div>
                 <div>
                   <h3 className="text-white font-black uppercase tracking-tighter leading-none mb-1 text-xl">Skills Mastered</h3>
                   <p className="text-[#f9a84d] font-bold">12 Active Nodes</p>
                 </div>
               </div>
               <div className="forge-card flex items-center gap-6">
                 <div className="w-16 h-16 bg-[#ffd700]/10 rounded-2xl flex items-center justify-center text-[#ffd700]">
                   <Trophy size={32} />
                 </div>
                 <div>
                   <h3 className="text-white font-black uppercase tracking-tighter leading-none mb-1 text-xl">Weekly Rank</h3>
                   <p className="text-[#ffd700] font-bold">#2 This Week</p>
                 </div>
               </div>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="forge-card space-y-6">
              <h2 className="text-lg font-black uppercase tracking-tighter">Recent XP Gains</h2>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="w-10 h-10 bg-[#f9a84d]/20 rounded-lg flex items-center justify-center text-[#f9a84d]">
                      <Zap size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-bold truncate uppercase">Calculus Pulse</p>
                      <p className="text-white/30 text-[10px]">14 minutes ago</p>
                    </div>
                    <span className="text-emerald-400 font-black text-xs">+120 XP</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 border border-[#43261a] rounded-xl text-xs font-bold uppercase text-[#f9a84d] hover:bg-[#f9a84d]/5 transition-colors">
                View All History
              </button>
            </div>
          </aside>
        </div>
      </main>

      <ChatSidebar />
    </div>
  );
}
