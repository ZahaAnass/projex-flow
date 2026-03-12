import { FormEventHandler } from 'react';
import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import InputError from '@/components/input-error';
import { BreadcrumbItem } from '@/types';
import { toast } from "sonner";
import { ArrowLeft, Save, Briefcase } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Projects', href: '/admin/projects' },
    { title: 'Create', href: '/admin/projects/create' },
];

export default function ProjectCreate({ owners, clients }: any) {
    const { data, setData, post, processing, errors, transform } = useForm({
        name: '',
        description: '',
        status: 'pending',
        owner_id: '',
        client_id: 'none',
        start_date: '',
        end_date: '',
    });

    transform((currentData) => ({
        ...currentData,
        client_id: currentData.client_id === 'none' ? null : currentData.client_id,
    }));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/projects', {
            onError: () => toast.error("Please fix the errors in the form.", { className: "bg-red-50 text-red-600 border-red-200" }),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Project" />
            <div className="max-w-5xl mx-auto p-6 space-y-6 w-full">

                <Link href="/admin/projects" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
                </Link>

                <Card className="border-t-4 border-t-primary shadow-lg w-full">
                    <CardHeader className="bg-muted/10 pb-8 px-8 border-b">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl"><Briefcase className="h-8 w-8 text-primary" /></div>
                            <div>
                                <CardTitle className="text-2xl">Create New Project</CardTitle>
                                <CardDescription className="text-base mt-1">Define project scope, manager, and timeline.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <form onSubmit={submit}>
                        <CardContent className="space-y-10 p-8">

                            {/* General Details */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider pb-2 border-b">General Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label htmlFor="name" className="text-base">Project Name <span className="text-red-500">*</span></Label>
                                        <Input id="name" className="h-12 text-base" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g. Q3 Marketing Campaign" autoFocus />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="owner_id" className="text-base">Project Manager <span className="text-red-500">*</span></Label>
                                        <Select value={data.owner_id} onValueChange={(val) => setData('owner_id', val)}>
                                            <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Assign a leader" /></SelectTrigger>
                                            <SelectContent>
                                                {owners.map((owner: any) => <SelectItem key={owner.id} value={String(owner.id)} className="text-base">{owner.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.owner_id} />
                                    </div>
                                    {/* NEW CLIENT DROPDOWN */}
                                    <div className="space-y-3 md:col-span-2 lg:col-span-1">
                                        <Label className="text-base">Assign Client <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                                        <Select value={data.client_id} onValueChange={(val) => setData('client_id', val)}>
                                            <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Select a client..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none" className="italic text-muted-foreground">Internal (No Client)</SelectItem>
                                                {clients.map((c: any) => <SelectItem key={c.id} value={String(c.id)} className="text-base">{c.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.client_id} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="description" className="text-base">Project Description</Label>
                                    <Textarea id="description" className="text-base resize-none" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4} placeholder="Brief overview of the project goals..." />
                                    <InputError message={errors.description} />
                                </div>
                            </div>

                            {/* Status & Timeline */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider pb-2 border-b">Status & Timeline</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <Label htmlFor="status" className="text-base">Project Status</Label>
                                        <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                            <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending" className="text-base">Pending</SelectItem>
                                                <SelectItem value="active" className="text-base">Active</SelectItem>
                                                <SelectItem value="on_hold" className="text-base">On Hold</SelectItem>
                                                <SelectItem value="completed" className="text-base">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.status} />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="start_date" className="text-base">Start Date</Label>
                                        <Input id="start_date" type="date" className="h-12 text-base" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} />
                                        <InputError message={errors.start_date} />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="end_date" className="text-base">Target End Date</Label>
                                        <Input id="end_date" type="date" className="h-12 text-base" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} />
                                        <InputError message={errors.end_date} />
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-end gap-4 py-6 px-8 bg-muted/5 border-t">
                            <Button variant="outline" size="lg" className="h-12 px-6" asChild><Link href="/admin/projects">Cancel</Link></Button>
                            <Button type="submit" size="lg" disabled={processing} className="h-12 px-8">
                                {processing ? 'Saving...' : <><Save className="mr-2 h-5 w-5" /> Create Project</>}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
