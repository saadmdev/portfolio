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
import Carousel from '@/components/Carousel';
import RotatingText from '@/components/RotatingText';
import FuzzyText from '@/components/FuzzyText';
import ocean from '@/assets/ocean.png';
import university from '@/assets/university.jpg';
import pathfinder from '@/assets/pathfinder.jpg';
import ecommerce from '@/assets/ecommerce.png';
import carrental from '@/assets/CarRental.png';

interface Project {
  id: number;
  title: string;
  image: string;
  description: string;
  tools: string[];
  githubUrl?: string;
  liveUrl?: string;
}

// Tilted Project Card Component
const TiltedProjectCard = ({ project, onClick }: { project: Project; onClick: () => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, { damping: 30, stiffness: 100, mass: 2 });
  const rotateY = useSpring(0, { damping: 30, stiffness: 100, mass: 2 });
  const scale = useSpring(1, { damping: 30, stiffness: 100, mass: 2 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
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
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer h-[260px] md:h-[320px] lg:h-[360px] [perspective:1000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <motion.div
        className="relative w-full h-full rounded-[15px] overflow-hidden"
        style={{
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
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
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
      title: "Pathfinding Visualizer",
      image: typeof pathfinder === 'string' ? pathfinder : pathfinder.src,
      description: "A pathfinding visualizer that allows you to visualize the pathfinding algorithms like Dijkstra's, A*, Depth-First Search (DFS) ,and Breadth-First Search .",
      tools: ["React", "Tailwind CSS", "Vite", "JavaScript"],
      githubUrl: "https://github.com/saadmdev/Pathfinding-Visualizer",
      liveUrl: "https://saadmdev.github.io/Pathfinding-Visualizer/"
    },
    {
      id: 6,
      title: "University_Website",
      image: typeof university === 'string' ? university : university.src,
      description: "A website for a university that allows you to view the university's courses, programs, and events.",
      tools: ["Html", "Css", "JavaScript", "Php", "Static Assets"],
      githubUrl: "https://github.com/saadmdev/University_Website",
      liveUrl: "https://saadmdev.github.io/University_Website/"
    }
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
        logo="/logo.svg"
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
            <div className="flex flex-col justify-center space-y-6 md:space-y-8 fade-in-up text-center lg:text-left">
              {/* Main Name with TextPressure */}
              <div className="relative h-[120px] sm:h-[140px] md:h-[180px] min-h-[80px]">
                <TextPressure
                  text="MUHAMMAD SAAD"
                  textColor="#FFFFFF"
                  strokeColor="#3A29FF"
                  stroke={true}
                  strokeWidth={3}
                  minFontSize={nameMinFont}
                  width={true}
                  weight={true}
                  italic={true}
                  className="text-white font-black"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-4">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light">
                  <TextPressure
                    text="Software Engineer Full Stack | AI"
                    textColor="#FFFFFF"
                    strokeColor="#3A29FF"
                    stroke={true}
                    strokeWidth={2}
                    minFontSize={24}
                    width={true}
                    weight={true}
                    italic={false}
                    className="text-white/90 font-light"
                  />
                </div>

                {/* Rotating Tagline */}
                <div className="relative w-full mx-auto lg:mx-0 max-w-[700px]">
                  <RotatingText
                    texts={[
                      'Building Scalable Solutions',
                      'Transforming Ideas Into Reality',
                      'Innovation Through Code'
                    ]}
                    delay={3500}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Carousel */}
            <div className="flex items-center justify-center lg:justify-end fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-full flex justify-center">
                <Carousel
                  baseWidth={550}
                  autoplay={true}
                  autoplayDelay={2000}
                  pauseOnHover={true}
                  loop={true}
                  round={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-[1] w-full py-20 md:py-32 px-4 sm:px-8 md:px-16">
        <div className="w-full max-w-7xl mx-auto">
          {/* Introduction */}
          <div className="mb-16 md:mb-24 text-center fade-in-up">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
              <span className="animated-gradient-text">Introduction</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mb-8"></div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/90 mb-6">
              Overview
            </h3>
            <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              I'm a passionate <span className="animated-gradient-text font-semibold">Software Engineering</span> student specializing in modern web applications and AI solutions. With expertise in the <span className="color-rotate font-semibold">MERN stack</span> and <span className="color-rotate font-semibold">Python</span>, I create user-friendly interfaces and robust backend systems. I thrive on transforming complex problems into elegant solutions and am always eager to collaborate on impactful projects. Let's build something amazing together!
            </p>
          </div>

          {/* Skills Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Web Developer Card */}
            <div className="group">
              <ElectricBorder
                color="#3A29FF"
                speed={1}
                chaos={0.5}
                thickness={2}
                style={{ borderRadius: 16 }}
                className="h-full transition-transform duration-300 group-hover:scale-105"
              >
                <div className="p-6 md:p-8 h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#3A29FF]/15 via-[#3A29FF]/5 to-transparent backdrop-blur-md min-h-[220px] md:min-h-[260px] rounded-2xl border border-white/10 transition-all duration-300 group-hover:border-white/20">
                  <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                    <FaCode className="text-5xl md:text-6xl text-[#3A29FF] drop-shadow-[0_0_15px_rgba(58,41,255,0.6)]" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">
                    Web Developer
                  </h3>
                  <p className="text-white/70 text-sm md:text-base leading-relaxed">
                    Building modern, responsive web applications with cutting-edge technologies
                  </p>
                </div>
              </ElectricBorder>
            </div>

            {/* React Native Developer Card */}
            <div className="group">
              <ElectricBorder
                color="#FF94B4"
                speed={1}
                chaos={0.5}
                thickness={2}
                style={{ borderRadius: 16 }}
                className="h-full transition-transform duration-300 group-hover:scale-105"
              >
                <div className="p-6 md:p-8 h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#FF94B4]/15 via-[#FF94B4]/5 to-transparent backdrop-blur-md min-h-[220px] md:min-h-[260px] rounded-2xl border border-white/10 transition-all duration-300 group-hover:border-white/20">
                  <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                    <FaMobileAlt className="text-5xl md:text-6xl text-[#FF94B4] drop-shadow-[0_0_15px_rgba(255,148,180,0.6)]" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">
                    React Native Developer
                  </h3>
                  <p className="text-white/70 text-sm md:text-base leading-relaxed">
                    Creating cross-platform mobile experiences with React Native
                  </p>
                </div>
              </ElectricBorder>
            </div>

            {/* AI/ML Developer Card */}
            <div className="group">
              <ElectricBorder
                color="#FF3232"
                speed={1}
                chaos={0.5}
                thickness={2}
                style={{ borderRadius: 16 }}
                className="h-full transition-transform duration-300 group-hover:scale-105"
              >
                <div className="p-6 md:p-8 h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#FF3232]/15 via-[#FF3232]/5 to-transparent backdrop-blur-md min-h-[220px] md:min-h-[260px] rounded-2xl border border-white/10 transition-all duration-300 group-hover:border-white/20">
                  <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                    <FaRobot className="text-5xl md:text-6xl text-[#FF3232] drop-shadow-[0_0_15px_rgba(255,50,50,0.6)]" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">
                    AI/ML Developer
                  </h3>
                  <p className="text-white/70 text-sm md:text-base leading-relaxed">
                    Crafting intelligent solutions with AI and machine learning
                  </p>
                </div>
              </ElectricBorder>
            </div>

            {/* SaaS Developer Card */}
            <div className="group">
              <ElectricBorder
                color="#7cff67"
                speed={1}
                chaos={0.5}
                thickness={2}
                style={{ borderRadius: 16 }}
                className="h-full transition-transform duration-300 group-hover:scale-105"
              >
                <div className="p-6 md:p-8 h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#7cff67]/15 via-[#7cff67]/5 to-transparent backdrop-blur-md min-h-[220px] md:min-h-[260px] rounded-2xl border border-white/10 transition-all duration-300 group-hover:border-white/20">
                  <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                    <FaCloud className="text-5xl md:text-6xl text-[#7cff67] drop-shadow-[0_0_15px_rgba(124,255,103,0.6)]" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">
                    SaaS Developer
                  </h3>
                  <p className="text-white/70 text-sm md:text-base leading-relaxed">
                    Building scalable cloud-based software solutions
                  </p>
                </div>
              </ElectricBorder>
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
      <section id="projects" className="relative z-[1] w-full py-8 md:py-10 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="w-full max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-6 md:mb-8 text-center fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
              <span className="animated-gradient-text">Projects</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"></div>
          </div>

          {/* Projects Grid */}
          <div className="fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {projects.map((project) => (
                <TiltedProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#060010] via-[#1a0a2e] to-[#060010] rounded-3xl border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-200 hover:scale-110"
              >
                <FaTimes className="text-lg" />
              </button>

              {/* Project Image */}
              <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-t-3xl">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060010] via-transparent to-transparent"></div>
              </div>

              {/* Project Content */}
              <div className="p-6 md:p-8">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                  <span className="animated-gradient-text">{selectedProject.title}</span>
                </h2>

                <p className="text-white/80 text-base md:text-lg leading-7 mb-6">
                  {selectedProject.description}
                </p>

                {/* Tools & Technologies */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <FaCode className="text-[#3A29FF]" />
                    Tools & Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tools.map((tool, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium backdrop-blur-sm hover:bg-white/20 transition-colors"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-4">
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#3A29FF] to-[#FF94B4] text-white font-semibold hover:scale-105 transition-transform duration-200 shadow-lg shadow-[#3A29FF]/50"
                    >
                      <FaGithub className="text-lg" />
                      View on GitHub
                    </a>
                  )}
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                    >
                      <FaExternalLinkAlt className="text-lg" />
                      Live Demo
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

              {/* Right Column - Animated Visualization */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#060010] to-[#1a0a2e] border border-white/20 shadow-xl min-h-[600px]">
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
