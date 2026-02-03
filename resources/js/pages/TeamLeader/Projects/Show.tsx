import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Calendar, User } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InputError from "@/components/input-error";
import { useState } from "react";
import { toast } from "sonner";
import TeamKanbanBoard from "./TeamKanbanBoard"; // Create this file (code below)

export default function ProjectShow({ project, tasks, team_members }: any) {
    const [open, setOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Projects', href: '/team/projects' },
            { title: project.name, href: '' }
        ]}>
            <Head title={project.name} />

            <div className="flex flex-col h-screen max-h-[calc(100vh-64px)]">
                {/* Header */}
                <div className="px-6 py-4 border-b bg-background flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <Link href={`/team/projects`}
                            className="text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">{project.name}</h1>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> Due: {project.due_date || 'N/A'}</span>
                                <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 capitalize">{project.status}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Add Task Dialog */}
                    <CreateTaskDialog
                        projectId={project.id}
                        members={team_members || []} // Pass users if available, otherwise empty
                        open={open}
                        setOpen={setOpen}
                    />
                </div>

                {/* Kanban Board Area */}
                <div className="flex-1 overflow-hidden p-4 bg-muted/20">
                    <TeamKanbanBoard tasks={tasks} />
                </div>
            </div>
        </AppLayout>
    );
}

// --- Internal Component: Create Task Dialog ---
function CreateTaskDialog({ projectId, members, open, setOpen }: any) {
    const { data, setData, post, processing, errors, reset } = useForm({
        project_id: projectId,
        title: '',
        description: '',
        priority: 'medium',
        assigned_to: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/team/projects/${projectId}`, {
            onSuccess: () => {
                setOpen(false);
                reset();
                toast.success("Task added to board");
            },
            onError: () => toast.error("Failed to add task"),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" /> Add Task</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>Add a card to the "To Do" column.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Input id="title" value={data.title} onChange={e => setData('title', e.target.value)} required />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select defaultValue="medium" onValueChange={v => setData('priority', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* If you pass team members, uncomment this */}
                        {/* <div className="space-y-2">
                             <Label>Assignee</Label>
                             <Select onValueChange={v => setData('assigned_to', v)}>
                                 <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                                 <SelectContent>
                                     {members.map((m: any) => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}
                                 </SelectContent>
                             </Select>
                         </div> */}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="desc">Description</Label>
                        <Textarea id="desc" value={data.description} onChange={e => setData('description', e.target.value)} />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>{processing ? 'Adding...' : 'Add Task'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
