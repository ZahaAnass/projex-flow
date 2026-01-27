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
import { ArrowLeft, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Tasks', href: '/admin/tasks' },
    { title: 'Create', href: '/admin/tasks/create' },
];

type Option = { id: number; name: string };

export default function TaskCreate({ projects, users }: { projects: Option[], users: Option[] }) {
    const { data, setData, post, processing, errors } = useForm({
        project_id: '',
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        assigned_to: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/tasks', {
            onError: () => toast.error("Please check the form for errors.", { className: "bg-red-500 text-white" }),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Task" />
            <div className="max-w-3xl mx-auto p-4">
                <div className="mb-4">
                    <Link href="/admin/tasks" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Create New Task</CardTitle>
                        <CardDescription>Assign work to team members.</CardDescription>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent className="space-y-6">

                            <div className="space-y-2">
                                <Label htmlFor="project_id">Project</Label>
                                <Select onValueChange={(val) => setData('project_id', val)}>
                                    <SelectTrigger><SelectValue placeholder="Select Project" /></SelectTrigger>
                                    <SelectContent>
                                        {projects.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.project_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Task Title</Label>
                                <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select defaultValue="medium" onValueChange={(val) => setData('priority', val)}>
                                        <SelectTrigger><SelectValue placeholder="Select Priority" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.priority} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select defaultValue="todo" onValueChange={(val) => setData('status', val)}>
                                        <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todo">To Do</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="review">Review</SelectItem>
                                            <SelectItem value="done">Done</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="assigned_to">Assign To (Optional)</Label>
                                <Select onValueChange={(val) => setData('assigned_to', val)}>
                                    <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                                    <SelectContent>
                                        {users.map((u) => <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.assigned_to} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} />
                                <InputError message={errors.description} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between bg-muted/20 py-4">
                            <Button variant="ghost" asChild><Link href="/admin/tasks">Cancel</Link></Button>
                            <Button type="submit" disabled={processing}><Save className="mr-2 h-4 w-4" /> Create Task</Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
