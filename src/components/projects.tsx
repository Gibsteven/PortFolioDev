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


  const { webProjects, mobileProjects, fullStackProjects } = useMemo(() => {
    const webProjects = projects.filter(p => p.type === 'Web App');
    const mobileProjects = projects.filter(p => p.type === 'Mobile App');
    const fullStackProjects = projects.filter(p => p.type === 'Full-Stack');
    return { webProjects, mobileProjects, fullStackProjects };
  }, [projects]);
  
  const allProjects = [...fullStackProjects, ...webProjects, ...mobileProjects];

  return (
    <motion.section 
        id="projects" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
    >
        <div className="text-center mb-10">
            <h2 className="font-headline text-3xl font-bold border-b-4 border-primary inline-block pb-2">
                {t('projects.title')}
            </h2>
            <p className="text-muted-foreground mt-4 max-w-3xl mx-auto">
                {t('projects.description')}
            </p>
        </div>
        
        {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-[350px] w-full" />
                <Skeleton className="h-[350px] w-full" />
                <Skeleton className="h-[350px] w-full" />
            </div>
        )}

        {!loading && projects.length > 0 && (
             <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
            >
                {allProjects.map((project) => (
                   <motion.div key={project.id} variants={itemVariants}>
                     <ProjectCard project={project} />
                   </motion.div>
                ))}
            </motion.div>
        )}
    </motion.section>
  );
}
