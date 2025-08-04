import { projects } from '@/data/projects';
import type { Project } from '@/types';

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
