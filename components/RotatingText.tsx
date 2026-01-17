'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Check if device is mobile/low-power
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth < 768;
};

interface RotatingTextProps {
  texts: string[];
  delay?: number;
  className?: string;
}

export default function RotatingText({ texts, delay = 3000, className = '' }: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  useEffect(() => {
    if (texts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, delay);

    return () => clearInterval(interval);
  }, [texts.length, delay]);

  // Simplified animation for mobile
  const mobileVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const desktopVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="relative" style={{ minHeight: '1.2em' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          variants={isMobile ? mobileVariants : desktopVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: isMobile ? 0.3 : 0.5, ease: 'easeInOut' }}
          className={className || "text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/80 font-light leading-relaxed"}
        >
          {texts[currentIndex]}
          <span className="text-[#FF3232] ml-2">•</span>
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

