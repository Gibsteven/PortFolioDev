'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, User, FileText, Briefcase, Github, Linkedin, Menu, X } from 'lucide-react';
import type { Profile } from '@/types';
import { useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Skeleton } from './ui/skeleton';
import { useState } from 'react';
import { Button } from './ui/button';

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
        <div className="flex flex-col h-full bg-[#040b14] text-white p-6">
            <div className="text-center mb-8">
                {loading ? <Skeleton className="w-28 h-28 rounded-full mx-auto mb-4 bg-gray-700" /> :
                <Image
                    src={profile?.profilePicture || "https://placehold.co/120x120.png"}
                    alt="Profile"
                    width={120}
                    height={120}
                    className="rounded-full mx-auto mb-4 border-4 border-gray-700"
                    data-ai-hint="professional portrait"
                />}
                <h1 className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-32 mx-auto bg-gray-700" /> : profile?.name || 'Developer Name'}</h1>
                <div className="flex justify-center gap-3 mt-3">
                    <a href="https://github.com/Gibsteven" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Github size={20} /></a>
                    <a href="https://www.linkedin.com/in/chogho-abel-ezechiel-esteve-646972345" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Linkedin size={20} /></a>
                    <a href="https://wa.me/2250788645339" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><WhatsappIcon className="w-5 h-5" /></a>
                </div>
            </div>

            <nav className="flex-grow">
                <ul>
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                onClick={(e) => handleScroll(e, link.href)}
                                className="flex items-center gap-4 px-3 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-md transition-colors"
                            >
                                <link.icon size={20} />
                                <span>{link.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <footer className="text-center text-xs text-gray-500">
                <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
                <Button asChild variant="link" size="sm" className="text-gray-500 p-0 h-auto">
                    <Link href="/admin">Admin</Link>
                </Button>
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
            
            <aside className="hidden md:block fixed top-0 left-0 w-80 h-full z-40">
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
