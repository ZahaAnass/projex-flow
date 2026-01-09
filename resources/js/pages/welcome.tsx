import { Link, Head } from '@inertiajs/react';
import { Button } from "@/components/ui/button";

export default function Welcome({ auth }: any) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center text-zinc-900">
                <div className="w-full max-w-4xl px-6 text-center">
                    <h1 className="text-5xl font-bold tracking-tight mb-6">
                        Projex<span className="text-blue-600">Flow</span>
                    </h1>
                    <p className="text-xl text-zinc-500 mb-10 max-w-2xl mx-auto">
                        Streamline your team's workflow. Manage projects, assign tasks, and track progress in one unified dashboard.
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        {auth.user ? (
                            <Link href={'/dashboard'}>
                                <Button size="lg" className="text-lg px-8">Go to Dashboard</Button>
                            </Link>
                        ) : (
                            <>
                                <Link href={'/login'}>
                                    <Button size="lg" variant="default" className="text-lg px-8">Log in</Button>
                                </Link>
                                <Link href={'/register'}>
                                    <Button size="lg" variant="outline" className="text-lg px-8">Register</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <footer className="absolute bottom-6 text-sm text-zinc-400">
                    &copy; {new Date().getFullYear()} ProjexFlow Management System
                </footer>
            </div>
        </>
    );
}
