'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Github, Linkedin } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Button } from './ui/button';

function WhatsappIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
    );
}

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
            <Button variant="ghost" size="sm" asChild>
                <Link href="/admin">Admin</Link>
            </Button>
            <a href="https://github.com/Gibsteven" target="_blank" rel="noopener noreferrer" aria-label="Github">
                <Github className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            </a>
            <a href="https://www.linkedin.com/in/chogho-abel-ezechiel-esteve-646972345" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            </a>
            <a href="https://wa.me/2250788645339" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <WhatsappIcon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            </a>
        </div>
      </div>
    </footer>
  );
}
