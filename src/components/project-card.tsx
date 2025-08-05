'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
        <Card className="group overflow-hidden relative h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5">
            <CardHeader className="p-0">
                <div className="aspect-video relative">
                    <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={project['data-ai-hint']}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-3 flex-grow flex flex-col">
                <CardTitle className="text-base font-headline mb-1 group-hover:text-primary transition-colors">{project.title}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground flex-grow">{project.shortDescription}</CardDescription>
                <div className="flex justify-between items-center mt-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">{project.type}</span>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:rotate-45" />
                </div>
            </CardContent>
        </Card>
    </Link>
  );
}
