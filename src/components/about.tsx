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
import { Download, ChevronRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

export function About() {
  const { t } = useLanguage();
  const [profile, loading] = useObjectVal<Profile>(ref(database, 'profile'));

  const renderDetail = (label: string, value: string | undefined) => (
      <li className="flex items-center gap-2">
        <ChevronRight className="text-primary w-4 h-4" />
        <strong>{label}:</strong>
        <span>{value || 'N/A'}</span>
      </li>
  );
  
  if (loading) {
    return (
        <section id="about" className="py-12 sm:py-16">
            <div className="text-center mb-10">
                <h2 className="font-headline text-3xl font-bold border-b-4 border-primary inline-block pb-2">About</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Skeleton className="w-full h-96" />
                <div className="md:col-span-2 space-y-4">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-4/5" />
                </div>
            </div>
        </section>
    );
  }

  return (
    <motion.section
      id="about"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
        <div className="text-center mb-10">
            <h2 className="font-headline text-3xl font-bold border-b-4 border-primary inline-block pb-2">About</h2>
            <p className="text-muted-foreground mt-4 max-w-3xl mx-auto">{profile?.aboutDescription || t('about.description')}</p>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-12">
            <motion.div variants={itemVariants}>
              <Image 
                src={profile?.profilePicture || "https://placehold.co/600x600.png"} 
                alt="Profile picture"
                width={600}
                height={600}
                className="object-cover w-full h-auto rounded-md shadow-lg"
                data-ai-hint="professional portrait" 
              />
            </motion.div>

            <motion.div className="md:col-span-2" variants={itemVariants}>
                <h3 className="font-headline text-2xl font-bold text-primary mb-2">Full-Stack Developer</h3>
                <p className="italic mb-4">
                    A passionate developer creating elegant and efficient solutions.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-4">
                    {renderDetail("Website", profile?.website)}
                    {renderDetail("Phone", profile?.phone)}
                    {renderDetail("City", profile?.city)}
                    {renderDetail("Degree", profile?.degree)}
                    {renderDetail("Email", profile?.email)}
                    {renderDetail("Freelance", profile?.freelance)}
                </ul>
                <p className="text-muted-foreground">
                    I enjoy bringing ideas to life, from concept to deployment. I am a lifelong learner, always excited to explore new technologies and improve my craft.
                </p>
            </motion.div>
        </div>

        {profile?.cvUrl && (
          <motion.div variants={itemVariants} className="text-center">
            <h3 className="font-headline text-2xl font-bold border-b-4 border-primary inline-block pb-2 mb-6">
                My Resume
            </h3>
            <div className="mb-4">
                <iframe src={profile.cvUrl} className="w-full max-w-4xl mx-auto h-[500px] border rounded-lg shadow-lg" title="CV"></iframe>
            </div>
            <Button asChild>
                <a href={profile.cvUrl} target="_blank" download>
                    <Download className="mr-2 h-4 w-4" />
                    Download CV
                </a>
            </Button>
          </motion.div>
        )}
    </motion.section>
  );
}
