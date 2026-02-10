import { FormEventHandler } from 'react';
import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import InputError from '@/components/input-error';
import { toast } from "sonner";
import { ArrowLeft, Save } from 'lucide-react';

export default function TeamTaskCreate({ projects, users }: any) {
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
        post('/team/tasks', { // Direct Route
            onError: () => toast.error("Please check form errors."),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Team', href: '/team/dashboard' }, { title: 'Tasks', href: '/team/tasks' }]}>
            <Head title="Create Task" />
            <div className="max-w-3xl mx-auto p-4">
                <div className="mb-4">
                    <Link href="/team/tasks" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
                    </Link>
                </div>
                <Card>
                    <CardHeader><CardTitle>Create New Task</CardTitle></CardHeader>
                    <form onSubmit={submit}>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Project</Label>
                                <Select onValueChange={(val) => setData('project_id', val)}>
                                    <SelectTrigger><SelectValue placeholder="Select Project" /></SelectTrigger>
                                    <SelectContent>{projects.map((p: any) => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}</SelectContent>
                                </Select>
                                <InputError message={errors.project_id} />
                            </div>
                            <div className="space-y-2"><Label>Title</Label><Input value={data.title} onChange={e => setData('title', e.target.value)} /><InputError message={errors.title} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Select defaultValue="medium" onValueChange={v => setData('priority', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select defaultValue="todo" onValueChange={v => setData('status', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="todo">To Do</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="done">Done</SelectItem></SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Assign To</Label>
                                <Select onValueChange={v => setData('assigned_to', v)}>
                                    <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                                    <SelectContent>{users.map((u: any) => <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2"><Label>Description</Label><Textarea value={data.description} onChange={e => setData('description', e.target.value)} /></div>
                        </CardContent>
                        <CardFooter><Button type="submit" disabled={processing}><Save className="mr-2 h-4 w-4"/> Create</Button></CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
