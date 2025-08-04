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
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
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
        className="py-16 sm:py-20 bg-secondary/50"
    >
        <div className="container mx-auto px-4">
            <motion.div 
                className="text-center mb-12"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={itemVariants}
            >
                <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tighter mb-3">
                    {t('projects.title')}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    {t('projects.description')}
                </p>
            </motion.div>
            
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-[350px] w-full" />
                    <Skeleton className="h-[350px] w-full" />
                    <Skeleton className="h-[350px] w-full" />
                </div>
            )}

            {!loading && webProjects.length > 0 && (
                <div className="mb-12">
                    <motion.h3 
                        className="font-headline text-xl md:text-2xl font-bold tracking-tighter mb-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={itemVariants}
                    >
                        Web Applications
                    </motion.h3>
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                        className="font-headline text-xl md:text-2xl font-bold tracking-tighter mb-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={itemVariants}
                    >
                        Mobile Applications
                    </motion.h3>
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
