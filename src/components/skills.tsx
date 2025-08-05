'use client';

import { useLanguage } from '@/hooks/use-language';
import { motion } from 'framer-motion';

const skillsList = [
  {name: 'React', value: 100},
  {name: 'Next.js', value: 95},
  {name: 'TypeScript', value: 90},
  {name: 'Node.js', value: 85}, 
  {name: 'Tailwind CSS', value: 100},
  {name: 'Firebase', value: 90},
  {name: 'PostgreSQL', value: 75},
  {name: 'Prisma', value: 80},
  {name: 'Genkit', value: 70},
  {name: 'Git', value: 95},
  {name: 'Figma', value: 60},
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
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
};

export function Skills() {
    const { t } = useLanguage();

    return (
        <motion.section
          id="skills"
          className="py-12 sm:py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
            <div className="text-center mb-10">
                <h2 className="font-headline text-3xl font-bold border-b-4 border-primary inline-block pb-2">
                    {t('skills.title')}
                </h2>
                <p className="text-muted-foreground mt-4 max-w-3xl mx-auto">
                    {t('skills.description')}
                </p>
            </div>

            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
                variants={containerVariants}
            >
                {skillsList.map((skill) => (
                    <motion.div key={skill.name} variants={itemVariants}>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{skill.name}</span>
                            <span className="text-sm font-medium text-muted-foreground">{skill.value}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full" style={{width: `${skill.value}%`}}></div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.section>
    );
}
