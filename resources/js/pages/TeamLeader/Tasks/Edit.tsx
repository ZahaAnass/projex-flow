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
import { ArrowLeft, RefreshCw, Edit } from 'lucide-react';

export default function TaskEdit({ task, projects, users, sprints }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Leader Workspace', href: '/leader/dashboard' },
        { title: 'Tasks', href: '/leader/tasks' },
        { title: 'Edit', href: `/leader/tasks/${task.id}/edit` },
    ];

    const { data, setData, put, processing, errors, transform } = useForm({
        title: task.title, description: task.description || '', project_id: String(task.project_id),
        sprint_id: task.sprint_id ? String(task.sprint_id) : 'none',
        assigned_to: task.assigned_to ? String(task.assigned_to) : 'none',
        priority: task.priority, type: task.type || 'task', status: task.status,
        estimated_hours: task.estimated_hours || '', due_date: task.due_date ? task.due_date.split('T')[0] : '',
    });

    const availableSprints = sprints.filter((s: any) => s.project_id === Number(data.project_id));

    transform((currentData) => ({
        ...currentData,
        sprint_id: currentData.sprint_id === 'none' ? null : currentData.sprint_id,
        assigned_to: currentData.assigned_to === 'none' ? null : currentData.assigned_to,
        estimated_hours: currentData.estimated_hours === '' ? null : currentData.estimated_hours,
        due_date: currentData.due_date === '' ? null : currentData.due_date,
    }));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/leader/tasks/${task.id}`, {
            onError: () => toast.error("Please check the form for errors.", { className: "bg-red-50 text-red-600 border-red-200" }),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Task: ${task.title}`} />
            <div className="max-w-5xl mx-auto p-6 space-y-6 w-full">
                <Link href="/leader/tasks" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Task Board
                </Link>

                <Card className="border-t-4 border-t-primary shadow-lg w-full">
                    <CardHeader className="bg-muted/10 pb-8 px-8 border-b">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl"><Edit className="h-8 w-8 text-primary" /></div>
                            <div><CardTitle className="text-2xl">Edit Task</CardTitle><CardDescription className="text-base mt-1">Update details for this task.</CardDescription></div>
                        </div>
                    </CardHeader>

                    <form onSubmit={submit}>
                        <CardContent className="space-y-10 p-8">
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider pb-2 border-b">Core Details</h3>
                                <div className="space-y-3">
                                    <Label className="text-base">Task Title <span className="text-red-500">*</span></Label>
                                    <Input className="h-12 text-base" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                    <InputError message={errors.title} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-base">Project <span className="text-red-500">*</span></Label>
                                        <Select value={data.project_id} onValueChange={(val) => { setData('project_id', val); setData('sprint_id', 'none'); }}>
                                            <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
                                            <SelectContent>{projects.map((p: any) => <SelectItem key={p.id} value={String(p.id)} className="text-base">{p.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <InputError message={errors.project_id} />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-base">Sprint</Label>
                                        <Select value={data.sprint_id} onValueChange={(val) => setData('sprint_id', val)} disabled={!data.project_id}>
                                            <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Select sprint" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none" className="text-base font-semibold text-muted-foreground">Backlog (No Sprint)</SelectItem>
                                                {availableSprints.map((s: any) => <SelectItem key={s.id} value={String(s.id)} className="text-base">{s.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.sprint_id} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider pb-2 border-b">Classification & Assignment</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-base">Task Type</Label>
                                        <Select value={data.type} onValueChange={(val) => setData('type', val)}>
                                            <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="task" className="text-base">Task</SelectItem><SelectItem value="bug" className="text-base text-red-600">Bug</SelectItem><SelectItem value="story" className="text-base text-blue-600">User Story</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-base">Priority</Label>
                                        <Select value={data.priority} onValueChange={(val) => setData('priority', val)}>
                                            <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low" className="text-base">Low</SelectItem><SelectItem value="medium" className="text-base">Medium</SelectItem><SelectItem value="high" className="text-base">High</SelectItem><SelectItem value="urgent" className="text-base font-bold text-red-600">Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-base">Assign To</Label>
                                        <Select value={data.assigned_to} onValueChange={(val) => setData('assigned_to', val)}>
                                            <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Unassigned" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none" className="text-base italic">Unassigned</SelectItem>
                                                {users.map((u: any) => <SelectItem key={u.id} value={String(u.id)} className="text-base">{u.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider pb-2 border-b">Planning & Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-base">Status</Label>
                                        <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                            <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todo" className="text-base">To Do</SelectItem><SelectItem value="in_progress" className="text-base">In Progress</SelectItem><SelectItem value="review" className="text-base">Review</SelectItem><SelectItem value="done" className="text-base">Done</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-base">Estimated Hours</Label>
                                        <Input type="number" min="0" className="h-12 text-base" value={data.estimated_hours} onChange={(e) => setData('estimated_hours', e.target.value)} />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-base">Due Date</Label>
                                        <Input type="date" className="h-12 text-base" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-base">Description</Label>
                                    <Textarea className="text-base resize-y" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={5} />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-4 py-6 px-8 bg-muted/5 border-t">
                            <Button variant="outline" size="lg" className="h-12 px-6" asChild><Link href="/leader/tasks">Cancel</Link></Button>
                            <Button type="submit" size="lg" disabled={processing} className="h-12 px-8"><RefreshCw className="mr-2 h-5 w-5" /> Save Changes</Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
