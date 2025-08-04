// This is a new file
'use client';

import { useLanguage } from '@/hooks/use-language';
import { motion } from 'framer-motion';
import Image from 'next/image';

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

export function About() {
  const { t } = useLanguage();

  return (
    <motion.section
      id="about"
      className="py-24 sm:py-32"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={itemVariants}>
            <div className="relative aspect-square rounded-full overflow-hidden shadow-2xl w-full max-w-sm mx-auto">
              <Image 
                src="https://placehold.co/800x800.png" 
                alt="Profile picture"
                fill
                className="object-cover"
                data-ai-hint="professional portrait" 
              />
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="text-center lg:text-left">
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-6">
              {t('about.title')}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {t('about.description')}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
