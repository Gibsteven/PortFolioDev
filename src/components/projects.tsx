'use client';

import { useMemo } from 'react';
import { ProjectCard } from '@/components/project-card';
import { useLanguage } from '@/hooks/use-language';
import { motion } from 'framer-motion';
import { useList } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { database } from '@/lib/firebase';
import type { Project } from '@/types';
import { Skeleton } from './ui/skeleton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

export function Projects() {
  const { t } = useLanguage();
  const [snapshots, loading] = useList(ref(database, 'projects'));
  
  const projects = useMemo(() => {
      if (loading || !snapshots) return [];
      return snapshots.map(snapshot => ({ id: snapshot.key, ...snapshot.val() } as Project));
  }, [snapshots, loading]);


  const { webProjects, mobileProjects } = useMemo(() => {
    const webProjects = projects.filter(p => p.type === 'Web App' || p.type === 'Full-Stack');
    const mobileProjects = projects.filter(p => p.type === 'Mobile App');
    return { webProjects, mobileProjects };
  }, [projects]);

  return (
    <section 
        id="projects" 
        className="py-24 sm:py-32 bg-secondary/50"
    >
        <div className="container mx-auto px-4">
            <motion.div 
                className="text-center mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={itemVariants}
            >
                <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-4">
                    {t('projects.title')}
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                    {t('projects.description')}
                </p>
            </motion.div>
            
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Skeleton className="h-[400px] w-full" />
                    <Skeleton className="h-[400px] w-full" />
                    <Skeleton className="h-[400px] w-full" />
                </div>
            )}

            {!loading && webProjects.length > 0 && (
                <div className="mb-16">
                    <motion.h3 
                        className="font-headline text-3xl md:text-4xl font-bold tracking-tighter mb-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={itemVariants}
                    >
                        Web Applications
                    </motion.h3>
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={containerVariants}
                    >
                        {webProjects.map((project) => (
                           <motion.div key={project.id} variants={itemVariants}>
                             <ProjectCard project={project} />
                           </motion.div>
                        ))}
                    </motion.div>
                </div>
            )}

            {!loading && mobileProjects.length > 0 && (
                 <div>
                    <motion.h3 
                        className="font-headline text-3xl md:text-4xl font-bold tracking-tighter mb-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={itemVariants}
                    >
                        Mobile Applications
                    </motion.h3>
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={containerVariants}
                    >
                        {mobileProjects.map((project) => (
                            <motion.div key={project.id} variants={itemVariants}>
                                <ProjectCard project={project} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            )}
        </div>
    </section>
  );
}
