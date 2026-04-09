import { create } from 'zustand';

interface AnimationState {
  isAnimating: boolean;
  startPos: { x: number; y: number } | null;
  imageUrl: string | null;
  triggerCartAnimation: (pos: { x: number; y: number }, imageUrl: string) => void;
  resetAnimation: () => void;
}

export const useAnimationStore = create<AnimationState>((set) => ({
  isAnimating: false,
  startPos: null,
  imageUrl: null,
  triggerCartAnimation: (pos, imageUrl) => {
    set({ isAnimating: true, startPos: pos, imageUrl });
  },
  resetAnimation: () => set({ isAnimating: false, startPos: null, imageUrl: null }),
}));
