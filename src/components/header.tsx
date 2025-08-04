import Link from 'next/link';
import { Logo } from '@/components/icons';

export function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo className="h-6 w-6 text-primary group-hover:animate-pulse" />
          <span className="font-headline text-xl font-bold tracking-tighter text-foreground">
            Dev Showcase
          </span>
        </Link>
      </div>
    </header>
  );
}
