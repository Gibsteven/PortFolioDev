import { getProjectById } from '@/lib/project-utils';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TechIcon } from '@/components/tech-icon';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { DescriptionEnhancer } from '@/components/description-enhancer';

type ProjectPageProps = {
  params: {
    id: string;
  };
};

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          <header className="mb-8">
            <Badge variant="secondary" className="mb-2">{project.type}</Badge>
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              {project.title}
            </h1>
            {project.url && (
              <Button asChild variant="outline">
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Project
                </a>
              </Button>
            )}
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <p>{project.longDescription}</p>
          </div>
          
          <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Tech Stack</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-2 py-1 px-3">
                        <TechIcon tech={tag} />
                        <span>{tag}</span>
                    </Badge>
                ))}
                </div>
            </CardContent>
          </Card>

        </div>
        <aside className="lg:w-1/3">
          <div className="sticky top-24">
            <div className="aspect-video relative overflow-hidden rounded-lg shadow-lg mb-8">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                data-ai-hint={project['data-ai-hint']}
              />
            </div>
            <DescriptionEnhancer initialDescription={project.longDescription} />
          </div>
        </aside>
      </div>
    </div>
  );
}
