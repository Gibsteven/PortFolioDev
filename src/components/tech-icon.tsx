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
  BrainCircuit,
  GitMerge,
  Figma,
} from 'lucide-react';
import type { ReactElement } from 'react';

const iconMap: Record<string, ReactElement> = {
  'react': <Component className="w-4 h-4" />,
  'next.js': <Component className="w-4 h-4" />,
  'react native': <Smartphone className="w-4 h-4" />,
  'node.js': <Server className="w-4 h-4" />,
  'express': <Server className="w-4 h-4" />,
  'typescript': <Code className="w-4 h-4" />,
  'firebase': <Cloud className="w-4 h-4" />,
  'postgresql': <Database className="w-4 h-4" />,
  'prisma': <DatabaseZap className="w-4 h-4" />,
  'tailwind css': <Wind className="w-4 h-4" />,
  'aws s3': <Cloud className="w-4 h-4" />,
  'socket.io': <MessageCircle className="w-4 h-4" />,
  'stripe': <PenTool className="w-4 h-4" />,
  'charts.js': <PenTool className="w-4 h-4" />,
  'genkit': <BrainCircuit className="w-4 h-4" />,
  'git': <GitMerge className="w-4 h-4" />,
  'figma': <Figma className="w-4 h-4" />,
};

export function TechIcon({ tech }: { tech: string }) {
  return iconMap[tech.toLowerCase()] || <TerminalSquare className="w-4 h-4" />;
}
