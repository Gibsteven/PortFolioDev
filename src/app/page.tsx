'use client';

import { ProjectCard } from '@/components/project-card';
import { getAllProjects } from '@/lib/project-utils';
import { useLanguage } from '@/hooks/use-language';

export default function Home() {
  const projects = getAllProjects();
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tighter mb-4">
          {t('home.title')}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('home.subtitle')}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
