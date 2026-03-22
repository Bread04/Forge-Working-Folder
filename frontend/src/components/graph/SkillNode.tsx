"use client";

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Zap } from 'lucide-react';

export default memo(({ data, selected }: NodeProps) => {
  const mastery = data.mastery_score || 0;
  const isMastered = mastery === 100;

  return (
    <div className={`relative flex flex-col items-center group transition-all duration-500 ${selected ? 'scale-110' : ''}`}>
      {/* Glow Effect */}
      <div 
        className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-1000 ${
          isMastered ? 'bg-[#ffd700] opacity-40 animate-pulse' : 'bg-[#f9a84d] opacity-10'
        }`}
      />

      {/* Main Node Circle */}
      <div className={`
        relative w-20 h-20 rounded-full flex items-center justify-center
        border-4 transition-all duration-500
        ${isMastered ? 'border-[#ffd700] bg-[#2d150d] shadow-[0_0_20px_rgba(255,215,0,0.4)]' : 'border-[#43261a] bg-[#1a0b06]'}
        ${selected ? 'border-[#f9a84d] ring-4 ring-[#f9a84d]/20' : ''}
      `}>
        <Zap className={`${isMastered ? 'text-[#ffd700]' : 'text-[#f9a84d] opacity-50'}`} fill={isMastered ? "currentColor" : "none"} />
        
        {/* Mastery Ring (SVG Overlay) */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="rgba(249, 168, 77, 0.1)"
            strokeWidth="4"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={isMastered ? "#ffd700" : "#f9a84d"}
            strokeWidth="4"
            strokeDasharray={`${(mastery / 100) * 226} 226`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Mastered Badge */}
        {isMastered && (
          <div className="absolute -top-1 -right-1 bg-[#ffd700] text-[#1a0b06] text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter shadow-lg">
            Mastered
          </div>
        )}
      </div>

      {/* Label */}
      <div className="mt-3 text-center">
        <p className="text-[#f9e8d2] font-black text-xs uppercase tracking-tighter leading-none mb-1">
          {data.label}
        </p>
        <p className={`text-[10px] font-bold ${isMastered ? 'text-[#ffd700]' : 'text-white/30'}`}>
          LVL {Math.floor(mastery / 10) || 1}
        </p>
      </div>

      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
});
