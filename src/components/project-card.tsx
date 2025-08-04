'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useLanguage();
  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1">
        <CardHeader className="p-4">
          <div className="aspect-[4/3] relative overflow-hidden rounded-t-md">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={project['data-ai-hint']}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <Badge variant="secondary" className="mb-2 text-xs">{project.type}</Badge>
          <CardTitle className="font-headline text-xl mb-1">{project.title}</CardTitle>
          <CardDescription className="text-sm">{project.shortDescription}</CardDescription>
        </CardContent>
        <CardFooter className="p-4">
           <div className="text-xs font-medium text-primary group-hover:text-accent flex items-center gap-1">
            {t('projectCard.viewProject')} <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
           </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
