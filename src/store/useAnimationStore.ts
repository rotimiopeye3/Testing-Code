import { create } from 'zustand';

interface AnimationState {
  isAnimating: boolean;
  startPos: { x: number; y: number } | null;
  imageUrl: string | null;
  particlesEnabled: boolean;
  triggerCartAnimation: (pos: { x: number; y: number }, imageUrl: string) => void;
  resetAnimation: () => void;
  toggleParticles: () => void;
}

export const useAnimationStore = create<AnimationState>((set) => ({
  isAnimating: false,
  startPos: null,
  imageUrl: null,
  particlesEnabled: true,
  triggerCartAnimation: (pos, imageUrl) => {
    set({ isAnimating: true, startPos: pos, imageUrl });
  },
  resetAnimation: () => set({ isAnimating: false, startPos: null, imageUrl: null }),
  toggleParticles: () => set((state) => ({ particlesEnabled: !state.particlesEnabled })),
}));
