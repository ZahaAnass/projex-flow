import { Head, Link } from '@inertiajs/react'
import MarketingLayout from '@/layouts/marketing-layout'
import { Button } from "@/components/ui/button"
import { CheckCircle2, HelpCircle } from "lucide-react"
import { useState } from "react"

export default function Pricing({ auth }: any) {

    const [yearly, setYearly] = useState(false)

    return (
        <MarketingLayout auth={auth}>
            <Head title="Pricing - ProjexFlow" />

            {/* ================= HERO ================= */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Grid background */}
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

                {/* Glow */}
                <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl opacity-40 dark:opacity-20 pointer-events-none">
                    <div className="aspect-[1155/678] w-[60rem] bg-gradient-to-tr from-blue-600 to-indigo-500" />
                </div>

                <div className="max-w-4xl mx-auto px-6 text-center pt-20">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">
                        Simple, transparent pricing.
                    </h1>

                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12">
                        Whether you are a solo freelancer or an enterprise team, we have a plan that perfectly fits your workflow. No hidden fees.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-bold transition-colors ${!yearly ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-500"}`}>
                            Monthly
                        </span>

                        <button
                            onClick={() => setYearly(!yearly)}
                            className="relative w-14 h-7 bg-blue-600 rounded-full flex items-center px-1 transition-colors hover:bg-blue-700"
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${yearly ? "translate-x-7" : "translate-x-0"}`} />
                        </button>

                        <span className={`text-sm font-bold flex items-center gap-2 transition-colors ${yearly ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-500"}`}>
                            Annually
                            <span className="rounded-full bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                                Save 20%
                            </span>
                        </span>
                    </div>
                </div>
            </section>

            {/* ================= PRICING CARDS ================= */}
            {/* Added immense padding-bottom (pb-32) to ensure it NEVER overlaps the FAQ */}
            <section className="pb-32 relative z-10">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Added py-8 to the grid container to give the translated middle card room to breathe */}
                    <div className="grid lg:grid-cols-3 gap-8 items-stretch py-8">

                        {/* Starter */}
                        {/* Fixed: Solid dark:bg-zinc-950 background so it doesn't look transparent/muddy */}
                        <div className="relative flex flex-col p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Starter</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Perfect for small teams getting started.</p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-end gap-1">
                                    <span className="text-6xl font-extrabold text-zinc-900 dark:text-white">$0</span>
                                    <span className="text-zinc-500 dark:text-zinc-400 font-medium">/forever</span>
                                </div>
                                <div className="h-5 mt-2"></div> {/* Empty space placeholder to match other cards */}
                            </div>

                            <Link href="/register" className="mb-8">
                                <Button variant="outline" className="w-full h-12 text-base font-semibold border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                                    Get Started
                                </Button>
                            </Link>

                            <ul className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300 flex-1">
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> Up to 5 Users</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> 3 Active Projects</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> Basic Kanban Boards</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> Community Support</li>
                            </ul>
                        </div>

                        {/* Professional */}
                        {/* Fixed: Removed scale-105 which caused the overlap. Using lg:-translate-y-4 instead to safely elevate it. */}
                        <div className="relative flex flex-col p-8 rounded-3xl bg-white dark:bg-zinc-950 border-2 border-blue-600 shadow-2xl shadow-blue-500/10 transform lg:-translate-y-4">

                            <div className="mb-6 mt-2">
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Professional</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">For growing agencies that need structure.</p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-end gap-1">
                                    <span className="text-6xl font-extrabold text-zinc-900 dark:text-white">${yearly ? "23" : "29"}</span>
                                    <span className="text-zinc-500 dark:text-zinc-400 font-medium">/month</span>
                                </div>
                                {/* Math Clarity Fix */}
                                <div className="h-5 mt-2">
                                    {yearly && <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Billed $276 annually</span>}
                                </div>
                            </div>

                            <Link href="/register" className="mb-8">
                                <Button className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
                                    Start 14-Day Trial
                                </Button>
                            </Link>

                            <ul className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300 flex-1">
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> Unlimited Users</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> Unlimited Projects</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> Time Tracking & Sprints</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> Client Read-Only Portals</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> Advanced Analytics</li>
                            </ul>
                        </div>

                        {/* Enterprise */}
                        <div className="relative flex flex-col p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Enterprise</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Custom security and dedicated support.</p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-end gap-1">
                                    <span className="text-6xl font-extrabold text-zinc-900 dark:text-white">${yearly ? "79" : "99"}</span>
                                    <span className="text-zinc-500 dark:text-zinc-400 font-medium">/month</span>
                                </div>
                                {/* Math Clarity Fix */}
                                <div className="h-5 mt-2">
                                    {yearly && <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Billed $948 annually</span>}
                                </div>
                            </div>

                            <Link href="/contact" className="mb-8">
                                <Button variant="outline" className="w-full h-12 text-base font-semibold border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                                    Contact Sales
                                </Button>
                            </Link>

                            <ul className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300 flex-1">
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> Everything in Pro</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> Custom Roles & Permissions</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> SSO Authentication</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> 24/7 Priority Support</li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================= FAQ ================= */}
            {/* FIXED: Replaced dark:bg-zinc-950/50 with a solid dark:bg-zinc-900 */}
            <section className="py-24 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-6">

                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                            Frequently Asked Questions
                        </h2>
                        <p className="mt-4 text-zinc-500 dark:text-zinc-400">
                            Everything you need to know about the product and billing.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        {[
                            {
                                q: "Can I cancel my subscription?",
                                a: "Yes, you can cancel anytime. You'll keep access until the end of your billing cycle."
                            },
                            {
                                q: "What happens after the 14-day trial?",
                                a: "If you don't upgrade, your account will downgrade to Starter. No data is lost."
                            },
                            {
                                q: "Are there any hidden fees?",
                                a: "No hidden fees. What you see is exactly what you pay."
                            },
                            {
                                q: "Do you offer refunds?",
                                a: "We offer a 30-day money-back guarantee on annual plans."
                            }
                        ].map((item, index) => (
                            <div key={index}>
                                <h4 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white mb-2">
                                    <HelpCircle className="w-5 h-5 text-blue-500 shrink-0" />
                                    {item.q}
                                </h4>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pl-7">
                                    {item.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </MarketingLayout>
    )
}
