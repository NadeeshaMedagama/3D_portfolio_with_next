'use client';

import { motion } from 'framer-motion';
import { Container, Cloud, GitBranch, Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function SkillsPreview() {
    const skillsPreview = [
        { icon: Container, title: "Containerization", count: 4 },
        { icon: Cloud, title: "Cloud Platforms", count: 5 },
        { icon: GitBranch, title: "CI/CD Tools", count: 4 },
        { icon: Zap, title: "Automation", count: 4 },
    ];

    return (
        <section id="skills" className="relative py-20 px-6 bg-gradient-to-b from-gray-900/50 to-gray-800/50">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Technical Skills
                    </h2>
                    <motion.div
                        className="h-1 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto rounded-full mb-8"
                        initial={{ width: 0 }}
                        whileInView={{ width: 100 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    />
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Expertise in modern DevOps tools and cloud technologies. Click below to see full breakdown.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {skillsPreview.map((skill, index) => (
                        <motion.div
                            key={skill.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center hover:bg-gray-700/30 transition-all"
                        >
                            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-4">
                                <skill.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-1">{skill.title}</h3>
                            <p className="text-gray-400 text-sm">{skill.count}+ technologies</p>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/skills">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            className="cursor-pointer px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg inline-flex items-center"
                        >
                            View Full Skills Breakdown
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </motion.button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
