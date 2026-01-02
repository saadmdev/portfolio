'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RotatingTextProps {
  texts: string[];
  delay?: number;
  className?: string;
}

export default function RotatingText({ texts, delay = 3000, className = '' }: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (texts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, delay);

    return () => clearInterval(interval);
  }, [texts.length, delay]);

  return (
    <div className={`relative ${className}`} style={{ minHeight: '3rem' }}>
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/80 font-light leading-relaxed"
        >
          {texts[currentIndex]}
          <span className="text-[#3A29FF] ml-2">•</span>
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

