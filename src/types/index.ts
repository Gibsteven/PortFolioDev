export type Project = {
  id: string;
  title: string;
  type: 'Web App' | 'Mobile App' | 'Full-Stack';
  shortDescription: string;
  longDescription: string;
  image: string;
  imagePath?: string; // Path in Firebase Storage
  video?: string;
  videoPath?: string; // Path in Firebase Storage
  tags: string[];
  url?: string;
  'data-ai-hint': string;
  status: 'active' | 'suspended';
};

export type Profile = {
  name: string;
  aboutDescription: string;
  profilePicture: string;
  profilePicturePath?: string;
  cvUrl?: string;
  cvPath?: string;
  website?: string;
  phone?: string;
  city?: string;
  degree?: string;
  email?: string;
  freelance?: string;
};
