import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationStore } from '@/store/useAnimationStore';

export function CartFlyAnimation() {
  const { isAnimating, startPos, imageUrl, resetAnimation } = useAnimationStore();
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (isAnimating) {
      const cartButton = document.getElementById('cart-button');
      if (cartButton) {
        const rect = cartButton.getBoundingClientRect();
        setTargetPos({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    }
  }, [isAnimating]);

  if (!isAnimating || !startPos || !targetPos || !imageUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ 
          position: 'fixed',
          top: startPos.y,
          left: startPos.x,
          width: 100,
          height: 100,
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: 0,
          scale: 0.5,
          rotate: 0,
        }}
        animate={{ 
          top: [startPos.y, startPos.y - 100, targetPos.y - 50],
          left: [startPos.x, startPos.x + 50, targetPos.x - 50],
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1.2, 0.2],
          rotate: [0, 45, 360],
        }}
        transition={{ 
          duration: 1, 
          ease: "easeInOut",
          times: [0, 0.2, 0.8, 1]
        }}
        onAnimationComplete={() => {
          resetAnimation();
        }}
      >
        <img 
          src={imageUrl} 
          alt="Flying Shoe" 
          className="h-full w-full object-contain drop-shadow-lg"
          referrerPolicy="no-referrer"
        />
      </motion.div>
    </AnimatePresence>
  );
}
