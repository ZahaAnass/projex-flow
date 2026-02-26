import { Head, Link } from '@inertiajs/react';
import MarketingLayout from '@/layouts/marketing-layout';
import { Button } from "@/components/ui/button";
import { Target, Zap, Shield, Users, Globe, ArrowRight } from "lucide-react";

export default function About({ auth }: any) {
    return (
        <MarketingLayout auth={auth}>
            <Head title="About Us - ProjexFlow" />

            {/* ================= HERO SECTION ================= */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Grid background */}
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

                {/* Glow Effect */}
                <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl opacity-40 dark:opacity-20 pointer-events-none">
                    <div className="aspect-[1155/678] w-[60rem] bg-gradient-to-tr from-blue-600 to-indigo-500" />
                </div>

                <div className="max-w-4xl mx-auto px-6 text-center pt-20">
                    <div className="inline-flex items-center rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-sm text-blue-800 dark:text-blue-300 mb-8 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Our Story
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        We are building the <br className="hidden md:block" /> future of teamwork.
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        ProjexFlow was born from a simple belief: project management software should get out of your way and let your team do their best work.
                    </p>
                </div>
            </section>

            {/* ================= THE MISSION ================= */}
            <section className="pb-24 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">

                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                                Out with the clutter. <br /> In with the clarity.
                            </h2>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                A few years ago, our team was drowning in tools. We had one app for tasks, another for time tracking, and a massive email thread just to keep clients updated. It was a nightmare.
                            </p>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                We realized that standard project management tools were built for managers, not for the people actually doing the work. So, we decided to build ProjexFlow.
                            </p>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                By strictly scoping the views—giving Admins full control, Leaders focus, Users distraction-free boards, and Clients clean read-only portals—we've restored sanity to the modern workspace.
                            </p>
                        </div>

                        {/* Abstract Visual / Stats Card */}
                        <div className="relative mt-8 mb-10">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-20 dark:opacity-30 -z-10"></div>
                            <div className="bg-white dark:bg-zinc-950 p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl grid grid-cols-2 gap-8">
                                <div>
                                    <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-500 mb-2">2026</div>
                                    <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Year Founded</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-500 mb-2">1M+</div>
                                    <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Tasks Completed</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-500 mb-2">99.9%</div>
                                    <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Server Uptime</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-500 mb-2">120+</div>
                                    <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Countries Used</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================= CORE VALUES ================= */}
            <section className="py-32 pt-20 pb-20 bg-zinc-50 dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                            Our Core Values
                        </h2>
                        <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
                            The principles that guide every feature we build and every decision we make.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Value 1 */}
                        <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-all hover:-translate-y-1">
                            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 rounded-lg flex items-center justify-center mb-6">
                                <Target className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">Radical Focus</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                                We strip away the unnecessary. If a feature doesn't help you or your team get work done faster, it doesn't make it into ProjexFlow.
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-all hover:-translate-y-1">
                            <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-500 rounded-lg flex items-center justify-center mb-6">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">Strict Privacy</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                                Your data is yours. We implement enterprise-grade security and strict role-based scopes to ensure the right eyes see the right data.
                            </p>
                        </div>

                        {/* Value 3 */}
                        <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-all hover:-translate-y-1">
                            <div className="h-12 w-12 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-500 rounded-lg flex items-center justify-center mb-6">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">Client Transparency</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                                We believe in keeping clients in the loop without dragging them into the weeds. Beautiful, read-only portals build trust automatically.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= BOTTOM CTA ================= */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <Globe className="w-12 h-12 text-blue-600 dark:text-blue-500 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
                        Join us on our journey.
                    </h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
                        We're just getting started. Create an account today and experience the most streamlined project management platform on the web.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/register">
                            <Button size="lg" className="h-14 px-8 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
                                Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

        </MarketingLayout>
    );
}
