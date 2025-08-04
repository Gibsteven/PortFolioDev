// This is a new file
'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
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
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function Hero() {
  const { t } = useLanguage();
  return (
    <section className="py-32 sm:py-48 bg-gradient-to-b from-background to-secondary/30">
        <motion.div 
            className="container mx-auto px-4 text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.h1 
                className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter mb-6"
                variants={itemVariants}
            >
                {t('hero.title')}
            </motion.h1>
            <motion.p 
                className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
                variants={itemVariants}
            >
                {t('hero.subtitle')}
            </motion.p>
            <motion.div variants={itemVariants}>
                <Button size="lg" asChild>
                    <a href="mailto:contact@example.com">
                        {t('hero.contactButton')} <ArrowRight />
                    </a>
                </Button>
            </motion.div>
      </motion.div>
    </section>
  );
}
