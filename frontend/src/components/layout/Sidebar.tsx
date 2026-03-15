"use client";

import { Home, Zap, Award, ShoppingCart, History as HistoryIcon, BarChart3, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: Zap, label: 'Skill Trees', href: '/tree' },
  { icon: Award, label: 'Achievements', href: '#' },
  { icon: ShoppingCart, label: 'Store', href: '#' },
  { icon: HistoryIcon, label: 'History', href: '#' },
  { icon: BarChart3, label: 'Leaderboard', href: '#' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-full bg-[#1a0b06] border-r border-[#43261a] flex flex-col p-6 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#f9a84d] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(249,168,77,0.3)]">
          <Zap className="text-[#1a0b06]" fill="currentColor" />
        </div>
        <span className="text-xl font-black text-white tracking-tighter italic">FocusForge</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link 
            key={item.label}
            href={item.href}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
              pathname === item.href 
                ? 'bg-[#2d150d] text-[#f9a84d] border border-[#43261a]' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="pt-8 border-t border-[#43261a] space-y-6">
        <button className="flex items-center gap-4 px-4 text-white/40 hover:text-white transition-colors w-full">
          <Settings size={20} />
          <span className="font-medium text-sm">Settings</span>
        </button>
        
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-indigo-500 rounded-full border-2 border-[#43261a]"></div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold truncate">Alex Forge</p>
            <p className="text-white/30 text-[10px]">Master Architect</p>
          </div>
        </div>
      </div>
    </div>
  );
}
