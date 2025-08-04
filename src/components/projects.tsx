// This is a new file
'use client';

import { ProjectCard } from '@/components/project-card';
import { getAllProjects } from '@/lib/project-utils';
import { useLanguage } from '@/hooks/use-language';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

export function Projects() {
  const projects = getAllProjects();
  const { t } = useLanguage();

  return (
    <motion.section 
        id="projects" 
        className="py-24 sm:py-32 bg-secondary/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
    >
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-4">
                    {t('projects.title')}
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                    {t('projects.description')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    </motion.section>
  );
}
