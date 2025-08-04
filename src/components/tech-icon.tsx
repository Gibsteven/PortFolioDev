import {
  Code,
  Smartphone,
  Server,
  Database,
  Cloud,
  TerminalSquare,
  PenTool,
  Wind,
  Component,
  DatabaseZap,
  MessageCircle,
} from 'lucide-react';
import type { ReactElement } from 'react';

const iconMap: Record<string, ReactElement> = {
  'React': <Component className="w-4 h-4" />,
  'Next.js': <Component className="w-4 h-4" />,
  'React Native': <Smartphone className="w-4 h-4" />,
  'Node.js': <Server className="w-4 h-4" />,
  'Express': <Server className="w-4 h-4" />,
  'TypeScript': <Code className="w-4 h-4" />,
  'Firebase': <Cloud className="w-4 h-4" />,
  'PostgreSQL': <Database className="w-4 h-4" />,
  'Prisma': <DatabaseZap className="w-4 h-4" />,
  'Tailwind CSS': <Wind className="w-4 h-4" />,
  'AWS S3': <Cloud className="w-4 h-4" />,
  'Socket.io': <MessageCircle className="w-4 h-4" />,
  'Stripe': <PenTool className="w-4 h-4" />,
  'Charts.js': <PenTool className="w-4 h-4" />,
};

export function TechIcon({ tech }: { tech: string }) {
  return iconMap[tech.toLowerCase()] || <TerminalSquare className="w-4 h-4" />;
}
