/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Howl } from 'howler';
import Lenis from 'lenis';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  ExternalLink, 
  Code2, 
  Cpu, 
  Globe, 
  Zap, 
  ChevronRight,
  Menu,
  X,
  ArrowUpRight,
  Volume2,
  VolumeX
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- 3D Components ---

const CyberTunnel = () => {
  const { scrollYProgress } = useScroll();
  const speed = useTransform(scrollYProgress, [0, 1], [0.5, 5]);
  const tunnelRef = useRef<THREE.Group>(null);
  
  // Dynamic color based on scroll
  const color = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    ["#f0ff00", "#00d2ff", "#ff00ff", "#f0ff00"]
  );

  useFrame((state) => {
    if (tunnelRef.current) {
      tunnelRef.current.rotation.z += 0.001;
      state.camera.position.z -= speed.get() * 0.05;
      if (state.camera.position.z < -100) state.camera.position.z = 0;
      
      // Update ring colors
      tunnelRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
          child.material.color.set(color.get());
        }
      });
    }
  });

  const rings = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      position: [0, 0, -i * 10],
      rotation: [0, 0, Math.random() * Math.PI],
      scale: 1 + Math.random() * 0.5
    }));
  }, []);

  return (
    <group ref={tunnelRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={ring.position as [number, number, number]} rotation={ring.rotation as [number, number, number]}>
          <torusGeometry args={[10, 0.05, 16, 100]} />
          <meshBasicMaterial color="#f0ff00" transparent opacity={0.1 - (i * 0.005)} />
        </mesh>
      ))}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
};

const Background3D = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-black">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <CyberTunnel />
      </Canvas>
      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%] z-10 opacity-20" />
      <div className="absolute inset-0 pointer-events-none bg-noise opacity-[0.03] z-10" />
    </div>
  );
};

// --- Components ---

const Tooltip = ({ children, text }: { children: React.ReactNode, text: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-apex-yellow text-black text-[10px] font-mono uppercase tracking-widest whitespace-nowrap z-[100] pointer-events-none"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-apex-yellow" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
  soundRef.current = new Howl({
    src: ['https://assets.mixkit.co/sfx/preview/mixkit-deep-hum-ambient-2475.mp3'],
    loop: true,
    volume: 0.2,
    html5: true // Streams the audio instead of downloading the whole buffer
  });
  return () => { soundRef.current?.unload(); };
}, []);

  const toggleMute = () => {
    if (isMuted) {
      soundRef.current?.play();
    } else {
      soundRef.current?.pause();
    }
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-4",
      scrolled ? "bg-apex-black/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-display font-bold text-2xl tracking-tighter flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-apex-yellow flex items-center justify-center text-black rotate-12">
            <span className="font-black -rotate-12">A</span>
          </div>
          <span>APEX<span className="text-apex-yellow">.</span>DEV</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <button 
            onClick={toggleMute}
            className="text-gray-500 hover:text-apex-yellow transition-colors"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-500"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            System Active
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

// --- New Helper Component: Magnetic Interaction ---
const MagneticWrapper = ({ children, pull = 0.5 }: { children: React.ReactNode, pull?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * pull;
    const y = (clientY - (top + height / 2)) * pull;
    setPosition({ x, y });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector('#projects');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        mass: 1,
        duration: 0.8, 
      }
    },
  };

  return (
    <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden px-6">
      {/* Chapter Marker */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 z-20">
        <span className="font-mono text-[10px] uppercase tracking-[0.5em] [writing-mode:vertical-lr] text-apex-yellow">Chapter</span>
        <div className="w-[1px] h-20 bg-apex-yellow/30" />
        <span className="font-display font-black text-4xl text-apex-yellow">01</span>
      </div>

      {/* Vertical Side Text */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block z-20">
        <span className="font-display font-black text-[10vh] text-stroke opacity-10 [writing-mode:vertical-lr] uppercase tracking-tighter">
          The Beginning
        </span>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-apex-yellow/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        
        {/* Data Stream Effect */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -1000 }}
              animate={{ y: 1000 }}
              transition={{ 
                duration: 10 + Math.random() * 20, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 10
              }}
              className="absolute text-apex-yellow font-mono text-[10px] whitespace-nowrap"
              style={{ left: `${i * 10}%` }}
            >
              {Array(50).fill(0).map(() => Math.random().toString(36).substring(7)).join(' ')}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-5xl"
      >
        <motion.div variants={itemVariants} className="mb-4">
          <Tooltip text="System Status: Operational">
            <span className="font-mono text-apex-yellow text-sm tracking-[0.3em] uppercase flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-apex-yellow rounded-full animate-ping" />
              Full Stack Software Engineer
            </span>
          </Tooltip>
        </motion.div>

        <motion.h1
          style={{ y: y1 }}
          className="text-[12vw] md:text-[10vw] leading-[0.85] font-black mb-6"
        >
          <motion.span variants={itemVariants} className="block glitch-hover cursor-default">
            AMMAR
          </motion.span>
          <motion.span variants={itemVariants} className="block text-stroke-yellow glitch-hover cursor-default">
            GLITCH
          </motion.span>
          <motion.span variants={itemVariants} className="block glitch-hover cursor-default">
            CODE
          </motion.span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="max-w-xl mx-auto text-gray-400 text-lg md:text-xl font-light leading-relaxed mb-10"
        >
          Engineering digital engines that don't just run—they dominate. From low-latency backends to pixel-perfect interfaces.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-6"
        >
          <Tooltip text="Explore my portfolio">
            <MagneticWrapper pull={0.3}>
              <motion.a 
                href="#projects"
                onClick={scrollToProjects}
                className="btn-racing bg-white text-black no-underline flex items-center gap-2 group cursor-pointer"
              >
                View Projects <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.a>
            </MagneticWrapper>
          </Tooltip>

          <Tooltip text="Learn about my journey">
            <MagneticWrapper pull={0.3}>
              <button className="btn-racing border-2 border-white/20 text-white hover:bg-white/10 transition-all cursor-pointer">
                My Story
              </button>
            </MagneticWrapper>
          </Tooltip>
        </motion.div>
      </motion.div>

      {/* Magnetic Social Icons */}
      <div className="absolute right-10 bottom-10 hidden lg:flex flex-col gap-6 z-20">
        {[Github, Linkedin, Twitter].map((Icon, i) => (
          <MagneticWrapper key={i} pull={0.5}>
            <motion.a 
              href="#" 
              whileHover={{ color: '#f0ff00' }}
              className="text-white/30 transition-colors cursor-pointer block p-2"
            >
              <Icon size={20} />
            </motion.a>
          </MagneticWrapper>
        ))}
      </div>

      {/* Live Telemetry Widget */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute left-10 bottom-10 hidden xl:block bg-black/40 backdrop-blur-md p-6 border-l-4 border-l-apex-yellow"
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
          <Zap size={10} className="text-apex-yellow" /> Live Telemetry
        </div>
        <div className="space-y-3">
          {[
            { label: "CPU LOAD", value: "24%", color: "bg-apex-yellow" },
            { label: "LATENCY", value: "12ms", color: "bg-blue-500" },
            { label: "UPTIME", value: "99.9%", color: "bg-green-500" },
          ].map((item) => (
            <div key={item.label} className="w-48">
              <div className="flex justify-between text-[10px] font-mono mb-1">
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
              <div className="h-1 bg-white/10 w-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: item.value }}
                  transition={{ duration: 2, delay: 2.5 }}
                  className={`h-full ${item.color}`} 
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-white" />
      </motion.div>
    </section>
  );
};

const Marquee = () => {
  const skills = ["React", "TypeScript", "Node.js", "Next.js", "Tailwind", "PostgreSQL", "Docker", "AWS", "Python", "Go", "Rust", "GraphQL"];
  
  return (
    <div className="py-10 bg-apex-yellow overflow-hidden whitespace-nowrap border-y-4 border-black">
      <div className="flex animate-marquee">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center">
            {skills.map((skill) => (
              <span key={skill} className="text-black font-display font-black text-4xl md:text-6xl uppercase mx-8 flex items-center gap-4">
                {skill} <Zap size={32} fill="black" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectCard = ({ title, category, image, delay }: { title: string, category: string, image: string, delay: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useSpring(0, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(0, { stiffness: 300, damping: 30 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const scrollY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 20);
    mouseY.set(y * 20);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02, 
        y: -10,
        boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.5)"
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.215, 0.61, 0.355, 1],
        scale: { type: "spring", stiffness: 400, damping: 25 }
      }}
      className="group relative aspect-[4/5] overflow-hidden bg-apex-gray cursor-pointer z-0 hover:z-10"
    >
      <motion.div 
        style={{ 
          x: mouseX, 
          y: useTransform([mouseY, scrollY], ([my, sy]) => (my as number) + (sy as number)),
          scale: 1.1
        }}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
          referrerPolicy="no-referrer"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
      
      <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-500 group-hover:-translate-y-2">
        <span className="font-mono text-apex-yellow text-xs uppercase tracking-widest mb-2 block">
          {category}
        </span>
        <h3 className="text-3xl font-black leading-none mb-4">{title}</h3>
        <div className="flex items-center gap-2 text-white/50 group-hover:text-white transition-colors">
          <span className="text-sm font-display uppercase tracking-widest">Explore Project</span>
          <ChevronRight size={16} />
        </div>
      </div>

      <div className="absolute top-6 right-6 w-12 h-12 glass flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ExternalLink size={20} />
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const projects = [
    { title: "Velocity Engine", category: "Backend / Systems", image: "https://picsum.photos/seed/velocity/800/1000" },
    { title: "Cyber Grid UI", category: "Frontend / Design", image: "https://picsum.photos/seed/cyber/800/1000" },
    { title: "Apex Analytics", category: "Data / Visualization", image: "https://picsum.photos/seed/data/800/1000" },
    { title: "Quantum Cloud", category: "Infrastructure", image: "https://picsum.photos/seed/cloud/800/1000" },
  ];

  return (
    <section id="projects" className="py-24 px-6 max-w-7xl mx-auto relative">
      {/* Chapter Marker */}
      <div className="absolute -left-20 top-0 hidden xl:flex flex-col items-center gap-4 opacity-20">
        <span className="font-mono text-[10px] uppercase tracking-[0.5em] vertical-text">Chapter</span>
        <div className="w-[1px] h-20 bg-white" />
        <span className="font-display font-black text-4xl">02</span>
      </div>

      {/* Vertical Side Text */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block z-20">
        <span className="font-display font-black text-[10vh] text-stroke opacity-10 vertical-text uppercase tracking-tighter">
          The Pursuit
        </span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h2 className="text-6xl md:text-8xl font-black mb-6">Selected<br/><span className="text-stroke">Works</span></h2>
          <p className="text-gray-400 text-lg">A collection of high-performance applications built with modern stacks and a focus on user experience.</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex gap-4"
        >
          <div className="w-12 h-12 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">
            <ChevronRight className="rotate-180" />
          </div>
          <div className="w-12 h-12 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">
            <ChevronRight />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {projects.map((p, i) => (
          <ProjectCard key={p.title} {...p} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    { label: "Years Exp", value: "08", icon: <Zap className="text-apex-yellow" /> },
    { label: "Projects", value: "42", icon: <Code2 className="text-apex-yellow" /> },
    { label: "Commits", value: "12K", icon: <Cpu className="text-apex-yellow" /> },
    { label: "Uptime", value: "99.9", icon: <Globe className="text-apex-yellow" /> },
  ];

  return (
    <section id="about" className="py-24 bg-apex-gray border-y border-white/5 relative overflow-hidden">
      {/* Chapter Marker */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4 opacity-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.5em] vertical-text">Chapter</span>
        <div className="w-[1px] h-20 bg-white" />
        <span className="font-display font-black text-4xl">03</span>
      </div>

      {/* Vertical Side Text */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:block z-20">
        <span className="font-display font-black text-[10vh] text-stroke opacity-10 vertical-text uppercase tracking-tighter">
          Performance
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-4">{stat.icon}</div>
            <span className="text-5xl md:text-7xl font-black mb-2 font-display">{stat.value}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden">
      {/* Chapter Marker */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4 opacity-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.5em] vertical-text">Chapter</span>
        <div className="w-[1px] h-20 bg-white" />
        <span className="font-display font-black text-4xl">04</span>
      </div>

      {/* Vertical Side Text */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block z-20">
        <span className="font-display font-black text-[10vh] text-stroke opacity-10 vertical-text uppercase tracking-tighter">
          The Finish
        </span>
      </div>

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-apex-yellow to-transparent opacity-20" />
      
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-7xl md:text-9xl font-black mb-12 leading-none"
        >
          READY TO<br/><span className="text-apex-yellow">ACCELERATE?</span>
        </motion.h2>
        
        <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto">
          Currently accepting new projects and collaborations. If you have a vision that needs high-performance execution, let's talk.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <a 
            href="mailto:hello@apex.dev"
            className="w-full md:w-auto px-12 py-6 bg-apex-yellow text-black font-display font-black text-xl uppercase tracking-widest hover:bg-white transition-all"
          >
            Start a Conversation
          </a>
          <div className="flex gap-4">
            {[Github, Linkedin, Twitter].map((Icon, i) => (
              <a 
                key={i}
                href="#" 
                className="w-16 h-16 glass flex items-center justify-center hover:bg-apex-yellow hover:text-black transition-all"
              >
                <Icon size={24} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-white/5 bg-apex-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2 font-display font-bold text-xl">
          <div className="w-6 h-6 bg-apex-yellow flex items-center justify-center text-black rotate-12">
            <span className="font-black -rotate-12 text-xs">A</span>
          </div>
          <span>APEX<span className="text-apex-yellow">.</span>DEV</span>
        </div>
        
        <div className="flex gap-8 font-mono text-[10px] uppercase tracking-widest text-gray-500">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <span>© 2026 APEX ENGINEERING</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">System Status: Optimal</span>
        </div>
      </div>
    </footer>
  );
};

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === 'A' || (e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).closest('.cursor-pointer')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border border-apex-yellow rounded-full pointer-events-none z-[9999] hidden md:block"
      animate={{
        x: mousePos.x - 16,
        y: mousePos.y - 16,
        scale: isHovering ? 2.5 : 1,
        backgroundColor: isHovering ? 'rgba(240, 255, 0, 0.2)' : 'rgba(240, 255, 0, 0)',
      }}
      transition={{ type: 'spring', damping: 30, stiffness: 250, mass: 0.5 }}
    />
  );
};

// --- Main App ---

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 2000);
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen selection:bg-apex-yellow selection:text-black cursor-none bg-transparent">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 200 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-1 bg-apex-yellow mb-4"
            />
            <motion.span
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="font-mono text-[10px] uppercase tracking-[0.5em] text-apex-yellow"
            >
              Initializing Systems...
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <Background3D />
      <CustomCursor />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-apex-yellow z-[100] origin-left"
        style={{ scaleX }}
      />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Projects />
        <Stats />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
