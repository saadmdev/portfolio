'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { GoArrowUpRight } from 'react-icons/go';

type CardNavLink = {
  label: string;
  href?: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logo: string;
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  className = '',
  ease = 'power3.out',
  baseColor = '#fff',
  menuColor,
  buttonBgColor,
  buttonTextColor
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement;
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';
        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease
    });

    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1');

    return tl;
  };

  useLayoutEffect(() => {
    const wasExpanded = isExpanded;
    const tl = createTimeline();
    tlRef.current = tl;

    // If menu was expanded, restore the expanded state
    if (wasExpanded && tl) {
      tl.progress(1);
      setIsHamburgerOpen(true);
    }

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded]);

  const closeMenu = React.useCallback(() => {
    if (!isExpanded) return;
    const tl = tlRef.current;
    if (!tl) return;
    
    setIsHamburgerOpen(false);
    tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
    tl.reverse();
  }, [isExpanded]);

  const toggleMenu = React.useCallback(() => {
    const tl = tlRef.current;
    if (!tl) return;

    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      closeMenu();
    }
  }, [isExpanded, closeMenu]);

  const handleLinkClick = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>, href?: string) => {
    if (!href) return;
    
    // Handle internal hash links with smooth scroll
    if (href.startsWith('#')) {
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Use Lenis for smooth scrolling if available
        const lenis = (window as any).lenis;
        if (lenis) {
          lenis.scrollTo(targetElement, {
            offset: -80, // Offset for navbar height
            duration: 1.5,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        } else {
          // Fallback to native smooth scroll
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
      
      // Close menu after a delay
      setTimeout(() => {
        if (isExpanded) {
          closeMenu();
        }
      }, 400);
    }
    // For external links (mailto, http, https), don't prevent default
    // User can manually close the menu
  }, [isExpanded, closeMenu]);

  // Handle click outside to close menu
  useLayoutEffect(() => {
    if (!isExpanded) return;

    let isOpening = true;
    // Set a flag to prevent immediate closure
    const openingTimeout = setTimeout(() => {
      isOpening = false;
    }, 300);

    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if we just opened the menu
      if (isOpening) return;
      
      const target = event.target as HTMLElement;
      const navElement = navRef.current;
      
      // Don't close if clicking inside the nav
      if (navElement && !navElement.contains(target)) {
        // Only close if clicking outside the nav
        closeMenu();
      }
    };

    // Add a delay to prevent immediate closure when menu opens
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(openingTimeout);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, closeMenu]);

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div
      className={`card-nav-container absolute left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] z-[99] top-[1.2em] md:top-[2em] ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? 'open' : ''} block h-[60px] p-0 rounded-2xl shadow-2xl backdrop-blur-xl bg-white/10 border border-white/30 relative overflow-hidden will-change-[height] transition-all duration-300`}
        style={{ backgroundColor: baseColor }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 h-[60px] flex items-center justify-between p-2 pl-[1.1rem] z-[2]">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''} group h-full flex flex-col items-center justify-center cursor-pointer gap-[6px] order-2 md:order-none`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            tabIndex={0}
            style={{ color: menuColor || '#fff' }}
          >
            <div
              className={`hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                isHamburgerOpen ? 'translate-y-[4px] rotate-45' : ''
              } group-hover:opacity-75`}
            />
            <div
              className={`hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                isHamburgerOpen ? '-translate-y-[4px] -rotate-45' : ''
              } group-hover:opacity-75`}
            />
          </div>

          <div className="logo-container flex items-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 order-1 md:order-none">
            <img src={logo} alt={logoAlt} className="logo h-[28px]" />
          </div>

          <a
            href="#contact"
            className="card-nav-cta-button hidden md:inline-flex border-0 rounded-lg px-6 py-2 items-center font-medium cursor-pointer transition-all duration-300 hover:opacity-90 hover:scale-105 shadow-lg no-underline"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            onClick={(e) => {
              e.preventDefault();
              const targetElement = document.getElementById('contact');
              if (targetElement) {
                const lenis = (window as any).lenis;
                if (lenis) {
                  lenis.scrollTo(targetElement, {
                    offset: -80,
                    duration: 1.5,
                    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                  });
                } else {
                  targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }
              }
            }}
          >
            Contact Me
          </a>
        </div>

        <div
          className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-2 flex flex-col items-stretch gap-2 justify-start z-[1] ${
            isExpanded ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
          } md:flex-row md:items-end md:gap-[12px]`}
          aria-hidden={!isExpanded}
          onClick={(e) => {
            // Prevent clicks inside the nav content from closing the menu
            e.stopPropagation();
          }}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card select-none relative flex flex-col gap-2 p-[16px_20px] rounded-xl min-w-0 flex-[1_1_auto] h-auto min-h-[80px] md:h-full md:min-h-0 md:flex-[1_1_0%] transition-all duration-300 hover:scale-[1.03] hover:shadow-xl backdrop-blur-sm border border-white/10"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
              onClick={(e) => {
                // Prevent card clicks from closing the menu
                e.stopPropagation();
              }}
            >
              <div className="nav-card-label font-bold tracking-[-0.5px] text-[18px] md:text-[22px] mb-2">
                {item.label}
              </div>
              <div className="nav-card-links mt-auto flex flex-col gap-[6px]">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link inline-flex items-center gap-[8px] no-underline cursor-pointer transition-all duration-300 hover:opacity-80 hover:translate-x-1 text-[14px] md:text-[15px] font-medium"
                    href={lnk.href || '#'}
                    aria-label={lnk.ariaLabel}
                    onClick={(e) => handleLinkClick(e, lnk.href)}
                  >
                    <GoArrowUpRight className="nav-card-link-icon shrink-0 text-[16px]" aria-hidden="true" />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;

