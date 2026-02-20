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
import { ArrowLeft, RefreshCw, UserCog } from 'lucide-react';

export default function UserEdit({ user, roles, current_role }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Users', href: '/admin/users' },
        { title: 'Edit', href: `/admin/users/${user.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: current_role || 'user',
        status: user.status || 'active',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`, {
            onError: () => toast.error("Please fix the errors in the form.", { className: "bg-red-50 text-red-600 border-red-200" }),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User: ${user.name}`} />
            <div className="max-w-5xl mx-auto p-6 space-y-6 w-full">

                <Link href="/admin/users" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
                </Link>

                <Card className="shadow-lg w-full">
                    <CardHeader className="bg-muted/10 pb-8 px-8 border-b">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl"><UserCog className="h-8 w-8 text-primary" /></div>
                                <div>
                                    <CardTitle className="text-2xl">Edit Profile</CardTitle>
                                    <CardDescription className="text-base mt-1">Update details for {user.name}</CardDescription>
                                </div>
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
                                        <Label htmlFor="name" className="text-base">Full Name</Label>
                                        <Input id="name" className="h-12 text-base" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="email" className="text-base">Email Address</Label>
                                        <Input id="email" type="email" className="h-12 text-base" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                        <InputError message={errors.email} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label htmlFor="phone" className="text-base">Phone Number</Label>
                                        <Input id="phone" className="h-12 text-base" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                        <InputError message={errors.phone} />
                                    </div>
                                </div>
                            </div>

                            {/* Access & Status */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider pb-2 border-b">Access & Permissions</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label htmlFor="role" className="text-base">System Role</Label>
                                        <Select value={data.role} onValueChange={(val) => setData('role', val)}>
                                            <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {roles.map((r: string) => <SelectItem key={r} value={r} className="capitalize text-base">{r.replace('_', ' ')}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.role} />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="status" className="text-base">Account Status</Label>
                                        <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                            <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active" className="text-base">Active (Full Access)</SelectItem>
                                                <SelectItem value="inactive" className="text-base">Inactive (Suspended)</SelectItem>
                                                <SelectItem value="banned" className="text-base">Banned (Revoked)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.status} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end gap-4 py-6 px-8 bg-muted/5 border-t">
                            <Button variant="outline" size="lg" className="h-12 px-6" asChild><Link href="/admin/users">Cancel</Link></Button>
                            <Button type="submit" size="lg" disabled={processing} className="h-12 px-8">
                                {processing ? 'Updating...' : <><RefreshCw className="mr-2 h-5 w-5" /> Save Changes</>}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
