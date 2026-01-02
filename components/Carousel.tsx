'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, PanInfo, useMotionValue } from 'framer-motion';
import React, { JSX } from 'react';
import { FaCode, FaMobileAlt, FaRobot, FaCloud, FaDatabase, FaLaptopCode } from 'react-icons/fa';

export interface CarouselItem {
  title: string;
  description: string;
  id: number;
  icon: React.ReactNode;
}

export interface CarouselProps {
  items?: CarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
}

const DEFAULT_ITEMS: CarouselItem[] = [
  {
    title: 'Full Stack Development',
    description: 'Building scalable web applications with modern technologies.',
    id: 1,
    icon: <FaLaptopCode className="h-5 w-5 md:h-6 md:w-6 text-white" />
  },
  {
    title: 'Mobile Development',
    description: 'Creating cross-platform mobile experiences with React Native.',
    id: 2,
    icon: <FaMobileAlt className="h-5 w-5 md:h-6 md:w-6 text-white" />
  },
  {
    title: 'AI & Machine Learning',
    description: 'Developing intelligent solutions with Python and TensorFlow.',
    id: 3,
    icon: <FaRobot className="h-[16px] w-[16px] text-white" />
  },
  {
    title: 'Cloud Solutions',
    description: 'Designing scalable cloud architectures and SaaS platforms.',
    id: 4,
    icon: <FaCloud className="h-[16px] w-[16px] text-white" />
  },
  {
    title: 'Database Systems',
    description: 'Optimizing data storage and retrieval with MongoDB & PostgreSQL.',
    id: 5,
    icon: <FaDatabase className="h-[16px] w-[16px] text-white" />
  },
  {
    title: 'Modern Frameworks',
    description: 'Leveraging React, Next.js, and TypeScript for cutting-edge apps.',
    id: 6,
    icon: <FaCode className="h-5 w-5 md:h-6 md:w-6 text-white" />
  }
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30 };

interface CarouselItemProps {
  item: CarouselItem;
  index: number;
  itemWidth: number;
  round: boolean;
  trackItemOffset: number;
  x: any;
  transition: any;
}

function CarouselItem({ item, index, itemWidth, round }: CarouselItemProps) {
  return (
    <motion.div
      key={`${item?.id ?? index}-${index}`}
      className={`relative shrink-0 flex flex-col ${
        round
          ? 'items-center justify-center text-center bg-gradient-to-br from-[#3A29FF]/20 via-[#FF94B4]/10 to-[#FF3232]/20 border border-white/30 rounded-full backdrop-blur-sm'
          : 'items-start justify-between bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-[12px] backdrop-blur-sm'
      } overflow-hidden cursor-grab active:cursor-grabbing hover:border-[#3A29FF]/50 transition-all duration-300`}
      style={{
        width: itemWidth,
        height: round ? itemWidth : '100%',
        ...(round && { borderRadius: '50%' })
      }}
    >
      {round ? (
        <>
          <div className="flex items-center justify-center mb-4">
            <span className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-gradient-to-br from-[#3A29FF] to-[#FF94B4] shadow-lg shadow-[#3A29FF]/50">
              {item.icon}
            </span>
          </div>
          <div className="px-8 text-center">
            <div className="mb-2 font-black text-xl text-white">{item.title}</div>
            <p className="text-sm text-white/80 leading-relaxed">{item.description}</p>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 p-5">
            <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-gradient-to-br from-[#3A29FF] to-[#FF94B4] shadow-lg shadow-[#3A29FF]/50">
              {item.icon}
            </span>
          </div>
          <div className="p-5">
            <div className="mb-1 font-black text-lg text-white">{item.title}</div>
            <p className="text-sm text-white/80">{item.description}</p>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default function Carousel({
  items = DEFAULT_ITEMS,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false
}: CarouselProps): JSX.Element {
  const containerPadding = 16;
  const [effectiveBaseWidth, setEffectiveBaseWidth] = useState<number>(baseWidth);

  // Adapt carousel width to available container width so it remains responsive
  useEffect(() => {
    const update = () => {
      const containerW = containerRef.current?.clientWidth ?? baseWidth;
      // allow the carousel to shrink but keep a reasonable minimum width
      const capped = Math.min(baseWidth, Math.max(220, containerW));
      setEffectiveBaseWidth(capped);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [baseWidth]);

  const itemWidth = Math.max(120, effectiveBaseWidth - containerPadding * 2);
  const trackItemOffset = itemWidth + GAP;
  const itemsForRender = useMemo(() => {
    if (!loop) return items;
    if (items.length === 0) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const [position, setPosition] = useState<number>(loop ? 1 : 0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return undefined;
    if (pauseOnHover && isHovered) return undefined;

    const timer = setInterval(() => {
      setPosition(prev => Math.min(prev + 1, itemsForRender.length - 1));
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);

  useEffect(() => {
    const startingPosition = loop ? 1 : 0;
    setPosition(startingPosition);
    x.set(-startingPosition * trackItemOffset);
  }, [items.length, loop, trackItemOffset, x]);

  useEffect(() => {
    if (!loop && position > itemsForRender.length - 1) {
      setPosition(Math.max(0, itemsForRender.length - 1));
    }
  }, [itemsForRender.length, loop, position]);

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationStart = () => {
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }
    const lastCloneIndex = itemsForRender.length - 1;

    if (position === lastCloneIndex) {
      setIsJumping(true);
      const target = 1;
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setPosition(target);
        requestAnimationFrame(() => {
          setIsJumping(false);
          setIsAnimating(false);
        });
      });
      return;
    }

    if (position === 0) {
      setIsJumping(true);
      const target = items.length;
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setPosition(target);
        requestAnimationFrame(() => {
          setIsJumping(false);
          setIsAnimating(false);
        });
      });
      return;
    }

    setIsAnimating(false);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0;

    if (direction === 0) return;

    setPosition(prev => {
      const next = prev + direction;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
          right: 0
        }
      };

  const activeIndex =
    items.length === 0 ? 0 : loop ? (position - 1 + items.length) % items.length : Math.min(position, items.length - 1);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden p-4 w-full ${
        round ? 'rounded-full border border-white/30' : 'rounded-[24px] border border-white/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm'
      }`}
      style={{
        maxWidth: `${Math.max(0, effectiveBaseWidth)}px`,
        ...(round && { height: `${Math.max(0, effectiveBaseWidth)}px` })
      }}
    >
      <motion.div
        className="flex"
        drag={isAnimating ? false : 'x'}
        {...dragProps}
        style={{
          width: itemWidth,
          gap: `${GAP}px`,
          x
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((item, index) => (
          <CarouselItem
            key={`${item?.id ?? index}-${index}`}
            item={item}
            index={index}
            itemWidth={itemWidth}
            round={round}
            trackItemOffset={trackItemOffset}
            x={x}
            transition={effectiveTransition}
          />
        ))}
      </motion.div>
      <div className={`flex w-full justify-center ${round ? 'absolute z-20 bottom-12 left-1/2 -translate-x-1/2' : ''}`}>
        <div className={`${round ? 'mt-0' : 'mt-4'} flex w-[150px] justify-between px-8`}>
          {items.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${
                activeIndex === index
                  ? round
                    ? 'bg-white'
                    : 'bg-[#3A29FF]'
                  : round
                    ? 'bg-white/40'
                    : 'bg-white/20'
              }`}
              animate={{
                scale: activeIndex === index ? 1.2 : 1
              }}
              onClick={() => setPosition(loop ? index + 1 : index)}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
