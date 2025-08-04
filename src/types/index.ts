export type Project = {
  id: string;
  title: string;
  type: 'Web App' | 'Mobile App' | 'Full-Stack';
  shortDescription: string;
  longDescription: string;
  image: string;
  video?: string | null;
  tags: string[];
  url?: string;
  'data-ai-hint': string;
};
