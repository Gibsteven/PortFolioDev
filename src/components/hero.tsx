'use client';

import { useLanguage } from '@/hooks/use-language';
import { motion } from 'framer-motion';
import { useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { database } from '@/lib/firebase';
import type { Profile } from '@/types';
import { Skeleton } from './ui/skeleton';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"


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

const carouselImages = [
    { src: "https://placehold.co/1920x1080.png", alt: "Nature morte avec des roses", hint: "photographie nature morte roses" },
    { src: "https://placehold.co/1920x1080.png", alt: "Podium en bois sur fond vert", hint: "podium bois exposition" },
    { src: "https://placehold.co/1920x1080.png", alt: "Personnage 3D sortant d'un smartphone", hint: "personnage 3d smartphone" },
]

export function Hero() {
  const { t } = useLanguage();
  const [profile, loading] = useObjectVal<Profile>(ref(database, 'profile'));
  const [typedText, setTypedText] = useState('');
  
  const heroTitle = loading ? <Skeleton className="h-10 w-3/4" /> :
    profile?.name ? `I'm ${profile.name}` : t('hero.title');
  
  const stringsToType = [
      "une Touche d'Élégance",
      "une Vision Durable",
      "une Expérience Immersive"
  ];

  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

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

    const typingTimeout = setTimeout(type, 1000); // Initial delay

    return () => {
      clearTimeout(typingTimeout);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section 
        id="hero" 
        className="h-screen w-full flex flex-col justify-center items-start text-left relative overflow-hidden"
    >
        <Carousel
            plugins={[plugin.current]}
            className="w-full h-full absolute inset-0"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent className="h-full">
                {carouselImages.map((image, index) => (
                    <CarouselItem key={index} className="h-full">
                        <div className="w-full h-full relative">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover"
                                data-ai-hint={image.hint}
                                priority={index === 0}
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white bg-black/30 hover:bg-black/50 border-white/50" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white bg-black/30 hover:bg-black/50 border-white/50" />
        </Carousel>

        <div className="absolute inset-0 bg-black/50 z-10" />

        <motion.div 
            className="container mx-auto px-4 text-white relative z-20"
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
                <span>Je suis {typedText}</span>
                <span className="animate-ping">|</span>
            </motion.div>
      </motion.div>
    </section>
  );
}
