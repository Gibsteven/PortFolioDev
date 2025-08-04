'use client';

import { useLanguage } from '@/hooks/use-language';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { database } from '@/lib/firebase';
import type { Profile } from '@/types';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
      duration: 0.4,
    },
  },
};

export function About() {
  const { t } = useLanguage();
  const [profile, loading] = useObjectVal<Profile>(ref(database, 'profile'));

  if (loading) {
    return (
        <section id="about" className="py-16 sm:py-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <Skeleton className="rounded-full w-full max-w-xs h-auto aspect-square mx-auto" />
                    <div className="space-y-3">
                        <Skeleton className="h-10 w-1/2" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-3/4" />
                    </div>
                </div>
            </div>
        </section>
    )
  }

  return (
    <motion.section
      id="about"
      className="py-16 sm:py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          <motion.div variants={itemVariants}>
            <div className="relative aspect-square rounded-full overflow-hidden shadow-2xl w-full max-w-xs mx-auto">
              <Image 
                src={profile?.profilePicture || "https://placehold.co/600x600.png"} 
                alt="Profile picture"
                fill
                className="object-cover"
                data-ai-hint="professional portrait" 
              />
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="text-center lg:text-left">
            <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tighter mb-4">
              {t('about.title')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {profile?.aboutDescription || t('about.description')}
            </p>
          </motion.div>
        </div>

        {profile?.cvUrl && (
          <motion.div variants={itemVariants} className="text-center">
             <h3 className="font-headline text-xl md:text-2xl font-bold tracking-tighter mb-4">
                Mon CV
            </h3>
            <div className="mb-4">
                <iframe src={profile.cvUrl} className="w-full max-w-3xl mx-auto h-[400px] border rounded-lg shadow-lg" title="CV"></iframe>
            </div>
            <Button asChild size="sm">
                <a href={profile.cvUrl} target="_blank" download>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger le CV
                </a>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
