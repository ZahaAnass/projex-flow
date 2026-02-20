import { FormEventHandler } from 'react';
import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InputError from '@/components/input-error';
import { BreadcrumbItem } from '@/types';
import { toast } from "sonner";
import { ArrowLeft, Save, ShieldCheck } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Users', href: '/admin/users' },
    { title: 'Create', href: '/admin/users/create' },
];

export default function UserCreate({ roles }: { roles: string[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', phone: '', role: 'user', password: '', password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post("/admin/users", {
            onError: () => toast.error("Please fix the errors in the form.", { className: "bg-red-50 text-red-600 border-red-200" }),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            {/* Widened to max-w-5xl for a much better horizontal span */}
            <div className="max-w-5xl mx-auto p-6 space-y-6 w-full">

                <Link href="/admin/users" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
                </Link>

                <Card className="border-t-4 border-t-primary shadow-lg w-full">
                    <CardHeader className="bg-muted/10 pb-8 px-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl"><ShieldCheck className="h-8 w-8 text-primary" /></div>
                            <div>
                                <CardTitle className="text-2xl">New User Profile</CardTitle>
                                <CardDescription className="text-base mt-1">Create a new account and assign system permissions.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <form onSubmit={submit}>
                        <CardContent className="space-y-10 p-8">
                            {/* Personal Info */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider pb-2 border-b">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label htmlFor="name" className="text-base">Full Name <span className="text-red-500">*</span></Label>
                                        <Input id="name" className="h-12 text-base" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g. John Doe" autoFocus />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="email" className="text-base">Email Address <span className="text-red-500">*</span></Label>
                                        <Input id="email" type="email" className="h-12 text-base" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="john@example.com" />
                                        <InputError message={errors.email} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label htmlFor="phone" className="text-base">Phone Number</Label>
                                        <Input id="phone" className="h-12 text-base" value={data.phone} onChange={(e) => setData('phone', e.target.value)} placeholder="+1 234 567 890" />
                                        <InputError message={errors.phone} />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="role" className="text-base">System Role <span className="text-red-500">*</span></Label>
                                        <Select value={data.role} onValueChange={(val) => setData('role', val)}>
                                            <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Select a role" /></SelectTrigger>
                                            <SelectContent>
                                                {roles.map((r) => <SelectItem key={r} value={r} className="capitalize text-base">{r.replace('_', ' ')}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.role} />
                                    </div>
                                </div>
                            </div>

                            {/* Security Info */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider pb-2 border-b">Security Setup</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-muted/20 rounded-xl border border-border/50">
                                    <div className="space-y-3">
                                        <Label htmlFor="password" className="text-base">Password <span className="text-red-500">*</span></Label>
                                        <Input id="password" type="password" className="h-12 text-base" value={data.password} onChange={(e) => setData('password', e.target.value)} placeholder="••••••••" />
                                        <InputError message={errors.password} />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="password_confirmation" className="text-base">Confirm Password <span className="text-red-500">*</span></Label>
                                        <Input id="password_confirmation" type="password" className="h-12 text-base" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} placeholder="••••••••" />
                                    </div>
                                </div>
                            </div>

                        </CardContent>

                        <CardFooter className="flex justify-end gap-4 py-6 px-8 bg-muted/5 border-t">
                            <Button variant="outline" size="lg" className="h-12 px-6" asChild><Link href="/admin/users">Cancel</Link></Button>
                            <Button type="submit" size="lg" disabled={processing} className="h-12 px-8">
                                {processing ? 'Creating...' : <><Save className="mr-2 h-5 w-5" /> Create Account</>}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
