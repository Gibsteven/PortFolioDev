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

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-2">
        <CardHeader>
          <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={project['data-ai-hint']}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <Badge variant="secondary" className="mb-2">{project.type}</Badge>
          <CardTitle className="font-headline text-2xl mb-2">{project.title}</CardTitle>
          <CardDescription>{project.shortDescription}</CardDescription>
        </CardContent>
        <CardFooter>
           <div className="text-sm font-medium text-primary group-hover:text-accent flex items-center gap-2">
            View Project <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
           </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
