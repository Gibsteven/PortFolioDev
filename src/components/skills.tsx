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
        duration: 0.4,
      },
    },
  };

export function Skills() {
    const { t } = useLanguage();

    return (
        <section id="skills" className="py-24 sm:py-32">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-4">
                        {t('skills.title')}
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        {t('skills.description')}
                    </p>
                </div>

                <motion.div 
                    className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                >
                    {skillsList.map((skill) => (
                        <motion.div key={skill} variants={itemVariants}>
                             <Badge variant="outline" className="flex items-center gap-2 py-2 px-4 text-base transition-all hover:bg-primary/10 hover:shadow-md hover:-translate-y-1">
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
