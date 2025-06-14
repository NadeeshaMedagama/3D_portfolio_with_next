'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Server,
    Cloud,
    GitBranch,
    Container,
    Shield,
    Zap,
    Database,
    Globe,
    Terminal,
    Settings,
    Activity,
    Layers,
    ExternalLink,
    Github,
    ArrowRight,
    Cpu,
    HardDrive,
    Network
} from 'lucide-react';

// 3D Floating Tech Icons Scene
function TechIconsScene() {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationIdRef = useRef<number | null>(null);

    type TechObjectUserData = {
        originalPosition: THREE.Vector3;
        speed: number;
        rotationSpeed: { x: number; y: number; z: number };
        floatAmplitude: number;
    };

    type TechObjectWithData = THREE.Mesh<
        THREE.BoxGeometry | THREE.SphereGeometry | THREE.CylinderGeometry |
        THREE.OctahedronGeometry | THREE.TetrahedronGeometry | THREE.DodecahedronGeometry,
        THREE.MeshStandardMaterial
    > & {
        userData: TechObjectUserData;
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

        sceneRef.current = scene;
        rendererRef.current = renderer;

        // Enhanced lighting setup
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0x6366f1, 0.8);
        directionalLight1.position.set(10, 10, 5);
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0x8b5cf6, 0.6);
        directionalLight2.position.set(-10, -10, -5);
        scene.add(directionalLight2);

        const pointLight = new THREE.PointLight(0x06b6d4, 1, 100);
        pointLight.position.set(0, 0, 10);
        scene.add(pointLight);

        // Create floating tech objects
        const techObjects: TechObjectWithData[] = [];

        // Define tech shapes and colors representing DevOps tools
        const techData = [
            // Docker containers
            { shape: 'box', position: [-6, 3, -8], color: 0x2496ed, scale: [0.8, 0.6, 0.8] },
            { shape: 'box', position: [6, -2, -6], color: 0x2496ed, scale: [0.6, 0.8, 0.6] },

            // Kubernetes pods (octahedrons)
            { shape: 'octahedron', position: [-4, -3, -10], color: 0x326ce5, scale: [0.7, 0.7, 0.7] },
            { shape: 'octahedron', position: [4, 4, -7], color: 0x326ce5, scale: [0.9, 0.9, 0.9] },

            // AWS/Cloud spheres
            { shape: 'sphere', position: [0, 5, -9], color: 0xff9900, scale: [0.5, 0.5, 0.5] },
            { shape: 'sphere', position: [-5, 0, -12], color: 0xff9900, scale: [0.7, 0.7, 0.7] },

            // CI/CD pipelines (cylinders)
            { shape: 'cylinder', position: [5, 1, -11], color: 0x10b981, scale: [0.3, 1.2, 0.3] },
            { shape: 'cylinder', position: [-2, -4, -7], color: 0x10b981, scale: [0.4, 1.0, 0.4] },

            // Monitoring (tetrahedrons)
            { shape: 'tetrahedron', position: [2, -1, -13], color: 0xf59e0b, scale: [0.8, 0.8, 0.8] },
            { shape: 'tetrahedron', position: [-3, 2, -5], color: 0xf59e0b, scale: [0.6, 0.6, 0.6] },

            // Security shields (dodecahedrons)
            { shape: 'dodecahedron', position: [7, -4, -9], color: 0xef4444, scale: [0.5, 0.5, 0.5] },
            { shape: 'dodecahedron', position: [-7, 1, -8], color: 0xef4444, scale: [0.6, 0.6, 0.6] }
        ];

        techData.forEach((data) => {
            let geometry;

            switch (data.shape) {
                case 'box':
                    geometry = new THREE.BoxGeometry(...data.scale);
                    break;
                case 'sphere':
                    geometry = new THREE.SphereGeometry(data.scale[0], 16, 16);
                    break;
                case 'cylinder':
                    geometry = new THREE.CylinderGeometry(data.scale[0], data.scale[0], data.scale[1], 8);
                    break;
                case 'octahedron':
                    geometry = new THREE.OctahedronGeometry(data.scale[0]);
                    break;
                case 'tetrahedron':
                    geometry = new THREE.TetrahedronGeometry(data.scale[0]);
                    break;
                case 'dodecahedron':
                    geometry = new THREE.DodecahedronGeometry(data.scale[0]);
                    break;
                default:
                    geometry = new THREE.BoxGeometry(...data.scale);
            }

            const material = new THREE.MeshStandardMaterial({
                color: data.color,
                metalness: 0.7,
                roughness: 0.3,
                emissive: data.color,
                emissiveIntensity: 0.1
            });

            const mesh = new THREE.Mesh(geometry, material) as TechObjectWithData;
            mesh.userData = {
                originalPosition: new THREE.Vector3(...data.position),
                speed: Math.random() * 0.02 + 0.01,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.01
                },
                floatAmplitude: Math.random() * 0.5 + 0.3
            };

            mesh.position.copy(mesh.userData.originalPosition);
            scene.add(mesh);
            techObjects.push(mesh);
        });

        // Camera position
        camera.position.set(0, 0, 15);

        // Animation loop
        let time = 0;
        const animate = () => {
            time += 0.01;

            // Animate tech objects
            techObjects.forEach((obj, index) => {
                obj.rotation.x += obj.userData.rotationSpeed.x;
                obj.rotation.y += obj.userData.rotationSpeed.y;
                obj.rotation.z += obj.userData.rotationSpeed.z;

                // Create floating motion with different phases
                const phase = (index * Math.PI * 2) / techObjects.length;
                obj.position.y = obj.userData.originalPosition.y +
                    Math.sin(time * obj.userData.speed * 10 + phase) * obj.userData.floatAmplitude;

                obj.position.x = obj.userData.originalPosition.x +
                    Math.cos(time * obj.userData.speed * 5 + phase) * 0.2;
            });

            // Subtle camera movement
            camera.position.x = Math.cos(time * 0.05) * 2;
            camera.position.y = Math.sin(time * 0.03) * 1;
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

// Project Card Component
interface ProjectCardProps {
    title: string;
    description: string;
    technologies: string[];
    category: string;
    icon: React.ComponentType<any>;
    githubUrl?: string;
    liveUrl?: string;
    featured?: boolean;
    delay?: number;
}

function ProjectCard({
                         title,
                         description,
                         technologies,
                         category,
                         icon: Icon,
                         githubUrl,
                         liveUrl,
                         featured = false,
                         delay = 0
                     }: ProjectCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            viewport={{ once: true }}
            whileHover={{ y: -10, scale: 1.02 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`
        relative group cursor-pointer
        ${featured
                ? 'md:col-span-2 bg-gradient-to-br from-indigo-900/30 to-purple-900/30'
                : 'bg-gray-800/30'
            }
        backdrop-blur-sm border border-gray-700 rounded-2xl p-6 
        hover:border-indigo-500/50 hover:bg-gray-700/40
        transition-all duration-500
        overflow-hidden
      `}
        >
            {/* Background glow effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />

            {/* Category badge */}
            <div className="flex items-center justify-between mb-4">
        <span className={`
          px-3 py-1 text-xs font-semibold rounded-full
          ${category === 'Infrastructure' ? 'bg-blue-500/20 text-blue-300' :
            category === 'Automation' ? 'bg-green-500/20 text-green-300' :
                category === 'Security' ? 'bg-red-500/20 text-red-300' :
                    category === 'Monitoring' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-purple-500/20 text-purple-300'
        }
        `}>
          {category}
        </span>
                {featured && (
                    <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full">
            FEATURED
          </span>
                )}
            </div>

            {/* Icon and title */}
            <div className="flex items-center space-x-4 mb-4">
                <motion.div
                    className={`
            p-3 rounded-xl
            ${category === 'Infrastructure' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                        category === 'Automation' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                            category === 'Security' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                category === 'Monitoring' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                    'bg-gradient-to-r from-purple-500 to-purple-600'
                    }
          `}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                >
                    <Icon className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors duration-300">
                        {title}
                    </h3>
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-400 mb-6 leading-relaxed">
                {description}
            </p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-6">
                {technologies.map((tech, index) => (
                    <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: delay + (index * 0.1) }}
                        className="px-3 py-1 text-xs font-medium bg-gray-700/50 text-gray-300 rounded-full hover:bg-indigo-500/20 hover:text-indigo-300 transition-all duration-300"
                    >
                        {tech}
                    </motion.span>
                ))}
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3">
                {githubUrl && (
                    <motion.a
                        href={githubUrl}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-lg transition-all duration-300"
                    >
                        <Github className="w-4 h-4" />
                        <span className="text-sm font-medium">Code</span>
                    </motion.a>
                )}
                {liveUrl && (
                    <motion.a
                        href={liveUrl}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm font-medium">Live Demo</span>
                    </motion.a>
                )}
            </div>

            {/* Hover arrow indicator */}
            <motion.div
                className="absolute top-6 right-6 opacity-0 group-hover:opacity-100"
                initial={{ x: -10 }}
                animate={{ x: isHovered ? 0 : -10 }}
                transition={{ duration: 0.3 }}
            >
                <ArrowRight className="w-5 h-5 text-indigo-400" />
            </motion.div>
        </motion.div>
    );
}

// Filter Button Component
interface FilterButtonProps {
    category: string;
    isActive: boolean;
    onClick: () => void;
    icon: React.ComponentType<any>;
}

function FilterButton({ category, isActive, onClick, icon: Icon }: FilterButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`
        flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300
        ${isActive
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700'
            }
      `}
        >
            <Icon className="w-4 h-4" />
            <span>{category}</span>
        </motion.button>
    );
}

// Main Projects Section Component
interface Project {
    title: string;
    description: string;
    technologies: string[];
    category: string;
    icon: React.ComponentType<any>;
    githubUrl?: string;
    liveUrl?: string;
    featured?: boolean;
}

export function ProjectsSection() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

    const projects = [
        {
            title: "Kubernetes Multi-Cloud Orchestrator",
            description: "Enterprise-grade Kubernetes deployment automation across AWS, GCP, and Azure with Terraform, featuring auto-scaling, load balancing, and disaster recovery capabilities.",
            technologies: ["Kubernetes", "Terraform", "AWS EKS", "GCP GKE", "Azure AKS", "Helm", "ArgoCD"],
            category: "Infrastructure",
            icon: Container,
            githubUrl: "#",
            liveUrl: "#",
            featured: true
        },
        {
            title: "CI/CD Pipeline Accelerator",
            description: "Comprehensive GitOps workflow automation with Jenkins, GitHub Actions, and GitLab CI/CD, reducing deployment time by 85% and improving reliability.",
            technologies: ["Jenkins", "GitHub Actions", "GitLab CI", "SonarQube", "Nexus", "Docker"],
            category: "Automation",
            icon: GitBranch,
            githubUrl: "#",
            liveUrl: "#"
        },
        {
            title: "Infrastructure Security Scanner",
            description: "Automated security compliance tool that scans cloud infrastructure for vulnerabilities, misconfigurations, and compliance violations across multiple cloud providers.",
            technologies: ["Python", "Terraform", "AWS Config", "Azure Policy", "Checkov", "SAST"],
            category: "Security",
            icon: Shield,
            githubUrl: "#"
        },
        {
            title: "Cloud Cost Optimization Engine",
            description: "AI-powered cost analysis and optimization platform that automatically identifies and eliminates cloud waste, achieving up to 40% cost reduction.",
            technologies: ["Python", "AWS Cost Explorer", "GCP Billing API", "ML", "Grafana"],
            category: "Automation",
            icon: Cloud,
            githubUrl: "#",
            liveUrl: "#"
        },
        {
            title: "Observability Stack Platform",
            description: "Complete monitoring and observability solution with distributed tracing, metrics collection, and intelligent alerting for microservices architectures.",
            technologies: ["Prometheus", "Grafana", "Jaeger", "ELK Stack", "OpenTelemetry", "Kubernetes"],
            category: "Monitoring",
            icon: Activity,
            githubUrl: "#",
            liveUrl: "#",
            featured: true
        },
        {
            title: "Serverless API Gateway",
            description: "High-performance, auto-scaling API gateway built on AWS Lambda and API Gateway with advanced rate limiting, authentication, and monitoring capabilities.",
            technologies: ["AWS Lambda", "API Gateway", "DynamoDB", "CloudFormation", "Node.js"],
            category: "Infrastructure",
            icon: Server,
            githubUrl: "#"
        },
        {
            title: "Docker Security Hardening Tool",
            description: "Automated container security scanner and hardening tool that implements security best practices and vulnerability assessments for Docker containers.",
            technologies: ["Docker", "Trivy", "Falco", "OPA", "Python", "Kubernetes"],
            category: "Security",
            icon: Container,
            githubUrl: "#"
        },
        {
            title: "Infrastructure as Code Template Library",
            description: "Comprehensive collection of reusable Terraform modules and Ansible playbooks for rapid cloud infrastructure deployment across multiple providers.",
            technologies: ["Terraform", "Ansible", "AWS", "GCP", "Azure", "Packer", "Consul"],
            category: "Infrastructure",
            icon: Layers,
            githubUrl: "#"
        }
    ];

    const categories = [
        { name: 'All', icon: Globe },
        { name: 'Infrastructure', icon: Server },
        { name: 'Automation', icon: Zap },
        { name: 'Security', icon: Shield },
        { name: 'Monitoring', icon: Activity }
    ];

    useEffect(() => {
        if (activeFilter === 'All') {
            setFilteredProjects(projects);
        } else {
            setFilteredProjects(projects.filter(project => project.category === activeFilter));
        }
    }, [activeFilter]);

    return (
        <section id="projects" className="relative py-20 px-6 overflow-hidden">
            {/* 3D Background */}
            <TechIconsScene />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/80 z-5" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-full mb-6"
                    >
                        <Terminal className="w-5 h-5 text-indigo-400" />
                        <span className="text-indigo-300 font-medium">DevOps & Cloud Projects</span>
                    </motion.div>

                    <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        Featured Projects
                    </h2>

                    <motion.div
                        className="h-1 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto rounded-full mb-8"
                        initial={{ width: 0 }}
                        whileInView={{ width: 120 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        viewport={{ once: true }}
                    />

                    <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Explore my collection of DevOps, cloud infrastructure, and automation projects.
                        Each solution is designed to improve efficiency, security, and scalability in modern development workflows.
                    </p>
                </motion.div>

                {/* Filter Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-4 mb-12"
                >
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.name}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <FilterButton
                                category={category.name}
                                isActive={activeFilter === category.name}
                                onClick={() => setActiveFilter(category.name)}
                                icon={category.icon}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Projects Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeFilter}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredProjects.map((project, index) => (
                            <ProjectCard
                                key={`${project.title}-${activeFilter}`}
                                {...project}
                                delay={index * 0.1}
                            />
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8"
                >
                    {[
                        { icon: Cpu, number: "50+", label: "Deployments Automated", color: "text-blue-400" },
                        { icon: HardDrive, number: "99.9%", label: "Uptime Achieved", color: "text-green-400" },
                        { icon: Network, number: "85%", label: "Faster Deployments", color: "text-purple-400" },
                        { icon: Shield, number: "Zero", label: "Security Incidents", color: "text-red-400" }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="text-center p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl hover:border-indigo-500/50 transition-all duration-300"
                        >
                            <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-4`} />
                            <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
                            <div className="text-gray-400 text-sm">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
