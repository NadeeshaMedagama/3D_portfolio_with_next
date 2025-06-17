'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cloud,
    Container,
    GitBranch,
    Shield,
    Zap,
    MonitorSpeaker,
    Workflow,
    Settings,
    BarChart3,
    Cpu,
    Activity,
    Layers,
    ChevronRight,
    Star
} from 'lucide-react';

// 3D Skills Scene Component
function SkillsThreeJSScene() {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationIdRef = useRef<number | null>(null);

    type CubeUserData = {
        originalPosition: THREE.Vector3;
        speed: number;
        rotationSpeed: { x: number; y: number; z: number };
        amplitude: number;
    };

    type CubeWithData = THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial> & {
        userData: CubeUserData;
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
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0x6366f1, 0.8);
        directionalLight1.position.set(10, 10, 5);
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0x8b5cf6, 0.6);
        directionalLight2.position.set(-10, -10, -5);
        scene.add(directionalLight2);

        const pointLight = new THREE.PointLight(0x06b6d4, 0.5, 100);
        pointLight.position.set(0, 0, 10);
        scene.add(pointLight);

        // Create floating cubes representing different tech stacks
        const cubes: CubeWithData[] = [];

        const cubeData: Array<{
            position: [number, number, number], // Explicit tuple type
            color: number,
            size: number,
            emissive: number
        }> = [
            { position: [-6, 3, -4], color: 0x0066cc, size: 0.8, emissive: 0x0033cc }, // Docker blue
            { position: [6, -2, -5], color: 0x9333ea, size: 0.6, emissive: 0x7c3aed }, // Kubernetes purple
            { position: [0, 4, -3], color: 0x06b6d4, size: 0.7, emissive: 0x0891b2 }, // AWS cyan
            { position: [-4, -3, -6], color: 0xf59e0b, size: 0.5, emissive: 0xd97706 }, // Azure orange
            { position: [5, 2, -2], color: 0x10b981, size: 0.9, emissive: 0x059669 }, // Terraform green
            { position: [-2, 0, -7], color: 0xef4444, size: 0.4, emissive: 0xdc2626 }, // Jenkins red
            { position: [3, -4, -3], color: 0x8b5cf6, size: 0.6, emissive: 0x7c3aed }, // GitLab purple
            { position: [-5, 1, -2], color: 0xf97316, size: 0.5, emissive: 0xea580c }, // Prometheus orange
        ];

        cubeData.forEach((data) => {
            const geometry = new THREE.BoxGeometry(data.size, data.size, data.size);
            const edges = new THREE.EdgesGeometry(geometry);
            const material = new THREE.MeshStandardMaterial({
                color: data.color,
                metalness: 0.7,
                roughness: 0.3,
                emissive: data.emissive,
                emissiveIntensity: 0.2,
                transparent: true,
                opacity: 0.9
            });

            const cube = new THREE.Mesh(geometry, material) as CubeWithData;
            const wireframe = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.3
            }));

            cube.userData = {
                originalPosition: new THREE.Vector3(...data.position),
                speed: Math.random() * 0.02 + 0.008,
                rotationSpeed: {
                    x: Math.random() * 0.02 - 0.01,
                    y: Math.random() * 0.02 - 0.01,
                    z: Math.random() * 0.02 - 0.01
                },
                amplitude: Math.random() * 0.5 + 0.3
            };

            cube.position.set(...data.position);
            cube.add(wireframe);
            scene.add(cube);
            cubes.push(cube);
        });

        // Create central platform
        const platformGeometry = new THREE.CylinderGeometry(3, 3, 0.3, 32);
        const platformMaterial = new THREE.MeshStandardMaterial({
            color: 0x1f2937,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0x111827,
            emissiveIntensity: 0.1
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.set(0, -1, 0);
        scene.add(platform);

        // Add connecting lines between cubes
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x6366f1,
            transparent: true,
            opacity: 0.2
        });

        const connectionLines: THREE.Line[] = [];
        for (let i = 0; i < cubes.length - 1; i++) {
            const geometry = new THREE.BufferGeometry().setFromPoints([
                cubes[i].position.clone(),
                cubes[i + 1].position.clone()
            ]);
            const line = new THREE.Line(geometry, lineMaterial);
            scene.add(line);
            connectionLines.push(line);
        }

        camera.position.set(0, 2, 12);

        // Animation loop
        let time = 0;
        const animate = () => {
            time += 0.01;

            // Animate cubes
            cubes.forEach((cube, index) => {
                cube.rotation.x += cube.userData.rotationSpeed.x;
                cube.rotation.y += cube.userData.rotationSpeed.y;
                cube.rotation.z += cube.userData.rotationSpeed.z;

                const offset = index * 0.5;
                cube.position.x = cube.userData.originalPosition.x + Math.sin(time * cube.userData.speed + offset) * cube.userData.amplitude;
                cube.position.y = cube.userData.originalPosition.y + Math.cos(time * cube.userData.speed * 0.7 + offset) * cube.userData.amplitude * 0.5;
                cube.position.z = cube.userData.originalPosition.z + Math.sin(time * cube.userData.speed * 0.5 + offset) * cube.userData.amplitude * 0.3;
            });

            // Animate platform
            platform.rotation.y += 0.003;
            platform.position.y = -1 + Math.sin(time * 1.5) * 0.1;

            // Update connection lines
            connectionLines.forEach((line, index) => {
                if (index < cubes.length - 1) {
                    const points = [cubes[index].position.clone(), cubes[index + 1].position.clone()];
                    line.geometry.setFromPoints(points);
                }
            });

            // Camera orbit
            const radius = 12;
            camera.position.x = Math.cos(time * 0.05) * radius;
            camera.position.z = Math.sin(time * 0.05) * radius;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
            animationIdRef.current = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

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

// Advanced Skill Card Component
interface AdvancedSkillCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    skills: string[];
    proficiency: number;
    delay?: number;
    category: 'devops' | 'cloud' | 'automation' | 'monitoring';
}

function AdvancedSkillCard({
                               icon: Icon,
                               title,
                               description,
                               skills,
                               proficiency,
                               delay = 0,
                               category
                           }: AdvancedSkillCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const categoryColors = {
        devops: 'from-blue-500 to-blue-700',
        cloud: 'from-purple-500 to-purple-700',
        automation: 'from-green-500 to-green-700',
        monitoring: 'from-orange-500 to-orange-700'
    };

    const categoryBorders = {
        devops: 'border-blue-500/30',
        cloud: 'border-purple-500/30',
        automation: 'border-green-500/30',
        monitoring: 'border-orange-500/30'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, rotateY: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay }}
            viewport={{ once: true }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`relative bg-gray-800/40 backdrop-blur-lg border ${categoryBorders[category]} rounded-2xl p-6 hover:bg-gray-700/50 transition-all duration-500 group overflow-hidden`}
        >
            {/* Animated background gradient */}
            <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${categoryColors[category]} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                initial={false}
                animate={{ opacity: isHovered ? 0.1 : 0 }}
            />

            {/* Floating particles effect */}
            <AnimatePresence>
                {isHovered && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-white/30 rounded-full"
                                initial={{
                                    x: Math.random() * 100 + '%',
                                    y: '100%',
                                    opacity: 0
                                }}
                                animate={{
                                    y: '-10%',
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    delay: i * 0.1,
                                    repeat: Infinity
                                }}
                            />
                        ))}
                    </div>
                )}
            </AnimatePresence>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <motion.div
                        className={`p-4 bg-gradient-to-br ${categoryColors[category]} rounded-xl shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <motion.div
                        className="flex items-center space-x-1"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: delay + 0.3 }}
                    >
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0, rotate: -180 }}
                                whileInView={{ scale: 1, rotate: 0 }}
                                transition={{ delay: delay + 0.4 + (i * 0.1) }}
                            >
                                <Star
                                    className={`w-4 h-4 ${
                                        i < Math.floor(proficiency / 20)
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-600'
                                    }`}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
                    </div>

                    {/* Skills list */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-300 flex items-center">
                            <ChevronRight className="w-4 h-4 mr-1" />
                            Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                                <motion.span
                                    key={skill}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: delay + 0.2 + (index * 0.05) }}
                                    className="px-3 py-1 bg-gray-700/50 border border-gray-600 rounded-full text-xs text-gray-300 hover:bg-gray-600/50 transition-colors duration-200"
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </div>
                    </div>

                    {/* Proficiency bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-300">Proficiency</span>
                            <span className="text-sm text-gray-400">{proficiency}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <motion.div
                                className={`h-full bg-gradient-to-r ${categoryColors[category]} rounded-full`}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${proficiency}%` }}
                                transition={{ duration: 1, delay: delay + 0.5 }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Certification Badge Component
interface CertificationBadgeProps {
    name: string;
    issuer: string;
    date: string;
    icon: React.ElementType;
    verified?: boolean;
}

function CertificationBadge({ name, issuer, date, icon: Icon, verified = true }: CertificationBadgeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:border-indigo-500/50 transition-all duration-300 group"
        >
            <div className="flex items-start space-x-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/30 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-white text-sm truncate">{name}</h4>
                        {verified && (
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Shield className="w-4 h-4 text-green-400" />
                            </motion.div>
                        )}
                    </div>
                    <p className="text-gray-400 text-xs">{issuer}</p>
                    <p className="text-gray-500 text-xs mt-1">{date}</p>
                </div>
            </div>
        </motion.div>
    );
}

// Main Skills Section Component
export default function SkillsSection() {
    const skillsData = [
        {
            icon: Container,
            title: "Containerization & Orchestration",
            description: "Expert in containerizing applications and managing container orchestration at scale.",
            skills: ["Docker", "Kubernetes", "Helm", "Docker Compose", "Podman", "OpenShift"],
            proficiency: 90,
            category: 'devops' as const
        },
        {
            icon: Cloud,
            title: "Cloud Platforms",
            description: "Proficient in designing and implementing cloud-native solutions across major platforms.",
            skills: ["AWS", "Azure", "GCP", "DigitalOcean", "Terraform", "CloudFormation"],
            proficiency: 87,
            category: 'cloud' as const
        },
        {
            icon: GitBranch,
            title: "CI/CD & Version Control",
            description: "Building robust pipelines for continuous integration and deployment workflows.",
            skills: ["Jenkins", "GitLab CI", "GitHub Actions", "ArgoCD", "Git", "Bitbucket"],
            proficiency: 83,
            category: 'devops' as const
        },
        {
            icon: Zap,
            title: "Infrastructure as Code",
            description: "Automating infrastructure provisioning and management through code.",
            skills: ["Terraform", "Ansible", "Pulumi", "CloudFormation", "Vagrant", "Packer"],
            proficiency: 78,
            category: 'automation' as const
        },
        {
            icon: MonitorSpeaker,
            title: "Monitoring & Observability",
            description: "Implementing comprehensive monitoring and logging solutions for system reliability.",
            skills: ["Prometheus", "Grafana", "ELK Stack", "Datadog", "New Relic", "Jaeger"],
            proficiency: 75,
            category: 'monitoring' as const
        },
        {
            icon: Shield,
            title: "Security & Compliance",
            description: "Integrating security practices into DevOps workflows and ensuring compliance.",
            skills: ["HashiCorp Vault", "OWASP", "SonarQube", "Trivy", "Falco", "OPA"],
            proficiency: 70,
            category: 'devops' as const
        }
    ];

    const certifications = [
        {name: "Fundamentals of Azure DevOps", issuer: "Microsoft Learn", date: "2025", icon: Cloud,
            link: "https://learn.microsoft.com/en-us/training/paths/deploy-applications-with-azure-devops/"},
        {name: "Kubernetes Administrator", issuer: "CoDeKu Academy", date: "2025", icon: Container,
            link: "https://drive.google.com/file/d/1XhgIks8hhSxauR6T1W9JkbpYLmjIz-oZ/view"},
        {name: "Xtreme 18.0 Programming", issuer: "IEEE", date: "2024", icon: Layers,
            link: "https://drive.google.com/file/d/14DhMJPqfrUtTq4KH0Ld2mLE0_zljHxBR/view?usp=sharing"},
        {name: "Beginner's Guide to JavaScript", issuer: "Alison", date: "2024", icon: Settings,
            link: "https://alison.com/user/pdf/4139/certificate"},
        {name: "Dark & Deep Web", issuer: "ET (pvt) Ltd", date: "2023", icon: Workflow,
            link: "https://drive.google.com/file/d/1lmX-iRFQMcjYIL2dfD-PB9EOVHDkBy93/view"},
        {name: "DevOps foundations", issuer: "Microsoft Learn", date: "2025", icon: GitBranch,
            link: "https://learn.microsoft.com/en-us/training/paths/devops-foundations-core-principles-practices/"}
    ];

    return (
        <div
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen text-white overflow-x-hidden">
            <Navigation/>
            <section id="skills" className="relative min-h-screen py-20 px-6 overflow-hidden">
                {/* 3D Background */}
                <SkillsThreeJSScene/>

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-transparent to-gray-900/80 z-5"/>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-900/20 to-transparent z-5"/>

                <div className="relative z-10 max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.8}}
                        viewport={{once: true}}
                        className="text-center mb-20"
                    >
                        <motion.div
                            initial={{scale: 0.5, opacity: 0}}
                            whileInView={{scale: 1, opacity: 1}}
                            transition={{duration: 1, delay: 0.2}}
                            className="inline-flex items-center space-x-2 bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-3 mb-8"
                        >
                            <Cpu className="w-5 h-5 text-indigo-400"/>
                            <span className="text-gray-300 font-medium">Technical Expertise</span>
                        </motion.div>

                        <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            DevOps Skills
                        </h2>

                        <motion.div
                            className="h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 mx-auto rounded-full mb-8"
                            initial={{width: 0}}
                            whileInView={{width: 300}}
                            transition={{duration: 1, delay: 0.5}}
                        />

                        <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
                            Specialized in modern DevOps practices, cloud infrastructure, and automation technologies.
                            Building scalable, reliable, and secure systems that enable rapid software delivery.
                        </p>
                    </motion.div>

                    {/* Skills Grid */}
                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
                        {skillsData.map((skill, index) => (
                            <AdvancedSkillCard
                                key={skill.title}
                                icon={skill.icon}
                                title={skill.title}
                                description={skill.description}
                                skills={skill.skills}
                                proficiency={skill.proficiency}
                                category={skill.category}
                                delay={index * 0.1}
                            />
                        ))}
                    </div>

                    {/* Certifications Section */}
                    <motion.div
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.8}}
                        viewport={{once: true}}
                        className="text-center mb-16"
                    >
                        <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                            Certifications & Achievements
                        </h3>
                        <motion.div
                            className="h-1 bg-gradient-to-r from-green-400 to-blue-400 mx-auto rounded-full mb-8"
                            initial={{width: 0}}
                            whileInView={{width: 200}}
                            transition={{duration: 1}}
                        />
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certifications.map((cert, index) => (
                            <motion.a
                                key={cert.name}
                                href={cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{opacity: 0, y: 30}}
                                whileInView={{opacity: 1, y: 0}}
                                transition={{duration: 0.6, delay: index * 0.1}}
                                viewport={{once: true}}
                                className="block"
                            >
                                <CertificationBadge {...cert} />
                            </motion.a>
                        ))}
                    </div>

                    {/* Stats Section */}
                    <motion.div
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.8}}
                        viewport={{once: true}}
                        className="mt-20 text-center"
                    >
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {value: "1+", label: "Years Experience", icon: BarChart3, color: "text-indigo-400"},
                                {value: "15+", label: "Projects Deployed", icon: Workflow, color: "text-purple-400"},
                                {value: "75%", label: "System Uptime", icon: Activity, color: "text-green-400"},
                                {value: "8+", label: "Automations Built", icon: Zap, color: "text-orange-400"}
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{opacity: 0, scale: 0.5}}
                                    whileInView={{opacity: 1, scale: 1}}
                                    transition={{duration: 0.6, delay: index * 0.1}}
                                    whileHover={{scale: 1.05}}
                                    className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300"
                                >
                                    <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-4`}/>
                                    <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                                    <div className="text-gray-400 text-sm">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
            );
            }
