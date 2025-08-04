'use client';

import { Hero } from '@/components/hero';
import { Projects } from '@/components/projects';
import { Skills } from '@/components/skills';
import { About } from '@/components/about';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
    </>
  );
}
