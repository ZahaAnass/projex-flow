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
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function ProjectEdit({ project }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Projects', href: '/admin/projects' },
        { title: 'Edit', href: `/admin/projects/${project.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: project.name,
        description: project.description || '',
        status: project.status,
        due_date: project.due_date ? project.due_date.split('T')[0] : '', // Format date for input
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/admin/projects/${project.id}`, {
            onError: () => toast.error("Failed to update project.", { className: "bg-red-500 text-white" }),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Project" />
            <div className="max-w-3xl mx-auto p-4">
                <div className="mb-4">
                    <Link href="/admin/projects" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Edit Project: {project.name}</CardTitle>
                        <CardDescription>Modify project details and timeline.</CardDescription>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Project Name</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                        <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="on_hold">On Hold</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="due_date">Due Date</Label>
                                    <Input id="due_date" type="date" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} />
                                    <InputError message={errors.due_date} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4} />
                                <InputError message={errors.description} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between py-4">
                            <Button variant="ghost" asChild><Link href="/admin/projects">Cancel</Link></Button>
                            <Button type="submit" disabled={processing}><RefreshCw className="mr-2 h-4 w-4" /> Update Project</Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
