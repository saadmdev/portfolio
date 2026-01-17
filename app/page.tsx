'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Lenis from 'lenis';
import Aurora from "@/components/Aurora";
import CardNav from "@/components/CardNav";
import ElectricBorder from "@/components/ElectricBorder";
import Stepper, { Step } from "@/components/Stepper";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import PixelCard from "@/components/PixelCard";
import MagicBento from "@/components/MagicBento";
import LogoLoop from "@/components/LogoLoop";
import TiltedCard from "@/components/TiltedCard";
import Globe from "@/components/Globe";
import { Frameworks } from "@/components/OrbitingCircles";
import DraggableCard from "@/components/DraggableCard";
import CopyEmailButton from "@/components/CopyEmailButton";
import { FaCode, FaMobileAlt, FaRobot, FaCloud, FaGraduationCap, FaSchool, FaUniversity, FaGithub, FaExternalLinkAlt, FaTimes, FaLinkedin } from 'react-icons/fa';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { 
  SiHtml5, 
  SiCss3, 
  SiJavascript, 
  SiTypescript, 
  SiReact, 
  SiNodedotjs, 
  SiExpress, 
  SiGraphql, 
  SiPhp, 
  SiPostgresql, 
  SiMongodb, 
  SiThreedotjs, 
  SiRedux, 
  SiGithub, 
  SiVsco, 
  SiFigma, 
  SiCplusplus, 
  SiPython, 
  SiLinux,
  SiNextdotjs,
  SiTailwindcss
} from 'react-icons/si';
import { FaJava, FaEnvelope, FaUser, FaPaperPlane, FaDatabase, FaLaptopCode } from 'react-icons/fa';
import x1Image from '@/assets/x1.jpg';
import Dither from '@/components/Dither';
import ASCIIText from '@/components/ASCIIText';
import TextPressure from '@/components/TextPressure';
import RotatingText from '@/components/RotatingText';
import FuzzyText from '@/components/FuzzyText';
import ocean from '@/assets/ocean.png';
import university from '@/assets/university.jpg';
import pathfinder from '@/assets/pathfinder.jpg';
import ecommerce from '@/assets/ecommerce.png';
import carrental from '@/assets/CarRental.png';
import everest from '@/assets/Everest.png';

interface Project {
  id: number;
  title: string;
  image: string;
  description: string;
  tools: string[];
  githubUrl?: string;
  liveUrl?: string;
}

// Check if device is mobile/low-power
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth < 768;
};

// Tilted Project Card Component - optimized for mobile
const TiltedProjectCard = ({ project, onClick }: { project: Project; onClick: () => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Simplified spring config for better performance
  const springConfig = isMobile 
    ? { damping: 25, stiffness: 150, mass: 1 } 
    : { damping: 30, stiffness: 100, mass: 2 };
  
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Skip tilt effect on mobile
    if (isMobile || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);
    
    rotateX.set(-offsetY * 12);
    rotateY.set(offsetX * 12);
    scale.set(1.05);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative group cursor-pointer h-[260px] md:h-[320px] lg:h-[360px] ${isMobile ? '' : '[perspective:1000px]'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <motion.div
        className="relative w-full h-full rounded-[15px] overflow-hidden"
        style={isMobile ? {} : {
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Title at bottom center */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
            <h3 className="text-lg md:text-xl font-black text-white drop-shadow-lg text-center">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Static Image */}
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </motion.div>
    </motion.div>
  );
};

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isMobileMain, setIsMobileMain] = useState(false);
  const grid2ContainerRef = useRef<HTMLDivElement>(null);

  // Check for mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileMain(isMobileDevice());
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Text looping for ASCIIText
  const contactTexts = ['GET_IN_TOUCH', 'LET_S_TALK', 'CONNECT', 'HELLO_WORLD', 'CONTACT_ME'];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Auto-loop through texts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % contactTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [contactTexts.length]);

  // Responsive main name font sizing
  const [nameMinFont, setNameMinFont] = useState<number>(56);
  useEffect(() => {
    const update = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
      if (w < 480) setNameMinFont(28);
      else if (w < 768) setNameMinFont(40);
      else if (w < 1024) setNameMinFont(52);
      else setNameMinFont(72);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      // `smoothTouch` is not present in the local Lenis type definitions; keep runtime option
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    } as any);

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Store lenis instance globally for use in other components
    (window as any).lenis = lenis;

    // Cleanup on unmount
    return () => {
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  const projects: Project[] = [
    {
      id: 1,
      title: "X1 Chauffeurs",
      image: typeof x1Image === 'string' ? x1Image : x1Image.src,
      description: "X1 Chauffeurs is a luxury transportation platform that provides a seamless and efficient way to book and manage chauffeur services. It is built with Next.js for the frontend and NestJS for the backend.",
      tools: ["Next.js", "Node.js", "Express", "MongoDB", "Stripe", "Tailwind CSS", "TypeScript"],
      liveUrl: "https://www.x1chauffeurs.com"
    },
    {
      id: 2,
      title: "Car Rental Management System",
      image: typeof carrental === 'string' ? carrental : carrental.src,
      description: "A full stack car rental management system that allows you to manage the cars, bookings, and customers.",
      tools: ["Next.js", "Node.js", "Express", "MongoDB", "Tailwind CSS", "TypeScript"],
      githubUrl: "https://github.com/saadmdev/car-rental-management-system",
      liveUrl: "https://car-rental-management-system-indol.vercel.app/pages/home"
    },
    {
      id: 3,
      title: "Ecommerce Website",
      image: typeof ecommerce === 'string' ? ecommerce : ecommerce.src,
      description: "A full stack ecommerce website that allows you to manage the products, orders, and customers.",
      tools: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "JavaScript"],
      githubUrl: "https://github.com/saadmdev/fullstack-ecommerce-mern",
      liveUrl: "https://fullstack-ecommerce-mern-beta.vercel.app"
    },
    {
      id: 4,
      title: "OceanExplorer",
      image: typeof ocean === 'string' ? ocean : ocean.src,
      description: "A frontend project that displays the ocean's beautiful waves and different places around the world",
      tools: ["React", "Tailwind CSS", "Vite"],
      githubUrl: "https://github.com/saadmdev/ocean-explorer?tab=readme-ov-file",
      liveUrl: "https://saadmdev.github.io/ocean-explorer/"
    },
    {
      id: 5,
      title: "Mount Everest",
      image: typeof everest === 'string' ? everest : everest.src,
      description: "A modern, interactive web experience showcasing Mount Everest through stunning visuals, historical facts, and engaging animations. Features parallax scrolling effects, smooth animations powered by Framer Motion, responsive design, historical timeline of expeditions, and comprehensive facts about the world's highest peak.",
      tools: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Lenis", "Lucide React"],
      githubUrl: "https://github.com/saadmdev/discover-everest",
      liveUrl: "https://discover-everest.vercel.app"
    },
    {
      id: 6,
      title: "Pathfinding Visualizer",
      image: typeof pathfinder === 'string' ? pathfinder : pathfinder.src,
      description: "A pathfinding visualizer that allows you to visualize the pathfinding algorithms like Dijkstra's, A*, Depth-First Search (DFS) ,and Breadth-First Search .",
      tools: ["React", "Tailwind CSS", "Vite", "JavaScript"],
      githubUrl: "https://github.com/saadmdev/Pathfinding-Visualizer",
      liveUrl: "https://saadmdev.github.io/Pathfinding-Visualizer/"
    },
  ];

  const navItems = [
    {
      label: "About",
      bgColor: "rgba(58, 41, 255, 0.15)",
      textColor: "#fff",
      links: [
        { label: "About Me", href: "#about", ariaLabel: "About Muhammad Saad" },
        { label: "Experience", href: "#experience", ariaLabel: "Work Experience" },
        { label: "Education", href: "#education", ariaLabel: "Educational Background" }
      ]
    },
    {
      label: "Work",
      bgColor: "rgba(255, 148, 180, 0.15)",
      textColor: "#fff",
      links: [
        { label: "Projects", href: "#projects", ariaLabel: "View Projects" },
        { label: "Skills", href: "#skills", ariaLabel: "Skills & Expertise" },
        { label: "Tools", href: "#tools", ariaLabel: "Tools & Technologies" }
      ]
    },
    {
      label: "Contact",
      bgColor: "rgba(255, 50, 50, 0.15)",
      textColor: "#fff",
      links: [
        { label: "Get In Touch", href: "#contact", ariaLabel: "Contact Section" },
        { label: "Email", href: "mailto:devsaadm@gmail.com", ariaLabel: "Send Email" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/muhammad-saad-a4779b38a/", ariaLabel: "LinkedIn Profile" },
        { label: "GitHub", href: "https://github.com/saadmdev", ariaLabel: "GitHub Profile" }
      ]
    }
  ];

  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden">
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      
      {/* Navigation */}
      <CardNav
        logo="/logo-white.svg"
        logoAlt="Muhammad Saad Logo"
        items={navItems}
        baseColor="rgba(255, 255, 255, 0.1)"
        menuColor="#fff"
        buttonBgColor="rgba(58, 41, 255, 0.8)"
        buttonTextColor="#fff"
        ease="power3.out"
      />
      
      {/* Hero Section */}
      <section className="relative z-[1] flex min-h-screen w-full items-center justify-center px-4 sm:px-8 md:px-16 pt-20 md:pt-0 pb-20">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="flex flex-col justify-center space-y-4 md:space-y-6 fade-in-up text-center lg:text-left">
              {/* Desktop View */}
              <div className="hidden md:flex flex-col space-y-2">
                <motion.h1
                  className="text-3xl lg:text-4xl font-medium text-white"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Hi I'm Muhammad Saad
                </motion.h1>
                <div className="flex flex-col items-start lg:items-start">
                  <motion.p
                    className="text-4xl lg:text-5xl font-medium text-white/80"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    A Developer <br /> Dedicated to Crafting
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <RotatingText
                      texts={['Modern', 'Scalable', 'Secure']}
                      delay={3000}
                      className="text-7xl lg:text-9xl font-black bg-gradient-to-r from-[#3A29FF] via-[#FF94B4] to-[#FF3232] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(58,41,255,0.5)]"
                    />
                  </motion.div>
                  <motion.p
                    className="text-3xl lg:text-4xl font-medium text-white/80"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    Web Solutions
                  </motion.p>
                </div>
              </div>

              {/* Mobile View */}
              <div className="flex flex-col space-y-6 md:hidden px-2">
                <motion.p
                  className="text-4xl sm:text-5xl font-bold text-white leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Hi, I'm Muhammad Saad
                </motion.p>
                <div className="space-y-2">
                  <motion.p
                    className="text-2xl sm:text-3xl font-medium text-white/70"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    A Developer Crafting
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <RotatingText
                      texts={['Modern', 'Scalable', 'Secure']}
                      delay={3000}
                      className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-[#3A29FF] via-[#FF94B4] to-[#FF3232] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(58,41,255,0.5)]"
                    />
                  </motion.div>
                  <motion.p
                    className="text-2xl sm:text-3xl font-medium text-white/70"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    Web Solutions
                  </motion.p>
                </div>
                {/* CTA Button for Mobile */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="pt-4"
                >
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#3A29FF] to-[#FF94B4] text-white font-semibold text-lg shadow-lg shadow-[#3A29FF]/30 hover:shadow-[#3A29FF]/50 transition-all duration-300"
                  >
                    Let's Work Together
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </motion.div>
              </div>
            </div>

            {/* Right Column - Globe (hidden on mobile) */}
            <div className="hidden md:flex items-center justify-center lg:justify-end fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-full flex justify-center">
                <Globe size={600} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-[1] w-full py-16 md:py-24 px-4 sm:px-8 md:px-16">
        <div className="w-full max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-10 md:mb-14 fade-in-up text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
              <span className="animated-gradient-text">About Me</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"></div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:auto-rows-[18rem] fade-in-up">
            {/* Grid 1 - Main Intro */}
            <div className="relative overflow-hidden p-6 bg-[#060010] rounded-2xl row-span-1 md:row-span-2 md:col-span-3 h-[20rem] md:h-full group hover:-translate-y-1 duration-300 border border-white/10 hover:border-[#3A29FF]/50 shadow-lg hover:shadow-[#3A29FF]/20 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3A29FF]/10 via-transparent to-[#FF94B4]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src="/coding-pov.png"
                alt="Coding POV"
                className="absolute scale-[1.75] -right-[5rem] -top-[1rem] md:scale-[3] md:left-50 md:inset-y-10 lg:scale-[2.5] opacity-60 group-hover:opacity-80 transition-opacity duration-300"
              />
              <div className="relative z-10 h-full flex flex-col justify-end">
                <p className="text-xl md:text-2xl font-semibold text-white mb-2">Hi, I'm Muhammad Saad</p>
                <p className="text-white/70 text-sm md:text-base leading-relaxed">
                  Over the last 4 years, I developed my frontend and backend dev
                  skills to deliver dynamic software and web applications.
                </p>
              </div>
              <div className="absolute inset-x-0 pointer-events-none -bottom-4 h-1/2 sm:h-1/3 bg-gradient-to-t from-[#060010]" />
            </div>

            {/* Grid 2 - Code is Craft (Interactive) */}
            <div className="relative overflow-hidden bg-[#060010] rounded-2xl row-span-1 md:col-span-3 h-[18rem] md:h-full group hover:-translate-y-1 duration-300 border border-white/10 hover:border-[#FF94B4]/50 shadow-lg hover:shadow-[#FF94B4]/20 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF94B4]/5 via-transparent to-[#3A29FF]/5"></div>
              <div 
                ref={grid2ContainerRef}
                className="flex items-center justify-center w-full h-full relative"
              >
                <p className="text-4xl md:text-6xl text-white/20 font-black select-none group-hover:text-white/30 transition-colors duration-300 tracking-wider">CODE IS CRAFT</p>
                {/* 4 Text Pills - Core Web Dev */}
                <DraggableCard
                  style={{ rotate: "-50deg", top: "18%", left: "5%" }}
                  text="TypeScript"
                  containerRef={grid2ContainerRef}
                />
                <DraggableCard
                  style={{ rotate: "50deg", top: "15%", left: "70%" }}
                  text="Next.js"
                  containerRef={grid2ContainerRef}
                />
                <DraggableCard
                  style={{ rotate: "-40deg", bottom: "15%", left: "55%" }}
                  text="Tailwind"
                  containerRef={grid2ContainerRef}
                />
                <DraggableCard
                  style={{ rotate: "60deg", bottom: "20%", left: "5%" }}
                  text="Node.js"
                  containerRef={grid2ContainerRef}
                />
                {/* 4 Icon Balls - Core Web Dev */}
                <motion.div
                  className="absolute z-10 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full ring-1 ring-white/10 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] cursor-grab shadow-lg shadow-black/30"
                  style={{ top: "40%", left: "45%" }}
                  whileHover={{ scale: 1.1 }}
                  drag
                  dragConstraints={grid2ContainerRef}
                  dragElastic={0.5}
                >
                  <SiReact className="text-[#61DAFB] text-3xl md:text-4xl" />
                </motion.div>
                <motion.div
                  className="absolute z-10 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full ring-1 ring-white/10 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] cursor-grab shadow-lg shadow-black/30"
                  style={{ top: "55%", left: "20%" }}
                  whileHover={{ scale: 1.1 }}
                  drag
                  dragConstraints={grid2ContainerRef}
                  dragElastic={0.5}
                >
                  <SiTypescript className="text-[#3178C6] text-3xl md:text-4xl" />
                </motion.div>
                <motion.div
                  className="absolute z-10 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full ring-1 ring-white/10 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] cursor-grab shadow-lg shadow-black/30"
                  style={{ top: "10%", left: "45%" }}
                  whileHover={{ scale: 1.1 }}
                  drag
                  dragConstraints={grid2ContainerRef}
                  dragElastic={0.5}
                >
                  <SiNextdotjs className="text-white text-3xl md:text-4xl" />
                </motion.div>
                <motion.div
                  className="absolute z-10 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full ring-1 ring-white/10 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] cursor-grab shadow-lg shadow-black/30"
                  style={{ top: "50%", left: "75%" }}
                  whileHover={{ scale: 1.1 }}
                  drag
                  dragConstraints={grid2ContainerRef}
                  dragElastic={0.5}
                >
                  <SiNodedotjs className="text-[#339933] text-3xl md:text-4xl" />
                </motion.div>
                <motion.div
                  className="absolute z-10 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full ring-1 ring-white/10 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] cursor-grab shadow-lg shadow-black/30"
                  style={{ top: "70%", left: "42%" }}
                  whileHover={{ scale: 1.1 }}
                  drag
                  dragConstraints={grid2ContainerRef}
                  dragElastic={0.5}
                >
                  <SiMongodb className="text-[#47A248] text-3xl md:text-4xl" />
                </motion.div>
                {/* Extra Text Pill */}
                <DraggableCard
                  style={{ rotate: "-30deg", top: "38%", left: "15%" }}
                  text="MongoDB"
                  containerRef={grid2ContainerRef}
                />
              </div>
            </div>

            {/* Grid 3 - Location/Timezone with Globe */}
            <div className="relative overflow-hidden p-6 bg-[#060010] rounded-2xl row-span-1 md:col-span-3 h-[20rem] md:h-full group hover:-translate-y-1 duration-300 border border-white/10 hover:border-[#3A29FF]/50 shadow-lg hover:shadow-[#3A29FF]/20 transition-all">
              <div className="absolute inset-0 bg-gradient-to-tl from-[#3A29FF]/10 via-transparent to-[#FF3232]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 w-[50%]">
                <p className="text-xl font-semibold text-white mb-2">Time Zone</p>
                <p className="text-white/70 text-sm md:text-base leading-relaxed">
                  I&apos;m based in Pakistan, and open to remote work worldwide
                </p>
              </div>
              <figure className="absolute -right-[4rem] -top-[1rem]">
                <Globe />
              </figure>
            </div>

            {/* Grid 4 - CTA */}
            <div className="relative overflow-hidden p-6 bg-gradient-to-br from-[#3A29FF] to-[#7a57db] rounded-2xl row-span-1 md:col-span-2 h-[15rem] md:h-full group hover:-translate-y-1 duration-300 border border-[#3A29FF]/50 shadow-lg shadow-[#3A29FF]/30 hover:shadow-[#3A29FF]/50 transition-all">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="flex flex-col items-center justify-center gap-4 size-full relative z-10">
                <p className="text-xl font-semibold text-white text-center">
                  Do you want to start a project together?
                </p>
                <CopyEmailButton email="devsaadm@gmail.com" />
              </div>
            </div>

            {/* Grid 5 - Tech Stack with Orbiting Icons */}
            <div className="relative overflow-hidden p-6 bg-[#060010] rounded-2xl row-span-1 md:col-span-4 h-[18rem] md:h-full group hover:-translate-y-1 duration-300 border border-white/10 hover:border-[#FF94B4]/50 shadow-lg hover:shadow-[#FF94B4]/20 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF94B4]/10 via-transparent to-[#3A29FF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 w-[50%]">
                <p className="text-xl font-semibold text-white mb-2">Tech Stack</p>
                <p className="text-white/70 text-sm md:text-base leading-relaxed">
                  I specialize in a variety of languages, frameworks, and tools that
                  allow me to build robust and scalable applications
                </p>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-[-200px] md:right-[-180px]">
                <Frameworks />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="relative z-[1] w-full py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="w-full max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-8 md:mb-10 text-center fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
              <span className="animated-gradient-text">Experience</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"></div>
          </div>

          {/* Stepper Component */}
          <div className="fade-in-up">
            <Stepper
              initialStep={1}
              onStepChange={(step) => {
                console.log(`Step ${step}`);
              }}
              backButtonText="Previous"
              nextButtonText="Next"
            >
              {/* Step 1: ProgNeo */}
              <Step>
                <div className="space-y-4 md:space-y-5">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="flex-shrink-0 ml-2 md:ml-0">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-[#3A29FF] to-[#FF94B4] flex items-center justify-center shadow-lg shadow-[#3A29FF]/50 ring-2 ring-[#3A29FF]/30">
                        <FaCode className="text-xl md:text-2xl text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                          Web Developer
                        </h3>
                        <span className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-[#3A29FF]/40 to-[#3A29FF]/20 text-white text-xs md:text-sm font-semibold border-2 border-[#3A29FF]/50 backdrop-blur-md shadow-lg shadow-[#3A29FF]/30">
                          <FaMapMarkerAlt className="text-xs" />
                          ProgNeo · Internship
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-white/80 text-xs md:text-sm mb-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                          <FaCalendarAlt className="text-xs" />
                          Jun 2025 - Sep 2025 · 4 mos
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pl-0 md:pl-0 space-y-3 max-w-4xl mx-auto">
                    <div className="p-4 md:p-6 rounded-xl bg-gradient-to-br from-white/8 to-white/2 border border-white/20 backdrop-blur-md shadow-lg hover:border-white/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#3A29FF]/20">
                      <p className="text-white/95 text-sm md:text-base leading-relaxed mb-4">
                        Developed and deployed enterprise web applications using the MERN stack and Next.js, creating scalable and performant solutions.
                      </p>
                      <ul className="space-y-2.5 text-white/85 text-xs md:text-sm lg:text-base">
                        <li className="flex items-start gap-3 group/item">
                          <span className="text-[#3A29FF] mt-1 text-base font-bold drop-shadow-[0_0_8px_rgba(58,41,255,0.6)] group-hover/item:drop-shadow-[0_0_12px_rgba(58,41,255,0.8)] transition-all">▹</span>
                          <span className="group-hover/item:text-white/95 transition-colors">Designed RESTful APIs and responsive, SEO-friendly UIs that enhanced user engagement and performance metrics.</span>
                        </li>
                        <li className="flex items-start gap-3 group/item">
                          <span className="text-[#3A29FF] mt-1 text-base font-bold drop-shadow-[0_0_8px_rgba(58,41,255,0.6)] group-hover/item:drop-shadow-[0_0_12px_rgba(58,41,255,0.8)] transition-all">▹</span>
                          <span className="group-hover/item:text-white/95 transition-colors">Implemented modern frontend architectures with React and Next.js, optimizing for speed and user experience.</span>
                        </li>
                        <li className="flex items-start gap-3 group/item">
                          <span className="text-[#3A29FF] mt-1 text-base font-bold drop-shadow-[0_0_8px_rgba(58,41,255,0.6)] group-hover/item:drop-shadow-[0_0_12px_rgba(58,41,255,0.8)] transition-all">▹</span>
                          <span className="group-hover/item:text-white/95 transition-colors">Collaborated with cross-functional teams to deliver high-quality software solutions on time.</span>
                        </li>
                        <li className="flex items-start gap-3 group/item">
                          <span className="text-[#3A29FF] mt-1 text-base font-bold drop-shadow-[0_0_8px_rgba(58,41,255,0.6)] group-hover/item:drop-shadow-[0_0_12px_rgba(58,41,255,0.8)] transition-all">▹</span>
                          <span className="group-hover/item:text-white/95 transition-colors">Utilized MongoDB, Express.js, and Node.js to build robust backend systems and database architectures.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Step>

              {/* Step 2: X1 Chauffers */}
              <Step>
                <div className="space-y-4 md:space-y-5">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="flex-shrink-0 ml-2 md:ml-0">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-[#FF94B4] to-[#FF3232] flex items-center justify-center shadow-lg shadow-[#FF94B4]/50 ring-2 ring-[#FF94B4]/30">
                        <FaCloud className="text-xl md:text-2xl text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                          Full-Stack Developer
                        </h3>
                        <span className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-[#FF94B4]/40 to-[#FF94B4]/20 text-white text-xs md:text-sm font-semibold border-2 border-[#FF94B4]/50 backdrop-blur-md shadow-lg shadow-[#FF94B4]/30">
                          <FaMapMarkerAlt className="text-xs" />
                          X1 Chauffers
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-white/80 text-xs md:text-sm mb-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                          <FaCalendarAlt className="text-xs" />
                          June 2025 - Aug 2025 · 3 mos
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pl-0 md:pl-0 space-y-3 max-w-4xl mx-auto">
                    <div className="p-4 md:p-6 rounded-xl bg-gradient-to-br from-white/8 to-white/2 border border-white/20 backdrop-blur-md shadow-lg hover:border-white/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#FF94B4]/20">
                      <p className="text-white/95 text-sm md:text-base leading-relaxed mb-4">
                        Developing the X1 Chauffers luxury transportation platform using Next.js for frontend and NestJS for backend architecture.
                      </p>
                      <ul className="space-y-2.5 text-white/85 text-xs md:text-sm lg:text-base">
                        <li className="flex items-start gap-3 group/item">
                          <span className="text-[#FF94B4] mt-1 text-base font-bold drop-shadow-[0_0_8px_rgba(255,148,180,0.6)] group-hover/item:drop-shadow-[0_0_12px_rgba(255,148,180,0.8)] transition-all">▹</span>
                          <span className="group-hover/item:text-white/95 transition-colors">Building scalable APIs and microservices to handle ride booking, driver management, and payment processing systems.</span>
                        </li>
                        <li className="flex items-start gap-3 group/item">
                          <span className="text-[#FF94B4] mt-1 text-base font-bold drop-shadow-[0_0_8px_rgba(255,148,180,0.6)] group-hover/item:drop-shadow-[0_0_12px_rgba(255,148,180,0.8)] transition-all">▹</span>
                          <span className="group-hover/item:text-white/95 transition-colors">Implementing real-time features including live tracking, notifications, and chat functionality for seamless user experience.</span>
                        </li>
                        <li className="flex items-start gap-3 group/item">
                          <span className="text-[#FF94B4] mt-1 text-base font-bold drop-shadow-[0_0_8px_rgba(255,148,180,0.6)] group-hover/item:drop-shadow-[0_0_12px_rgba(255,148,180,0.8)] transition-all">▹</span>
                          <span className="group-hover/item:text-white/95 transition-colors">Integrating third-party services for geolocation, payment gateways, and SMS notifications to enhance platform capabilities.</span>
                        </li>
                        <li className="flex items-start gap-3 group/item">
                          <span className="text-[#FF94B4] mt-1 text-base font-bold drop-shadow-[0_0_8px_rgba(255,148,180,0.6)] group-hover/item:drop-shadow-[0_0_12px_rgba(255,148,180,0.8)] transition-all">▹</span>
                          <span className="group-hover/item:text-white/95 transition-colors">Architecting and developing robust backend systems with NestJS, ensuring high performance and scalability.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Step>
            </Stepper>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="relative z-[1] w-full py-8 md:py-10 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="w-full max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-6 md:mb-8 text-center fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
              <span className="animated-gradient-text">Education</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"></div>
          </div>

          {/* ScrollStack Component */}
          <div className="fade-in-up">
            <ScrollStack
              useWindowScroll={true}
              itemDistance={60}
              itemScale={0.04}
              itemStackDistance={25}
              stackPosition="20%"
              scaleEndPosition="8%"
              baseScale={0.88}
              rotationAmount={0}
              blurAmount={2}
            >
              {/* FUI - Bachelor's */}
              <ScrollStackItem>
                <PixelCard variant="purplePink" className="w-full h-full">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 h-full">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-[#3A29FF] to-[#FF94B4] flex items-center justify-center shadow-lg shadow-[#3A29FF]/50 ring-2 ring-[#3A29FF]/30">
                        <FaUniversity className="text-2xl md:text-3xl text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1.5">
                        Foundation University Islamabad (FUI)
                      </h3>
                      <p className="text-base md:text-lg text-white/90 mb-2 font-semibold">
                        Bachelor of Science - BS, Computer Software Engineering
                      </p>
                      <div className="flex items-center gap-3 text-white/70 text-xs md:text-sm">
                        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                          <FaCalendarAlt className="text-xs" />
                          2022 - 2026
                        </span>
                      </div>
                    </div>
                  </div>
                </PixelCard>
              </ScrollStackItem>

              {/* APSACS - Intermediate */}
              <ScrollStackItem>
                <PixelCard variant="pinkRed" className="w-full h-full">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 h-full">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-[#FF94B4] to-[#FF3232] flex items-center justify-center shadow-lg shadow-[#FF94B4]/50 ring-2 ring-[#FF94B4]/30">
                        <FaSchool className="text-2xl md:text-3xl text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1.5">
                        Army Public School - (APSACS)
                      </h3>
                      <p className="text-base md:text-lg text-white/90 mb-2 font-semibold">
                        Intermediate in Computer Science (ICS), Computer Science
                      </p>
                      <div className="flex items-center gap-3 text-white/70 text-xs md:text-sm">
                        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                          <FaCalendarAlt className="text-xs" />
                          Aug 2020 - Aug 2022
                        </span>
                      </div>
                    </div>
                  </div>
                </PixelCard>
              </ScrollStackItem>

              {/* APSACS - Matriculation */}
              <ScrollStackItem>
                <PixelCard variant="greenPurple" className="w-full h-full">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 h-full">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-[#7cff67] to-[#3A29FF] flex items-center justify-center shadow-lg shadow-[#7cff67]/50 ring-2 ring-[#7cff67]/30">
                        <FaGraduationCap className="text-2xl md:text-3xl text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1.5">
                        Army Public School - (APSACS)
                      </h3>
                      <p className="text-base md:text-lg text-white/90 mb-2 font-semibold">
                        Matriculation, Science
                      </p>
                      <div className="flex items-center gap-3 text-white/70 text-xs md:text-sm">
                        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                          <FaCalendarAlt className="text-xs" />
                          Aug 2018 - Aug 2020
                        </span>
                      </div>
                    </div>
                  </div>
                </PixelCard>
              </ScrollStackItem>
            </ScrollStack>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="relative z-[1] w-full py-8 md:py-10 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="w-full max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-6 md:mb-8 text-center fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
              <span className="animated-gradient-text">Skills</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"></div>
          </div>

          {/* MagicBento Component */}
          <div className="fade-in-up">
            <MagicBento
              textAutoHide={true}
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              enableMagnetism={true}
              clickEffect={true}
              spotlightRadius={300}
              particleCount={12}
              glowColor="58, 41, 255"
              cards={[
                {
                  color: '#060010',
                  title: 'Frontend Development',
                  description: 'Expert in React, Next.js, TypeScript, and modern UI frameworks. Building responsive, performant, and accessible web applications.',
                  label: 'Frontend'
                },
                {
                  color: '#060010',
                  title: 'Backend Development',
                  description: 'Proficient in Node.js, Express, NestJS, MongoDB, and RESTful API design. Creating scalable server architectures.',
                  label: 'Backend'
                },
                {
                  color: '#060010',
                  title: 'Full Stack',
                  description: 'End-to-end development with MERN stack. Seamless integration of frontend and backend systems.',
                  label: 'Full Stack'
                },
                {
                  color: '#060010',
                  title: 'AI/ML Development',
                  description: 'Building intelligent solutions with Python, TensorFlow, and machine learning algorithms.',
                  label: 'AI/ML'
                },
                {
                  color: '#060010',
                  title: 'Mobile Development',
                  description: 'Cross-platform mobile app development with React Native. Creating native-like experiences.',
                  label: 'Mobile'
                },
                {
                  color: '#060010',
                  title: 'DevOps & Tools',
                  description: 'Git, Docker, CI/CD pipelines, and cloud deployment. Version control and automation.',
                  label: 'DevOps'
                }
              ]}
            />
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="relative z-[1] w-full py-8 md:py-10 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="w-full max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-6 md:mb-8 text-center fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
              <span className="animated-gradient-text">Tools & Technologies</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"></div>
          </div>

          {/* LogoLoop Component */}
          <div className="fade-in-up">
            <div className="relative py-8 md:py-12">
              <div className="absolute inset-0 bg-gradient-to-r from-[#3A29FF]/20 via-transparent to-[#FF94B4]/20 blur-3xl"></div>
              <div className="relative backdrop-blur-sm bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10">
                <LogoLoop
                  logos={[
                    { node: <SiHtml5 className="text-[#E34F26]" />, title: "HTML5", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
                    { node: <SiCss3 className="text-[#1572B6]" />, title: "CSS3", href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
                    { node: <SiJavascript className="text-[#F7DF1E]" />, title: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
                    { node: <SiTypescript className="text-[#3178C6]" />, title: "TypeScript", href: "https://www.typescriptlang.org" },
                    { node: <SiReact className="text-[#61DAFB]" />, title: "React", href: "https://react.dev" },
                    { node: <SiNextdotjs className="text-white" />, title: "Next.js", href: "https://nextjs.org" },
                    { node: <SiNodedotjs className="text-[#339933]" />, title: "Node.js", href: "https://nodejs.org" },
                    { node: <SiExpress className="text-white" />, title: "Express.js", href: "https://expressjs.com" },
                    { node: <SiGraphql className="text-[#E10098]" />, title: "GraphQL", href: "https://graphql.org" },
                    { node: <SiPhp className="text-[#777BB4]" />, title: "PHP", href: "https://www.php.net" },
                    { node: <SiPostgresql className="text-[#4169E1]" />, title: "PostgreSQL", href: "https://www.postgresql.org" },
                    { node: <SiMongodb className="text-[#47A248]" />, title: "MongoDB", href: "https://www.mongodb.com" },
                    { node: <SiThreedotjs className="text-white" />, title: "Three.js", href: "https://threejs.org" },
                    { node: <SiRedux className="text-[#764ABC]" />, title: "Redux", href: "https://redux.js.org" },
                    { node: <SiGithub className="text-white" />, title: "GitHub", href: "https://github.com" },
                    { node: <SiVsco className="text-[#007ACC]" />, title: "VS Code", href: "https://code.visualstudio.com" },
                    { node: <SiFigma className="text-[#F24E1E]" />, title: "Figma", href: "https://www.figma.com" },
                    { node: <SiCplusplus className="text-[#00599C]" />, title: "C++", href: "https://isocpp.org" },
                    { node: <FaJava className="text-[#ED8B00]" />, title: "Java", href: "https://www.java.com" },
                    { node: <SiPython className="text-[#3776AB]" />, title: "Python", href: "https://www.python.org" },
                    { node: <SiLinux className="text-white" />, title: "Linux", href: "https://www.linux.org" },
                    { node: <SiTailwindcss className="text-[#06B6D4]" />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
                  ]}
                  speed={80}
                  direction="left"
                  logoHeight={64}
                  gap={48}
                  pauseOnHover={true}
                  hoverSpeed={20}
                  fadeOut={true}
                  fadeOutColor="#0a0a0a"
                  scaleOnHover={true}
                  ariaLabel="Technology tools and frameworks"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section 
        id="projects" 
        className="relative z-[1] w-full py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-12"
        onMouseMove={(e) => {
          const mouseX = e.clientX + 20;
          const mouseY = e.clientY + 20;
          const previewEl = document.getElementById('project-preview');
          if (previewEl) {
            previewEl.style.left = `${mouseX}px`;
            previewEl.style.top = `${mouseY}px`;
          }
        }}
      >
        <div className="w-full max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="mb-8 md:mb-12 fade-in-up text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              My Selected <span className="animated-gradient-text">Projects</span>
            </h2>
          </div>

          {/* Divider */}
          <div className="bg-gradient-to-r from-transparent via-white/30 to-transparent h-[1px] w-full mb-4"></div>

          {/* Projects List */}
          <div className="fade-in-up">
            {projects.map((project) => (
              <div key={project.id}>
                <div 
                  className="flex flex-wrap items-center justify-between py-8 md:py-10 space-y-4 sm:space-y-0 group cursor-pointer"
                  onMouseEnter={() => setPreviewImage(project.image)}
                  onMouseLeave={() => setPreviewImage(null)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xl md:text-2xl font-semibold text-white group-hover:text-[#3A29FF] transition-colors duration-300">
                      {project.title}
                    </p>
                    <div className="flex flex-wrap gap-3 md:gap-5 mt-2 text-white/60 text-sm md:text-base">
                      {project.tools.slice(0, 4).map((tool, index) => (
                        <span key={index} className="hover:text-white/80 transition-colors">{tool}</span>
                      ))}
                      {project.tools.length > 4 && (
                        <span className="text-white/40">+{project.tools.length - 4} more</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white font-medium transition-all duration-300 group-hover:translate-x-1"
                  >
                    Read More
                    <svg 
                      className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
                <div className="bg-gradient-to-r from-transparent via-white/20 to-transparent h-[1px] w-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Preview Image */}
        {previewImage && (
          <div 
            id="project-preview"
            className="fixed z-50 pointer-events-none hidden lg:block"
            style={{ transition: 'left 0.1s ease-out, top 0.1s ease-out' }}
          >
            <motion.img
              src={previewImage}
              alt="Project Preview"
              className="w-80 h-56 object-cover rounded-lg shadow-2xl shadow-[#3A29FF]/30 border border-white/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            />
          </div>
        )}
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-gradient-to-l from-[#060010] to-[#1a0a2e] rounded-2xl border border-white/10 shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 z-10 p-2 rounded-lg bg-[#060010] hover:bg-white/10 text-white transition-all duration-200"
              >
                <FaTimes className="w-5 h-5" />
              </button>

              {/* Project Image */}
              <div className="relative w-full overflow-hidden rounded-t-2xl">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full object-cover"
                />
              </div>

              {/* Project Content */}
              <div className="p-5 md:p-6">
                <h5 className="text-2xl font-bold text-white mb-3">
                  {selectedProject.title}
                </h5>

                <p className="text-neutral-400 mb-4 leading-relaxed">
                  {selectedProject.description}
                </p>

                {/* Tools & Links Row */}
                <div className="flex flex-wrap items-center justify-between mt-5 gap-4">
                  {/* Tools */}
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tools.map((tool, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-white/80 text-sm font-medium hover:bg-white/20 transition-colors"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-white/10">
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium transition-all duration-200 hover:translate-x-1"
                    >
                      <FaGithub className="text-lg" />
                      View Code
                      <svg className="w-4 h-4 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </a>
                  )}
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium transition-all duration-200 hover:translate-x-1"
                    >
                      <FaExternalLinkAlt className="text-sm" />
                      Live Demo
                      <svg className="w-4 h-4 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Section */}
      <section id="contact" className="relative z-[1] w-full py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="w-full max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-8 md:mb-12 text-center fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
              <span className="animated-gradient-text">Contact Me</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"></div>
            <p className="text-white/70 text-base md:text-lg mt-4 max-w-2xl mx-auto">
              Have a project in mind or want to collaborate? Let's connect and bring your ideas to life.
            </p>
          </div>

          {/* Contact Content - Two Column Layout */}
          <div className="fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 min-h-[600px]">
              {/* Left Column - Contact Form */}
              <div className="relative group">
                <ElectricBorder
                  color="#3A29FF"
                  speed={1.5}
                  chaos={0.6}
                  thickness={2}
                  style={{ borderRadius: 16 }}
                  className="h-full transition-transform duration-300"
                >
                  <div className="relative h-full p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#3A29FF]/10 via-[#FF94B4]/5 to-[#FF3232]/10 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden">
                    {/* Animated gradient background overlay */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-0 left-0 w-96 h-96 bg-[#3A29FF]/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF94B4]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#FF3232]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>
                    
                    {/* Decorative corner accents */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#3A29FF]/30 to-transparent rounded-br-full"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#FF3232]/30 to-transparent rounded-tl-full"></div>
                    
                    <div className="relative z-10">
                      <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setIsSubmitting(true);
                      setSubmitStatus('idle');

                      try {
                        const response = await fetch('/api/contact', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(formData),
                        });

                        if (response.ok) {
                          setSubmitStatus('success');
                          setFormData({ name: '', email: '', subject: '', message: '' });
                          setTimeout(() => setSubmitStatus('idle'), 5000);
                        } else {
                          setSubmitStatus('error');
                        }
                      } catch (error) {
                        console.error('Error submitting form:', error);
                        setSubmitStatus('error');
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                        className="space-y-6"
                      >
                        {/* Name Field */}
                        <div className="group/field">
                          <label htmlFor="name" className="block text-white/90 text-sm font-semibold mb-2 flex items-center gap-2">
                            <FaUser className="text-[#3A29FF] transition-transform duration-200 group-hover/field:scale-110" />
                            Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              required
                              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#3A29FF] focus:ring-2 focus:ring-[#3A29FF]/50 transition-all duration-200 backdrop-blur-sm shadow-lg focus:shadow-[#3A29FF]/20 focus:shadow-xl"
                              placeholder="Your Name"
                            />
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#3A29FF]/0 via-[#3A29FF]/20 to-[#3A29FF]/0 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 -z-10 blur-xl"></div>
                          </div>
                        </div>

                        {/* Email Field */}
                        <div className="group/field">
                          <label htmlFor="email" className="block text-white/90 text-sm font-semibold mb-2 flex items-center gap-2">
                            <FaEnvelope className="text-[#FF94B4] transition-transform duration-200 group-hover/field:scale-110" />
                            Email
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              required
                              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#FF94B4] focus:ring-2 focus:ring-[#FF94B4]/50 transition-all duration-200 backdrop-blur-sm shadow-lg focus:shadow-[#FF94B4]/20 focus:shadow-xl"
                              placeholder="your.email@example.com"
                            />
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FF94B4]/0 via-[#FF94B4]/20 to-[#FF94B4]/0 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 -z-10 blur-xl"></div>
                          </div>
                        </div>

                        {/* Subject Field */}
                        <div className="group/field">
                          <label htmlFor="subject" className="block text-white/90 text-sm font-semibold mb-2">
                            Subject
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="subject"
                              name="subject"
                              value={formData.subject}
                              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                              required
                              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#FF3232] focus:ring-2 focus:ring-[#FF3232]/50 transition-all duration-200 backdrop-blur-sm shadow-lg focus:shadow-[#FF3232]/20 focus:shadow-xl"
                              placeholder="What's this about?"
                            />
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FF3232]/0 via-[#FF3232]/20 to-[#FF3232]/0 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 -z-10 blur-xl"></div>
                          </div>
                        </div>

                        {/* Message Field */}
                        <div className="group/field">
                          <label htmlFor="message" className="block text-white/90 text-sm font-semibold mb-2">
                            Message
                          </label>
                          <div className="relative">
                            <textarea
                              id="message"
                              name="message"
                              value={formData.message}
                              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                              required
                              rows={6}
                              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#3A29FF] focus:ring-2 focus:ring-[#3A29FF]/50 transition-all duration-200 backdrop-blur-sm resize-none shadow-lg focus:shadow-[#3A29FF]/20 focus:shadow-xl"
                              placeholder="Tell me about your project or idea..."
                            />
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#3A29FF]/0 via-[#3A29FF]/20 to-[#3A29FF]/0 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 -z-10 blur-xl"></div>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="relative w-full px-6 py-4 rounded-xl bg-gradient-to-r from-[#3A29FF] via-[#FF94B4] to-[#FF3232] text-white font-bold text-lg hover:scale-105 active:scale-95 transition-all duration-200 shadow-2xl shadow-[#3A29FF]/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden group/btn"
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-[#FF94B4] via-[#FF3232] to-[#3A29FF] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative z-10 flex items-center gap-2">
                              {isSubmitting ? (
                                <>
                                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <FaPaperPlane className="transition-transform duration-200 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                                  Send Message
                                </>
                              )}
                            </span>
                          </button>
                        </div>

                        {/* Status Messages */}
                        <AnimatePresence>
                          {submitStatus === 'success' && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300 text-sm backdrop-blur-sm shadow-lg"
                            >
                              Message sent successfully! I'll get back to you soon.
                            </motion.div>
                          )}
                          {submitStatus === 'error' && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm backdrop-blur-sm shadow-lg"
                            >
                              Failed to send message. Please try again or email me directly at devsaadm@gmail.com
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </form>
                    </div>
                  </div>
                </ElectricBorder>
              </div>

              {/* Right Column - Animated Visualization (Desktop) / Static Visual (Mobile) */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#060010] to-[#1a0a2e] border border-white/20 shadow-xl min-h-[400px] md:min-h-[600px]">
                {isMobileMain ? (
                  // Mobile: Simple animated gradient background with text
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: `
                          radial-gradient(ellipse at 30% 30%, rgba(58, 41, 255, 0.3) 0%, transparent 50%),
                          radial-gradient(ellipse at 70% 70%, rgba(255, 148, 180, 0.2) 0%, transparent 50%),
                          radial-gradient(ellipse at 50% 50%, rgba(255, 50, 50, 0.15) 0%, transparent 60%),
                          linear-gradient(135deg, #060010 0%, #1a0a2e 50%, #060010 100%)
                        `
                      }}
                    />
                    <div className="relative z-10 text-center px-4">
                      <h3 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
                        <span className="animated-gradient-text">{contactTexts[currentTextIndex].replace(/_/g, ' ')}</span>
                      </h3>
                      <p className="text-white/60 text-sm">Let's build something amazing together</p>
                    </div>
                  </div>
                ) : (
                  // Desktop: Full 3D visualization
                  <>
                    <div className="absolute inset-0 w-full h-full">
                      <Dither
                        waveColor={[0.5, 0.5, 0.5]}
                        disableAnimation={false}
                        enableMouseInteraction={true}
                        mouseRadius={0.3}
                        colorNum={4}
                        waveAmplitude={0.3}
                        waveFrequency={3}
                        waveSpeed={0.05}
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <ASCIIText
                        text={contactTexts[currentTextIndex]}
                        enableWaves={true}
                        asciiFontSize={6}
                        textFontSize={60}
                        textColor="#fdf9f3"
                        planeBaseHeight={4}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative z-[1] w-full py-8 md:py-12 px-4 sm:px-8 md:px-16 border-t border-white/5">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 md:space-y-5">
            {/* Main Footer Text with FuzzyText */}
            <div className="flex flex-col items-center space-y-2 md:space-y-3 text-center">
              {/* Made with love */}
              <div className="relative w-full flex justify-center">
                <FuzzyText
                  baseIntensity={0.12}
                  hoverIntensity={0.35}
                  enableHover={true}
                  fontSize="clamp(0.875rem, 2vw, 1.125rem)"
                  fontWeight={500}
                  color="#FFFFFF"
                  gradient={['#3A29FF', '#FF94B4', '#FF3232']}
                  fuzzRange={12}
                  direction="horizontal"
                  transitionDuration={300}
                  className="cursor-pointer opacity-70"
                >
                  Made with ❤️ by
                </FuzzyText>
              </div>

              {/* Name */}
              <div className="relative w-full flex justify-center">
                <FuzzyText
                  baseIntensity={0.18}
                  hoverIntensity={0.45}
                  enableHover={true}
                  fontSize="clamp(1.25rem, 3vw, 2rem)"
                  fontWeight={800}
                  color="#FFFFFF"
                  gradient={['#3A29FF', '#FF94B4', '#FF3232']}
                  fuzzRange={18}
                  direction="horizontal"
                  transitionDuration={350}
                  clickEffect={true}
                  className="cursor-pointer"
                >
                  saadmdev
                </FuzzyText>
              </div>
            </div>

            {/* Additional info */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-white/50 text-xs md:text-sm">
              <span>© {new Date().getFullYear()} Muhammad Saad</span>
              <span className="hidden md:inline text-white/20">•</span>
              <a
                href="https://github.com/saadmdev"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF94B4] transition-colors duration-200 flex items-center gap-1.5"
              >
                <FaGithub className="text-sm" />
                <span>GitHub</span>
              </a>
              <span className="hidden md:inline text-white/20">•</span>
              <a
                href="https://www.linkedin.com/in/muhammad-saad-a4779b38a/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF3232] transition-colors duration-200 flex items-center gap-1.5"
              >
                <FaLinkedin className="text-sm" />
                <span>LinkedIn</span>
              </a>
              <span className="hidden md:inline text-white/20">•</span>
              <a
                href="mailto:devsaadm@gmail.com"
                className="hover:text-[#3A29FF] transition-colors duration-200 flex items-center gap-1.5"
              >
                <FaEnvelope className="text-sm" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
