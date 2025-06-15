'use client';

import React, { useRef, useEffect, useState } from 'react';
import { SkillsPreview } from './components/SkillsPreview';
import { ProjectsSection } from './projects/page';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  ChevronDown,
  Github,
  Linkedin,
  User,
  Mail,
  Phone,
  MapPin,
  Code,
  Palette,
  Database,
  Smartphone,
  LucideIcon,
  Twitter,
  BookOpenText, Facebook
} from 'lucide-react';

// 3D Scene Component using vanilla Three.js
function ThreeJSScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

  type SphereUserData = {
    originalY: number;
    speed: number;
    rotationSpeed: { x: number; y: number };
  };

  // Define the sphere type including userData
  type SphereWithData = THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial> & {
    userData: SphereUserData;
  };

  useEffect(() => {

    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Create animated spheres
    const spheres: SphereWithData[] = [];

    const sphereData = [
      { position: [-4, 2, -3] as [number, number, number], color: 0x6366f1, scale: 0.8 },
      { position: [4, -2, -4] as [number, number, number], color: 0x8b5cf6, scale: 0.6 },
      { position: [0, 3, -5] as [number, number, number], color: 0x06b6d4, scale: 0.4 },
      { position: [-3, -3, -2] as [number, number, number], color: 0xf59e0b, scale: 0.5 },
      { position: [3, 1, -6] as [number, number, number], color: 0x10b981, scale: 0.7 }
    ];

    sphereData.forEach((data) => {
      const geometry = new THREE.SphereGeometry(data.scale, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: data.color,
        metalness: 0.8,
        roughness: 0.2,
        emissive: data.color,
        emissiveIntensity: 0.1
      });

      const sphere = new THREE.Mesh(geometry, material) as SphereWithData;
      sphere.userData = {
        originalY: data.position[1],
        speed: Math.random() * 0.02 + 0.01,
        rotationSpeed: {
          x: Math.random() * 0.02,
          y: Math.random() * 0.02
        }
      };

      sphere.position.set(...data.position);
      scene.add(sphere);
      spheres.push(sphere);
    });

    // Create main platform
    const platformGeometry = new THREE.BoxGeometry(4, 0.2, 4);
    const platformMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      metalness: 0.8,
      roughness: 0.2
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.set(0, 0, 0);
    scene.add(platform);

    // Camera position
    camera.position.set(0, 0, 8);

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.01;

      // Animate spheres
      spheres.forEach((sphere) => {
        sphere.rotation.x += sphere.userData.rotationSpeed.x;
        sphere.rotation.y += sphere.userData.rotationSpeed.y;
        sphere.position.y = sphere.userData.originalY + Math.sin(time * sphere.userData.speed * 10) * 0.3;
      });

      // Animate platform
      platform.rotation.y += 0.005;
      platform.position.y = Math.sin(time * 2) * 0.1;

      // Auto-rotate camera
      camera.position.x = Math.cos(time * 0.1) * 8;
      camera.position.z = Math.sin(time * 0.1) * 8;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" style={{ zIndex: 0 }} />;
}

interface SkillCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

// Floating Particles Component
function FloatingParticles() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-20"
                animate={{
                  x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                  y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                style={{
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                }}
            />
        ))}
      </div>
  );
}

function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      // For navbar background effect
      setIsScrolled(window.scrollY > 50);

      // For active section detection
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      let closestSection = '';
      let closestDistance = Infinity;

      sections.forEach((section) => {
        const element = section as HTMLElement;
        const rect = element.getBoundingClientRect();
        const sectionMiddle = rect.top + rect.height / 2;
        const distanceFromCenter = Math.abs(window.innerHeight / 2 - sectionMiddle);

        if (distanceFromCenter < closestDistance) {
          closestDistance = distanceFromCenter;
          closestSection = element.id;
        }
      });

      setActiveSection(closestSection);
    };

    // Set initial state
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
      <motion.nav
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
              isScrolled ? 'bg-gray-900/80 backdrop-blur-md border-b border-gray-800' : 'bg-transparent'
          }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            >
              NM Portfolio
            </motion.div>

            <div className="hidden md:flex space-x-8">
              {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item, index) => {
                const sectionId = item.toLowerCase();
                const isActive = activeSection === sectionId;

                return (
                    <motion.a
                        key={item}
                        href={`#${sectionId}`}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className={`relative transition-colors duration-300 ${
                            isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                        }`}
                    >
                      {item}
                      <motion.div
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: isActive ? 1 : 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.25, 0.1, 0.25, 1]
                          }}
                      />
                    </motion.a>
                );
              })}
            </div>
          </div>
        </div>
      </motion.nav>
  );
}

// Hero Section
function HeroSection() {

  const { ref, inView } = useInView({
    triggerOnce: false, // <--- IMPORTANT: allows multiple triggers
    threshold: 0.2, // Adjusts how much should be visible before animation triggers
  });

  return (
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <ThreeJSScene />
        <FloatingParticles />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-900/80 z-5" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8 }}
          >
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="mb-6"
            >
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent pb-2">
                Nadeesha Medagama
              </h1>
              <motion.div
                  className="mt-4 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: 200 }}
                  transition={{ duration: 1, delay: 0.8 }}
              />
            </motion.div>

            <motion.p
                className="text-xl md:text-2xl text-gray-300 mb-8 font-light"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
              DevOps Enthusiast | Cloud & Automation Explorer
            </motion.p>

            <motion.p
                className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
              Passionate about automating development workflows and building scalable apps with Docker, Kubernetes, CI/CD, and cloud platforms.
              Bridging DevOps and full stack development.
            </motion.p>

            <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{opacity: 0, y: 30}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.8, delay: 0.8}}
            >
              <a href="#projects">
                <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)",
                      y: -2
                    }}
                    whileTap={{scale: 0.95}}
                    className="cursor-pointer px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                >
                  View My Work
                </motion.button>
              </a>

              <a href="https://drive.google.com/file/d/1pXOylQ8dbasXfXmqWrM7ypiRliXHHzsQ/view?usp=sharing"
                 target="_blank"
                 rel="noopener noreferrer"
              >
                <motion.button
                    whileHover={{scale: 1.05, y: -2}}
                    whileTap={{scale: 0.95}}
                    className="cursor-pointer px-8 py-3 border-2 border-gray-600 text-gray-300 font-semibold rounded-full hover:bg-gray-800 hover:border-gray-500 transition-all duration-300"
                >
                  Download CV
                </motion.button>
              </a>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
          >
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-gray-400 cursor-pointer"
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
            <p className="text-xs text-gray-500 mt-2">Scroll Down</p>
          </motion.div>
        </div>
      </section>
  );
}

// About Section
function AboutSection() {

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  return (
      <section id="about" className="py-20 px-6 bg-gradient-to-b from-gray-900/50 to-gray-800/50 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false }}
              className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              About Me
            </h2>
            <motion.div
                className="h-1 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto rounded-full mb-8"
                initial={{ width: 0 }}
                whileInView={{ width: 100 }}
                transition={{ duration: 1 }}
                viewport={{ once: false }}
            />
            <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
              I'm a DevOps and cloud enthusiast passionate about automation and scalable infrastructure.
              I specialize in CI/CD, cloud platforms, and streamlining development workflows.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
                initial={{opacity: 0, x: -50}}
                whileInView={{opacity: 1, x: 0}}
                transition={{duration: 0.8, delay: 0.2}}
                viewport={{once: false}}
                className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-white mb-6">My Journey</h3>
              <p className="text-gray-400 leading-relaxed">
                Started as a curious tech enthusiast, I've evolved into a DevOps engineer passionate about building
                automated, efficient, and scalable cloud infrastructures.
                I believe in leveraging the power of automation and cloud-native tools to streamline processes and solve
                real-world operational challenges.
              </p>
              <p className="text-gray-400 leading-relaxed">
                When I'm not automating workflows or managing deployments, you'll find me exploring emerging DevOps
                tools, contributing to community projects, or helping others learn the cloud.
                I'm always eager to embrace new challenges and push the limits of what's possible in modern software
                delivery.
              </p>

              <motion.div
                  className="flex space-x-6 pt-4"
                  initial={{opacity: 0, y: 20}}
                  whileInView={{opacity: 1, y: 0}}
                  transition={{duration: 0.6, delay: 0.4}}
                  viewport={{once: false}}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-400">1+</div>
                  <div className="text-gray-400 text-sm">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">10+</div>
                  <div className="text-gray-400 text-sm">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">15+</div>
                  <div className="text-gray-400 text-sm">DevOps Tools</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
                initial={{opacity: 0, x: 50}}
                whileInView={{opacity: 1, x: 0}}
                transition={{duration: 0.8, delay: 0.4}}
                viewport={{once: false}}
                className="relative w-[87%] mx-auto"
            >
              <div
                  className="relative group cursor-pointer transform-gpu transition-all duration-500
                  ease-out scale-87 hover:scale-92"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;

                    e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(50px)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
                  }}
              >
                {/* 3D Frame Container */}
                <div className="relative">
                  {/* Glowing Border */}
                  <div
                      className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>

                  {/* Main Photo Container */}
                  <div
                      className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 shadow-2xl transform transition-all duration-500">
                    {/* Inner Glow */}
                    <div
                        className="absolute inset-2 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 rounded-2xl"></div>

                    {/* Photo Frame */}
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                      {/* Placeholder for your photo - Replace src with your actual photo */}
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <img
                            src="/images/me.jpeg"
                            alt="Nadeesha"
                            className="w-full h-full object-cover"
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                      </div>

                      {/* Overlay Effects */}
                      <div
                          className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* 3D Accent Lines */}
                    <div
                        className="absolute top-0 left-0 w-20 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
                    <div
                        className="absolute bottom-0 right-0 w-20 h-1 bg-gradient-to-l from-purple-500 to-transparent rounded-full"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
  );
}

// Contact Section
function ContactSection() {

  const { ref, inView } = useInView({
    triggerOnce: false, // <--- IMPORTANT: allows multiple triggers
    threshold: 0.2, // Adjusts how much should be visible before animation triggers
  });

  return (
      <section id="contact" className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
              ref={ref}
              initial={{opacity: 0, y: 50}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.8}}
              viewport={{once: false }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Let's Connect
            </h2>
            <motion.div
                className="h-1 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto rounded-full mb-8"
                initial={{width: 0}}
                whileInView={{width: 100}}
                transition={{duration: 1}}
                viewport={{once: false}}
            />
            <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
              Ready to bring your ideas to life? Let's discuss how we can work together
              to create something amazing.
            </p>
          </motion.div>

          <motion.div
              initial={{opacity: 0, y: 50}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.8, delay: 0.2}}
              viewport={{once: false}}
              className="grid md:grid-cols-3 gap-8 mb-12"
          >
            <motion.div
                whileHover={{scale: 1.05, y: -5}}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6
                hover:border-indigo-500 transition-all duration-300 min-w-[300px] -ml-5"
            >
              <Mail className="w-8 h-8 text-indigo-400 mx-auto mb-4"/>
              <h3 className="text-white font-semibold mb-2">Email</h3>
              <p className="text-gray-400 ">nadeeshamedagama123@gmail.com</p>
            </motion.div>

            <motion.div
                whileHover={{scale: 1.05, y: -5}}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all duration-300"
            >
              <Phone className="w-8 h-8 text-purple-400 mx-auto mb-4"/>
              <h3 className="text-white font-semibold mb-2">Phone</h3>
              <p className="text-gray-400">+94 76 646 0393</p>
            </motion.div>

            <motion.div
                whileHover={{scale: 1.05, y: -5}}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-cyan-500 transition-all duration-300"
            >
              <MapPin className="w-8 h-8 text-cyan-400 mx-auto mb-4"/>
              <h3 className="text-white font-semibold mb-2">Location</h3>
              <p className="text-gray-400">Bandaragama, Kalutara</p>
            </motion.div>
          </motion.div>

          <motion.div
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.8, delay: 0.4}}
              viewport={{once: false }}
              className="flex justify-center space-x-6"
          >
            {[
              { icon: Github, href: "https://github.com/NadeeshaMedagama", color: "hover:text-gray-300", bgColor: "hover:bg-gray-700" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/nadeesha-medagama-5aa827287/", color: "hover:text-blue-400", bgColor: "hover:bg-blue-900/20" },
              { icon: Mail, href: "nadeeshamedagama123@gmail.com", color: "hover:text-indigo-400", bgColor: "hover:bg-indigo-900/20" },
              { icon: BookOpenText, href: "hhttps://medium.com/@nadeeshamedagama", color: "hover:text-emerald-400", bgColor: "hover:bg-emerald-900/20"},
              { icon: Twitter, href: "https://x.com/NadeeshaMe36209",color: "hover:text-sky-400",bgColor: "hover:bg-sky-900/20"},
              { icon: Facebook, href: "https://facebook.com/nadeesha.medagama/",color: "hover:text-yellow-300",bgColor: "hover:bg-yellow-900/20"}
            ].map((social, index) => (
                <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-full border border-gray-700 text-gray-500 ${social.color} ${social.bgColor} transition-all duration-300`}
                >
                  <social.icon className="w-6 h-6" />
                </motion.a>
            ))}
          </motion.div>
        </div>
      </section>
  );
}

// Main Portfolio Component
export default function Portfolio() {
  return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen text-white overflow-x-hidden">
        <Navigation />
        <HeroSection />
        <AboutSection />
        <SkillsPreview />
        <ProjectsSection />
        <ContactSection />
      </div>
  );
}
