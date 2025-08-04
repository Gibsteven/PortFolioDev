// This is a new file
'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export function Footer() {
    const { t } = useLanguage();
  return (
    <footer className="py-8 border-t bg-secondary/50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Logo className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Dev Showcase. {t('footer.rights')}
          </span>
        </div>
        <div className="flex items-center gap-4">
            <Link href="#" aria-label="Github">
                <Github className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
            <Link href="#" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
            <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
        </div>
      </div>
    </footer>
  );
}
