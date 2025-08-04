import type { Project } from '@/types';

// This file is now a fallback or for seeding, data is managed in Firestore.
export const projects: Project[] = [
  {
    id: 'webapp-01',
    title: 'Modern E-commerce Platform',
    type: 'Web App',
    shortDescription: 'A sleek, fast, and responsive e-commerce site built with Next.js.',
    longDescription: 'This project is a full-featured e-commerce platform designed for a modern shopping experience. It includes user authentication, product catalogs, a shopping cart, and a secure checkout process powered by Stripe. The front-end is built with Next.js for server-side rendering and optimal performance, styled with Tailwind CSS for a clean, utility-first design.',
    image: 'https://placehold.co/1200x800.png',
    video: null,
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Stripe', 'Prisma'],
    url: '#',
    'data-ai-hint': 'ecommerce technology',
  },
  {
    id: 'mobileapp-01',
    title: 'Fitness Tracker Mobile App',
    type: 'Mobile App',
    shortDescription: 'A cross-platform mobile app to track workouts and monitor progress.',
    longDescription: 'A fitness tracking application developed with React Native, allowing it to run on both iOS and Android from a single codebase. Features include workout logging, historical data visualization with charts, user profiles, and goal setting. Firebase is used for the backend, providing real-time data synchronization and authentication.',
    image: 'https://placehold.co/1200x800.png',
    video: null,
    tags: ['React Native', 'Firebase', 'TypeScript', 'Charts.js'],
    url: '#',
    'data-ai-hint': 'fitness app',
  },
  {
    id: 'fullstack-01',
    title: 'Project Management SaaS',
    type: 'Full-Stack',
    shortDescription: 'A collaborative SaaS platform for managing projects and teams.',
    longDescription: 'A comprehensive full-stack application that provides teams with tools for project management. It features task boards, team chat, file uploads, and progress analytics. The stack includes a React front-end, a Node.js/Express API, and a PostgreSQL database. The application is designed to be scalable and secure, with role-based access control and JWT authentication.',
    image: 'https://placehold.co/1200x800.png',
    video: null,
    tags: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Socket.io', 'AWS S3'],
    url: '#',
    'data-ai-hint': 'project management',
  },
];
