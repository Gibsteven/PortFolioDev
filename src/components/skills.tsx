'use client';

import { useLanguage } from '@/hooks/use-language';
import { Badge } from './ui/badge';
import { TechIcon } from './tech-icon';
import { motion } from 'framer-motion';

const skillsList = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 
  'Tailwind CSS', 'Firebase', 'PostgreSQL', 'Prisma', 'Genkit', 'Git', 'Figma'
];

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
        duration: 0.3,
      },
    },
  };

export function Skills() {
    const { t } = useLanguage();

    return (
        <section id="skills" className="py-16 sm:py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tighter mb-3">
                        {t('skills.title')}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {t('skills.description')}
                    </p>
                </div>

                <motion.div 
                    className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                >
                    {skillsList.map((skill) => (
                        <motion.div key={skill} variants={itemVariants}>
                             <Badge variant="outline" className="flex items-center gap-2 py-1.5 px-3 text-sm transition-all hover:bg-primary/10 hover:shadow-md hover:-translate-y-0.5">
                                <TechIcon tech={skill} />
                                <span>{skill}</span>
                            </Badge>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
