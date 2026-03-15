import { create } from 'zustand';

interface FocusState {
  timerSeconds: number;
  isRunning: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  syncWithExtension: (seconds: number, running: boolean) => void;
}

export const useFocusStore = create<FocusState>((set) => ({
  timerSeconds: 0,
  isRunning: false,
  startTimer: () => set({ isRunning: true }),
  stopTimer: () => set({ isRunning: false }),
  resetTimer: () => set({ timerSeconds: 0, isRunning: false }),
  syncWithExtension: (seconds, running) => set({ timerSeconds: seconds, isRunning: running }),
}));
