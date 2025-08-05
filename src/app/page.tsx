'use client';

import { Hero } from '@/components/hero';
import { Projects } from '@/components/projects';
import { Skills } from '@/components/skills';
import { About } from '@/components/about';

export default function Home() {
  return (
    <div id="home">
      <Hero />
      <div className="container mx-auto px-4">
        <About />
        <Skills />
        <Projects />
      </div>
    </div>
  );
}
