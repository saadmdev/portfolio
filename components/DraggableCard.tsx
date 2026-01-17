"use client";

import { motion } from "framer-motion";
import { useRef, RefObject, ReactNode } from "react";

interface DraggableCardProps {
  style?: React.CSSProperties;
  text?: string;
  image?: string;
  icon?: ReactNode;
  containerRef: RefObject<HTMLDivElement | null>;
}

const DraggableCard = ({ style, text, image, icon, containerRef }: DraggableCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Icon inside fully round ball
  if (icon) {
    return (
      <motion.div
        ref={cardRef}
        className="absolute z-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full ring-1 ring-white/20 bg-gradient-to-br from-[#3A29FF] to-[#7a57db] cursor-grab shadow-lg shadow-[#3A29FF]/40"
        style={style}
        whileHover={{ scale: 1.1 }}
        drag
        dragConstraints={containerRef}
        dragElastic={0.5}
      >
        <div className="text-2xl md:text-3xl">
          {icon}
        </div>
      </motion.div>
    );
  }

  if (image && !text) {
    return (
      <motion.div
        className="absolute z-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full ring-1 ring-white/20 bg-gradient-to-br from-[#3A29FF] to-[#7a57db] cursor-grab shadow-lg shadow-[#3A29FF]/40"
        style={style}
        whileHover={{ scale: 1.1 }}
        drag
        dragConstraints={containerRef}
        dragElastic={0.5}
      >
        <img src={image} alt="" className="w-7 h-7 md:w-8 md:h-8 object-contain" />
      </motion.div>
    );
  }
  
  return (
    <motion.div
      ref={cardRef}
      className="absolute z-10 px-5 py-2.5 text-base md:text-lg text-center rounded-full ring-1 ring-white/10 font-semibold bg-gradient-to-br from-[#1a1a2e] to-[#16213e] backdrop-blur-sm cursor-grab shadow-lg shadow-black/30"
      style={style}
      whileHover={{ scale: 1.05 }}
      drag
      dragConstraints={containerRef}
      dragElastic={0.5}
    >
      <span className="text-white/90">{text}</span>
    </motion.div>
  );
};

export default DraggableCard;
