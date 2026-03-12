import { Head, Link } from '@inertiajs/react';
import MarketingLayout from '@/layouts/marketing-layout';
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard, ShieldCheck, BarChart3,
    ArrowRight, CheckCircle2, Users, Rocket
} from "lucide-react";
import { AreaChart, Area, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const chartData = [
    { name: 'Mon', tasks: 12 }, { name: 'Tue', tasks: 18 }, { name: 'Wed', tasks: 15 },
    { name: 'Thu', tasks: 25 }, { name: 'Fri', tasks: 20 }, { name: 'Sat', tasks: 32 }, { name: 'Sun', tasks: 28 },
];

export default function Welcome({ auth }: any) {
    return (
        <MarketingLayout auth={auth}>
            <Head title="Welcome to ProjexFlow" />

            {/* --- 1. Hero Section --- */}
            <section className="relative pt-20 pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 text-center">

                    <div className="inline-flex items-center rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-sm text-blue-800 dark:text-blue-300 mb-8 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                        ProjexFlow 2.0 is now live
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6 transition-colors animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
                        Manage projects with <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            clarity and precision.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed transition-colors animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                        Streamline your workflow, assign tasks, and track progress in real-time.
                        The all-in-one platform for Admins, Team Leaders, and Clients.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
                        {auth.user ? (
                            <Link href="/dashboard"><Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-blue-500/20">Go to Dashboard</Button></Link>
                        ) : (
                            <>
                                <Link href="/register"><Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-blue-500/20">Start for Free</Button></Link>
                                <Link href="/login">
                                    <Button variant="outline" size="lg" className="h-12 px-8 text-base bg-white dark:bg-zinc-950 dark:text-zinc-200 dark:border-zinc-800 dark:hover:bg-zinc-900 transition-colors">
                                        Existing User
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Dashboard Preview Visualization */}
                    <div className="relative mx-auto max-w-5xl rounded-xl bg-zinc-900/5 dark:bg-white/5 p-2 ring-1 ring-inset ring-zinc-900/10 dark:ring-white/10 lg:rounded-2xl lg:p-4 transition-all duration-300 animate-in zoom-in-95 fade-in duration-1000 delay-700">
                        <div className="rounded-md bg-white dark:bg-zinc-900 shadow-2xl ring-1 ring-zinc-900/5 dark:ring-white/10 overflow-hidden transition-colors">
                            <div className="flex items-center border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 px-4 py-3 transition-colors">
                                <div className="flex space-x-1.5">
                                    <div className="h-3 w-3 rounded-full bg-red-400" />
                                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                                    <div className="h-3 w-3 rounded-full bg-green-400" />
                                </div>
                            </div>
                            <div className="p-8 grid gap-8 md:grid-cols-3">
                                <div className="space-y-2">
                                    <div className="h-24 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 p-4 transition-colors">
                                        <div className="h-2 w-12 bg-blue-200 dark:bg-blue-800 rounded mb-2" />
                                        <div className="h-8 w-16 bg-blue-600 dark:bg-blue-500 rounded" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-24 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 p-4 transition-colors">
                                        <div className="h-2 w-12 bg-zinc-200 dark:bg-zinc-600 rounded mb-2" />
                                        <div className="h-8 w-16 bg-zinc-800 dark:bg-zinc-500 rounded" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-24 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 p-4 transition-colors">
                                        <div className="h-2 w-12 bg-zinc-200 dark:bg-zinc-600 rounded mb-2" />
                                        <div className="h-8 w-16 bg-zinc-800 dark:bg-zinc-500 rounded" />
                                    </div>
                                </div>
                                <div className="col-span-3 h-48 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-4 transition-colors">
                                    <div className="h-full w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
                                                <Tooltip contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }} itemStyle={{ color: '#2563eb' }} />
                                                <Area type="monotone" dataKey="tasks" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 3. Features Grid --- */}
            <section className="bg-white dark:bg-zinc-950 py-24 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl transition-colors">
                            Everything you need to ship faster.
                        </h2>
                        <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 transition-colors">
                            Powerful features tailored for every role in your organization.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors hover:-translate-y-1 duration-300">
                            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-6">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">Role-Based Access</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                Secure environments for Admins, Team Leaders, Members, and Clients. Everyone sees exactly what they need.
                            </p>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors hover:-translate-y-1 duration-300">
                            <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center mb-6">
                                <LayoutDashboard className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">Task Management</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                Create, assign, and track tasks with ease. Set priorities, due dates, and monitor status changes in real-time.
                            </p>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors hover:-translate-y-1 duration-300">
                            <div className="h-12 w-12 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg flex items-center justify-center mb-6">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">Project Analytics</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                Visual insights into project completion rates, team performance, and overdue tasks at a glance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 4. How It Works (Workflow) --- */}
            <section className="bg-zinc-50 dark:bg-zinc-900 py-24 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl transition-colors">
                            Built for perfect workflow.
                        </h2>
                        <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 transition-colors">
                            From project creation to client delivery in three simple steps.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Hidden on mobile) */}
                        <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-teal-200 dark:from-blue-900 dark:via-indigo-900 dark:to-teal-900 -z-10" />

                        <div className="relative text-center">
                            <div className="h-12 w-12 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-blue-500/30 ring-4 ring-white dark:ring-zinc-900">1</div>
                            <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Create & Scope</h4>
                            <p className="text-zinc-500 dark:text-zinc-400">Admins set up the project, define Sprints, and assign a dedicated Team Leader.</p>
                        </div>

                        <div className="relative text-center">
                            <div className="h-12 w-12 mx-auto bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-indigo-500/30 ring-4 ring-white dark:ring-zinc-900">2</div>
                            <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Execute & Track</h4>
                            <p className="text-zinc-500 dark:text-zinc-400">Team members execute tasks on their Kanban boards and log working hours seamlessly.</p>
                        </div>

                        <div className="relative text-center">
                            <div className="h-12 w-12 mx-auto bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-teal-500/30 ring-4 ring-white dark:ring-zinc-900">3</div>
                            <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Deliver & Impress</h4>
                            <p className="text-zinc-500 dark:text-zinc-400">Clients log into their VIP portal to see real-time progress without internal clutter.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 5. Final Bottom CTA --- */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600 dark:bg-blue-900/20 -z-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 dark:to-black/50 -z-10" />

                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-white mb-6">
                        Ready to take control of your projects?
                    </h2>
                    <p className="text-lg text-blue-100 dark:text-blue-200 mb-10 max-w-2xl mx-auto">
                        Join thousands of teams who are already shipping faster, communicating better, and keeping clients happier.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {auth.user ? (
                            <Link href="/dashboard"><Button size="lg" variant="secondary" className="h-14 px-8 text-base bg-white text-blue-600 hover:bg-zinc-50">Enter Workspace</Button></Link>
                        ) : (
                            <Link href="/register"><Button size="lg" variant="secondary" className="h-14 px-8 text-base bg-white text-blue-600 hover:bg-zinc-50 shadow-xl">Get Started for Free</Button></Link>
                        )}
                    </div>
                </div>
            </section>

        </MarketingLayout>
    );
}
