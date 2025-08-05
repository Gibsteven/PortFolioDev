'use client';

import { useLanguage } from '@/hooks/use-language';
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
      staggerChildren: 0.2,
      delayChildren: 0.3,
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
      ease: "easeOut",
    },
  },
};

export function Hero() {
  const { t } = useLanguage();
  const [profile, loading] = useObjectVal<Profile>(ref(database, 'profile'));
  
  const heroTitle = loading ? <Skeleton className="h-12 w-3/4" /> :
    profile?.name ? profile.name : t('hero.title');
  
  const heroSubtitle = loading ? <Skeleton className="h-8 w-1/2 mt-2" /> : t('hero.subtitle');

  return (
    <section 
        id="hero" 
        className="h-screen w-full flex flex-col justify-center items-center text-center bg-cover bg-center bg-no-repeat"
        style={{backgroundImage: "url('https://placehold.co/1920x1080.png?text=')"}}
        data-ai-hint="abstract background"
    >
        <div className="absolute inset-0 bg-black/50" />
        <motion.div 
            className="container mx-auto px-4 text-white relative z-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.h1 
                className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-4"
                variants={itemVariants}
            >
                {heroTitle}
            </motion.h1>
            <motion.p 
                className="text-lg md:text-2xl max-w-3xl mx-auto"
                variants={itemVariants}
            >
                {heroSubtitle}
            </motion.p>
      </motion.div>
    </section>
  );
}
