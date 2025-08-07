'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, User, FileText, Briefcase, Github, Linkedin, Menu, X } from 'lucide-react';
import type { Profile } from '@/types';
import { useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { database, auth } from '@/lib/firebase';
import { Skeleton } from './ui/skeleton';
import { useState } from 'react';
import { Button } from './ui/button';
import { LanguageSwitcher } from './language-switcher';
import { useAuthState } from 'react-firebase-hooks/auth';

function WhatsappIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            {...props}
        >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
    );
}


const navLinks = [
    { name: 'Home', href: '#home', icon: Home },
    { name: 'About', href: '#about', icon: User },
    { name: 'Skills', href: '#skills', icon: FileText },
    { name: 'Projects', href: '#projects', icon: Briefcase },
];


export function Sidebar() {
    const [profile, loading] = useObjectVal<Profile>(ref(database, 'profile'));
    const [user, authLoading] = useAuthState(auth);
    const [isOpen, setIsOpen] = useState(false);

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        if (isOpen) {
            setIsOpen(false);
        }
    };
    
    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#040b14] text-white p-4">
            <div className="text-center mb-6">
                {loading ? <Skeleton className="w-24 h-24 rounded-full mx-auto mb-3 bg-gray-700" /> :
                <Image
                    src={profile?.profilePicture || "https://placehold.co/100x100.png"}
                    alt="Profile"
                    width={100}
                    height={100}
                    className="rounded-full mx-auto mb-3 border-4 border-gray-700"
                    data-ai-hint="professional portrait"
                />}
                <h1 className="text-xl font-bold">{loading ? <Skeleton className="h-7 w-28 mx-auto bg-gray-700" /> : profile?.name || 'Developer Name'}</h1>
                <div className="flex justify-center gap-2 mt-2">
                    <a href="https://github.com/Gibsteven" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Github size={18} /></a>
                    <a href="https://www.linkedin.com/in/chogho-abel-ezechiel-esteve-646972345" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Linkedin size={18} /></a>
                    <a href="https://wa.me/2250788645339" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><WhatsappIcon className="w-4 h-4" /></a>
                </div>
            </div>

            <nav className="flex-grow">
                <ul>
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                onClick={(e) => handleScroll(e, link.href)}
                                className="flex items-center gap-3 px-2 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-md transition-colors text-sm"
                            >
                                <link.icon size={18} />
                                <span>{link.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="flex justify-center mb-3">
              <LanguageSwitcher />
            </div>

            <footer className="text-center text-xs text-gray-500">
                <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
                {!authLoading && user && (
                    <Button asChild variant="link" size="sm" className="text-gray-500 p-0 h-auto">
                        <Link href="/admin">Admin</Link>
                    </Button>
                )}
            </footer>
        </div>
    );

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden fixed top-4 right-4 z-50 text-white bg-primary hover:bg-primary/90"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X /> : <Menu />}
            </Button>
            
            <aside className="hidden md:block fixed top-0 left-0 w-60 h-full z-40">
                <SidebarContent />
            </aside>
            
            {isOpen && (
                <div className="md:hidden fixed inset-0 z-30">
                     <SidebarContent />
                </div>
            )}
        </>
    );
}
