'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { database } from '@/lib/firebase';
import type { Profile } from '@/types';
import { Skeleton } from './ui/skeleton';

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
  const [profile, loading] = useObjectVal<Profile>(ref(database, 'profile'));
  
  const heroTitle = loading ? <Skeleton className="h-14 w-3/4" /> :
    profile?.name ? `Hi, I'm ${profile.name}` : t('hero.title');

  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-background to-secondary/30">
        <motion.div 
            className="container mx-auto px-4 text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.h1 
                className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter mb-6"
                variants={itemVariants}
            >
                {heroTitle}
            </motion.h1>
            <motion.p 
                className="text-muted-foreground max-w-3xl mx-auto mb-8 md:text-lg"
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
