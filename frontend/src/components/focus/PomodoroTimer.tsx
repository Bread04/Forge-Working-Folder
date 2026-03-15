"use client";

import { useFocusStore } from '@/store/useFocusStore';
import { Play, Square, RotateCcw } from 'lucide-react';

export default function PomodoroTimer() {
  const { timerSeconds, isRunning, startTimer, stopTimer, resetTimer } = useFocusStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl shadow-2xl border border-white/10">
      <h2 className="text-white/60 text-sm font-medium mb-2 uppercase tracking-widest">Focus Session</h2>
      <div className="text-6xl font-black text-white mb-8 font-mono">
        {formatTime(timerSeconds)}
      </div>
      <div className="flex gap-4">
        {!isRunning ? (
          <button 
            onClick={startTimer}
            className="p-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full transition-all shadow-lg shadow-emerald-500/20"
          >
            <Play fill="white" />
          </button>
        ) : (
          <button 
            onClick={stopTimer}
            className="p-4 bg-rose-500 hover:bg-rose-400 text-white rounded-full transition-all shadow-lg shadow-rose-500/20"
          >
            <Square fill="white" />
          </button>
        )}
        <button 
          onClick={resetTimer}
          className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
        >
          <RotateCcw />
        </button>
      </div>
    </div>
  );
}
