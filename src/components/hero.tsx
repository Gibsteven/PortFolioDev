'use client';

import { useLanguage } from '@/hooks/use-language';
import { motion } from 'framer-motion';
import { useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { database } from '@/lib/firebase';
import type { Profile } from '@/types';
import { Skeleton } from './ui/skeleton';
import { useEffect, useState } from 'react';

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
  const [typedText, setTypedText] = useState('');
  
  const heroTitle = loading ? <Skeleton className="h-10 w-3/4" /> :
    profile?.name ? `I'm ${profile.name}` : t('hero.title');
  
  const stringsToType = [
      "a Developer",
      "a Freelancer",
      "a Designer"
  ];

  useEffect(() => {
    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const type = () => {
        const currentString = stringsToType[stringIndex];
        
        if (isDeleting) {
            setTypedText(currentString.substring(0, charIndex - 1));
            charIndex--;
        } else {
            setTypedText(currentString.substring(0, charIndex + 1));
            charIndex++;
        }

        let typeSpeed = isDeleting ? 75 : 150;

        if (!isDeleting && charIndex === currentString.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            stringIndex = (stringIndex + 1) % stringsToType.length;
            typeSpeed = 500; // Pause before typing new string
        }

        timeoutId = setTimeout(type, typeSpeed);
    };

    type();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section 
        id="hero" 
        className="h-screen w-full flex flex-col justify-center items-start text-left bg-cover bg-center bg-no-repeat pl-[5%]"
        style={{backgroundImage: "url('https://placehold.co/1920x1080.png')"}}
        data-ai-hint="abstract code"
    >
        <div className="absolute inset-0 bg-black/50" />
        <motion.div 
            className="container mx-auto px-4 text-white relative z-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.h1 
                className="font-headline text-3xl md:text-5xl font-bold tracking-tight mb-3"
                variants={itemVariants}
            >
                {heroTitle}
            </motion.h1>
            <motion.div 
                className="text-md md:text-xl max-w-2xl"
                variants={itemVariants}
            >
                <span>I am {typedText}</span>
                <span className="animate-ping">|</span>
            </motion.div>
      </motion.div>
    </section>
  );
}
