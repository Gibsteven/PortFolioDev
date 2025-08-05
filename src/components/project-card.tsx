'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group overflow-hidden relative h-full flex flex-col">
        <CardHeader className="p-0">
            <div className="aspect-video relative">
                <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                data-ai-hint={project['data-ai-hint']}
                />
            </div>
        </CardHeader>
        <CardContent className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center text-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <CardTitle className="text-white font-headline text-xl mb-2">{project.title}</CardTitle>
            <CardDescription className="text-gray-300 mb-4">{project.type}</CardDescription>
             <Link href={`/projects/${project.id}`} className="bg-primary text-white rounded-full p-3 hover:bg-primary/80 transition-colors">
                <Plus size={24} />
             </Link>
        </CardContent>
    </Card>
  );
}
