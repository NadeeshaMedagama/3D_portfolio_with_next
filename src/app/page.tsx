'use client';

import React, { useRef, useEffect, useState } from 'react';
import { SkillsPreview } from './components/SkillsPreview';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Code,
  Palette,
  Database,
  Smartphone,
  LucideIcon
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

// Skill Card Component
function SkillCard({ icon: Icon, title, description, delay = 0 }: SkillCardProps) {
  return (
      <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/50 transition-all duration-300 group"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
          </div>
        </div>
      </motion.div>
  );
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

// Navigation Component
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
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
                className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            >
              Portfolio
            </motion.div>
            <div className="hidden md:flex space-x-8">
              {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item, index) => (
                  <motion.a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="text-gray-300 hover:text-white transition-colors duration-300 relative"
                  >
                    {item}
                    <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                  </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>
  );
}

// Hero Section
function HeroSection() {
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
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
          >
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="mb-6"
            >
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)",
                    y: -2
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
              >
                View My Work
              </motion.button>

              <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 border-2 border-gray-600 text-gray-300 font-semibold rounded-full hover:bg-gray-800 hover:border-gray-500 transition-all duration-300"
              >
                Download CV
              </motion.button>
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
  return (
      <section id="about" className="py-20 px-6 bg-gradient-to-b from-gray-900/50 to-gray-800/50 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
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
                viewport={{ once: true }}
            />
            <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
              I'm a passionate developer who loves creating immersive digital experiences.
              With expertise in modern web technologies and 3D graphics, I bring ideas to life
              through code and creativity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-white mb-6">My Journey</h3>
              <p className="text-gray-400 leading-relaxed">
                Started as a curious developer, I've evolved into someone who specializes in creating
                interactive 3D web experiences. I believe in the power of technology to solve real-world
                problems and create meaningful digital experiences.
              </p>
              <p className="text-gray-400 leading-relaxed">
                When I'm not coding, you'll find me exploring new technologies, contributing to open-source
                projects, or mentoring fellow developers. I'm always excited to take on new challenges
                and push the boundaries of what's possible on the web.
              </p>

              <motion.div
                  className="flex space-x-6 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-400">3+</div>
                  <div className="text-gray-400 text-sm">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">50+</div>
                  <div className="text-gray-400 text-sm">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">20+</div>
                  <div className="text-gray-400 text-sm">Happy Clients</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <SkillCard
                  icon={Code}
                  title="Frontend"
                  description="React, Next.js, TypeScript"
                  delay={0}
              />
              <SkillCard
                  icon={Database}
                  title="Backend"
                  description="Node.js, Python, PostgreSQL"
                  delay={0.1}
              />
              <SkillCard
                  icon={Palette}
                  title="3D Graphics"
                  description="Three.js, WebGL, Blender"
                  delay={0.2}
              />
              <SkillCard
                  icon={Smartphone}
                  title="Mobile"
                  description="React Native, Flutter"
                  delay={0.3}
              />
            </motion.div>
          </div>
        </div>
      </section>
  );
}

// Contact Section
function ContactSection() {
  return (
      <section id="contact" className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Let's Connect
            </h2>
            <motion.div
                className="h-1 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto rounded-full mb-8"
                initial={{ width: 0 }}
                whileInView={{ width: 100 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
            />
            <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
              Ready to bring your ideas to life? Let's discuss how we can work together
              to create something amazing.
            </p>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8 mb-12"
          >
            <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-indigo-500 transition-all duration-300"
            >
              <Mail className="w-8 h-8 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Email</h3>
              <p className="text-gray-400">your.email@example.com</p>
            </motion.div>

            <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all duration-300"
            >
              <Phone className="w-8 h-8 text-purple-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Phone</h3>
              <p className="text-gray-400">+1 (555) 123-4567</p>
            </motion.div>

            <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-cyan-500 transition-all duration-300"
            >
              <MapPin className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Location</h3>
              <p className="text-gray-400">Your City, Country</p>
            </motion.div>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex justify-center space-x-6"
          >
            {[
              { icon: Github, href: "#", color: "hover:text-gray-300", bgColor: "hover:bg-gray-700" },
              { icon: Linkedin, href: "#", color: "hover:text-blue-400", bgColor: "hover:bg-blue-900/20" },
              { icon: Mail, href: "#", color: "hover:text-indigo-400", bgColor: "hover:bg-indigo-900/20" }
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
        <ContactSection />
      </div>
  );
}
