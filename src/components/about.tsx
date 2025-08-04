'use client';

import { useLanguage } from '@/hooks/use-language';
import { motion } from 'framer-motion';
import Image from 'next/image';
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
  const [profile, loading] = useObjectVal<Profile>(ref(database, 'profile'));

  if (loading) {
    return (
        <section id="about" className="py-24 sm:py-32">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <Skeleton className="rounded-full w-full max-w-sm h-auto aspect-square mx-auto" />
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-1/2" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                    </div>
                </div>
            </div>
        </section>
    )
  }

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
                src={profile?.profilePicture || "https://placehold.co/800x800.png"} 
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
              {profile?.aboutDescription || t('about.description')}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
