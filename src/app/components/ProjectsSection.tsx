'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Server,
    Cloud,
    Shield,
    Zap,
    Globe,
    Terminal,
    Activity,
    ExternalLink,
    Github,
    ArrowRight,
    Layout,
    Repeat, Smartphone, Fuel, ListTodo
} from 'lucide-react';
export default ProjectsSection;

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
        relative group 
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
            ${category === 'MERN Stack' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                        category === 'Web Development' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                            category === 'Mobile Development' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                category === 'DevOps' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
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
            <div className="flex space-x-3 relative z-20">
                {githubUrl && githubUrl !== "#" && (
                    <motion.a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300
                        hover:text-white rounded-lg transition-all duration-300 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Github className="w-4 h-4" />
                        <span className="text-sm font-medium">Code</span>
                    </motion.a>
                )}
                {liveUrl && liveUrl !== "#" && (
                    <motion.a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600
                        hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
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
            cursor-pointer
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
            title: "NovaLearn LMS Platform",
            description: "A full-featured Learning Management System built with the MERN stack, offering user-friendly course management, student progress tracking, interactive lessons, and secure authentication for learners and instructors.",
            technologies: ["MongoDB", "Express.js", "React", "Node.js", "JWT", "Redux", "Cloudinary"],
            category: "MERN Stack",
            icon: Layout,
            githubUrl: "https://github.com/NadeeshaMedagama/LMS_platform_with_MERN_stack.git",
            liveUrl: "https://nova-learn-lms-nadeeshamedagama.netlify.app/",
            featured: true
        },
        {
            title: "FloraVista E-commerce Platform",
            description: "A flower-focused e-commerce platform featuring dynamic product listings, shopping cart functionality, secure checkout, and order management. Built to streamline the online flower buying experience.",
            technologies: ["HTML", "CSS", "PHP", "MySQL"],
            category: "Web Development",
            icon: Layout,
            githubUrl: "https://github.com/NadeeshaMedagama/kln_php_project_floraVista.git",
            liveUrl: "#"
        },
        {
            title: "CI/CD Pipeline with Jenkins",
            description: "Integrated Jenkins with Git-based version control systems to automate build, test, and deployment workflows using shell scripts on AWS infrastructure, ensuring a smooth and reliable CI/CD pipeline.",
            technologies: ["Jenkins", "AWS", "Shell Scripting", "CI/CD"],
            category: "DevOps",
            icon: Repeat,
            liveUrl: "https://www.linkedin.com/posts/nadeesha-medagama-5aa827287_aws-ec2-jenkins-activity-7324357455994388480-SZuU"
        },
        {
            title: "Habit Tracker Mobile App",
            description: "A sleek and intuitive mobile application for tracking daily habits and routines, built with React Native CLI and TypeScript. Features include progress visualization, reminders, and persistent local storage using AsyncStorage.",
            technologies: ["React Native CLI", "TypeScript", "AsyncStorage"],
            category: "Mobile Development",
            icon: Smartphone,
            githubUrl: "https://github.com/NadeeshaMedagama/HabitTracker_mobile_application_with_react-native.git",
            liveUrl: "https://habit-tracker-mobile-app-demo-video.netlify.app/"
        },
        {
            title: "Python Web Server on AWS EC2",
            description: "Successfully deployed a Python-based HTTP server on an AWS EC2 instance within a custom VPC. This project involved configuring security groups, managing network rules, and launching the server using Python's built-in module. The server was made publicly accessible, enhancing my skills in cloud infrastructure, Linux server administration, and network configuration — key competencies for a DevOps engineer.",
            technologies: ["Python", "AWS EC2", "VPC", "Security Groups", "Linux"],
            category: "DevOps",
            icon: Server,
            githubUrl: "",
            liveUrl: "https://www.linkedin.com/posts/nadeesha-medagama-5aa827287_aws-ec2-python-activity-7325389815011573761-dZDz?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEW2JJIBZi47mjvLbuK6oM9URnVIAyLG0Xg",
            featured: true
        },
        {
            title: "Fuel Quota Management System",
            description: "A scalable fuel quota management platform developed as a group project using React, Spring Boot, and MySQL. Key features include real-time tracking, secure JWT-based authentication, and role-based access control for admins and users.",
            technologies: ["React", "Spring Boot", "MySQL", "JWT", "Role-based Access"],
            category: "Web Development",
            icon: Fuel,
            githubUrl: "https://github.com/NadeeshaMedagama/fuel-quota-management-system.git",
        },
        {
            title: "To-Do List Mobile App",
            description: "A simple and offline-capable to-do app built with React Native and TypeScript, using AsyncStorage for task persistence.",
            technologies: ["React Native", "TypeScript", "AsyncStorage"],
            category: "Mobile Development",
            icon: ListTodo,
            githubUrl: "https://github.com/NadeeshaMedagama/todo_list_mobile_app_with_react_native.git",
            liveUrl: "https://todo-list-mobile-app-demo-video.netlify.app/"
        },
        {
            title: "Python Flask App Deployment with Terraform",
            description: "Deployed a Python Flask web app on AWS EC2 using Terraform. Set up a custom VPC, subnets, security groups, and automated infrastructure provisioning with Infrastructure as Code (IaC).",
            technologies: ["Terraform", "AWS EC2", "VPC", "Flask", "Infrastructure as Code"],
            category: "DevOps",
            icon: Cloud,
            liveUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7337880774865506304?updateEntityUrn=urn%3Ali%3Afs_feedUpdate%3A%28V2%2Curn%3Ali%3Aactivity%3A7337880774865506304%29&lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3B95o5dsYxRh6pSVi0WdkIKA%3D%3D"
        }
    ];

    const categories = [
        { name: 'All', icon: Globe },
        { name: 'MERN Stack', icon: Server },
        { name: 'Web Development', icon: Zap },
        { name: 'Mobile Development', icon: Shield },
        { name: 'DevOps', icon: Activity }
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

                    <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent pb-1">
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
                        Explore my collection of DevOps, Cloud Infrastructure, and Automation projects.
                        Each solution is designed to improve Efficiency, Security, and Scalability in modern development workflows.
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
            </div>
        </section>
    );
}
