import { Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { ThemeToggle } from '@/components/theme-toggle';
import { ReactNode } from 'react';

interface MarketingLayoutProps {
    children: ReactNode;
    auth: any;
}

export default function MarketingLayout({ children, auth }: MarketingLayoutProps) {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 flex flex-col font-sans selection:bg-blue-100 dark:selection:bg-blue-900 transition-colors duration-300">

            {/* --- Global Public Navbar --- */}
            <nav className="border-b border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <Zap size={18} fill="currentColor" />
                        </div>
                        <span className="text-zinc-900 dark:text-white">Projex<span className="text-blue-600">Flow</span></span>
                    </Link>

                    {/* Auth & Theme Buttons */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        {auth?.user ? (
                            <Link href="/dashboard">
                                <Button>Dashboard <ArrowRight className="ml-2 w-4 h-4" /></Button>
                            </Link>
                        ) : (
                            <>
                                {/* Hidden on very small screens to save space, but visible on sm and up */}
                                <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hidden sm:block">
                                    Sign in
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* --- Page Specific Content Goes Here --- */}
            <main className="flex-1">
                {children}
            </main>

            {/* --- Global Public Footer --- */}
            <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 py-12 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
                        <Zap size={18} className="text-blue-600" fill="currentColor" />
                        <span>ProjexFlow</span>
                    </div>
                    <div className="flex gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        <Link href="/pricing" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Pricing</Link>
                        <Link href="/about" className="hover:text-zinc-900 dark:hover:text-white transition-colors">About</Link>
                        <Link href="/contact" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Contact</Link>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        &copy; {new Date().getFullYear()} ProjexFlow Inc. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
