import { Head } from '@inertiajs/react';
import MarketingLayout from '@/layouts/marketing-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Building2, Send, PhoneCall } from "lucide-react";

export default function Contact({ auth }: any) {
    return (
        <MarketingLayout auth={auth}>
            <Head title="Contact Us - ProjexFlow" />

            {/* ================= HERO SECTION ================= */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Grid background */}
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

                {/* Glow */}
                <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl opacity-40 dark:opacity-20 pointer-events-none">
                    <div className="aspect-[1155/678] w-[60rem] bg-gradient-to-tr from-blue-600 to-indigo-500" />
                </div>

                <div className="max-w-4xl mx-auto px-6 text-center pt-20">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Get in touch.
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                        Have a question about pricing, need a custom enterprise plan, or just want to say hi? We'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* ================= CONTACT CONTENT ================= */}
            <section className="pb-32 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-start animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">

                        {/* --- LEFT COLUMN: Contact Info --- */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Let's build something great together.</h2>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    Our team is typically highly responsive and will get back to you within 24 hours. Choose the best way to reach us below.
                                </p>
                            </div>

                            <div className="grid gap-8">
                                {/* Chat to Sales */}
                                <div className="flex gap-5 items-start">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <div className={"ml-2"}>
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Chat to sales</h3>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-2">Speak to our friendly team about custom plans.</p>
                                        <a href="mailto:sales@projexflow.com" className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                            sales@projexflow.com
                                        </a>
                                    </div>
                                </div>

                                {/* Support */}
                                <div className="flex gap-5 items-start">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div className={"ml-2"}>
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">General support</h3>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-2">We're here to help with any technical issues.</p>
                                        <a href="mailto:support@projexflow.com" className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                            support@projexflow.com
                                        </a>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex gap-5 items-start">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
                                        <PhoneCall className="w-6 h-6" />
                                    </div>
                                    <div className={"ml-2"}>
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Call us</h3>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-2">Mon-Fri from 8am to 5pm (EST).</p>
                                        <a href="tel:+11234567890" className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                            +1 (123) 456-7890
                                        </a>
                                    </div>
                                </div>

                                {/* Office */}
                                <div className="flex gap-5 items-start">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <div className={"ml-2 mb-10"}>
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Visit us</h3>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-2">Visit our headquarters in person.</p>
                                        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                            100 Innovation Drive<br />
                                            San Francisco, CA 94105
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- RIGHT COLUMN: Form Card --- */}
                        <div className="bg-white dark:bg-zinc-950 p-8 md:p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none">
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="first-name" className="text-zinc-700 dark:text-zinc-300">First name</Label>
                                        <Input id="first-name" placeholder="John" className="h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last-name" className="text-zinc-700 dark:text-zinc-300">Last name</Label>
                                        <Input id="last-name" placeholder="Doe" className="h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300">Work email</Label>
                                    <Input id="email" type="email" placeholder="john@company.com" className="h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject" className="text-zinc-700 dark:text-zinc-300">Subject</Label>
                                    <Input id="subject" placeholder="How can we help?" className="h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-zinc-700 dark:text-zinc-300">Message</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Tell us a little about your project or needs..."
                                        className="min-h-[150px] resize-y bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                                    />
                                </div>

                                <Button type="submit" className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
                                    <Send className="w-4 h-4 mr-2" /> Send Message
                                </Button>

                                <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 mt-4">
                                    By submitting this form, you agree to our privacy policy.
                                </p>
                            </form>
                        </div>

                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
