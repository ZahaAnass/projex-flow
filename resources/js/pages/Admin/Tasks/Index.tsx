import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Edit, Trash2, LayoutList, KanbanSquare, CheckSquare } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BreadcrumbItem } from '@/types';
import InertiaPagination from "@/components/inertia-pagination";
import { toast } from "sonner";
import DeleteDialog from "@/components/delete-dialog";
import TasksKanban from "./TasksKanban";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Tasks', href: '/admin/tasks' },
];

export default function TasksIndex({ tasks, filters }: any) {
    const { flash } = usePage().props as any;
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleSearch = useRef(debounce((q: string) => {
        router.get("/admin/tasks", { ...filters, search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    const handleFilter = (key: string, value: string) => {
        router.get("/admin/tasks", { ...filters, [key]: value }, { preserveState: true, replace: true });
    };

    function deleteTask(id: number) {
        router.delete(`/admin/tasks/${id}`, { preserveScroll: true });
    }

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'low': return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/50";
            case 'medium': return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/50";
            case 'high': return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/50";
            case 'urgent': return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200/50 dark:border-red-900/50";
            default: return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-900/50";
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Tasks" />
            <div className="p-6 space-y-6 w-full flex flex-col h-[calc(100vh-4rem)]">

                <div className="flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Task Board</h2>
                        <p className="text-sm text-muted-foreground mt-1">Manage deliverables, bugs, and user stories.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-muted/50 p-1 rounded-lg border">
                            <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="h-8">
                                <LayoutList className="h-4 w-4 mr-2" /> List
                            </Button>
                            <Button variant={viewMode === 'kanban' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('kanban')} className="h-8">
                                <KanbanSquare className="h-4 w-4 mr-2" /> Kanban
                            </Button>
                        </div>
                        <Button asChild size="lg">
                            <Link href="/admin/tasks/create"><CheckSquare className="mr-2 h-4 w-4"/> New Task</Link>
                        </Button>
                    </div>
                </div>

                {viewMode === 'list' ? (
                    <div className="flex-1 overflow-auto flex flex-col gap-4">
                        <Card className="shadow-sm w-full shrink-0 border-t-4 border-t-primary">
                            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-muted/10 border-b">
                                <div className="relative w-full sm:w-80">
                                    <Input defaultValue={filters.search ?? ""} onChange={(e) => handleSearch(e.target.value)} className="peer ps-9 bg-background h-10" placeholder="Search tasks..." />
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/80"><Search size={16} /></div>
                                </div>
                                <div className="flex gap-4 w-full sm:w-auto">
                                    <Select defaultValue={filters.status ?? "all"} onValueChange={(val) => handleFilter('status', val)}>
                                        <SelectTrigger className="w-full sm:w-[150px] bg-background h-10"><SelectValue placeholder="Status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="todo">To Do</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="review">Review</SelectItem>
                                            <SelectItem value="done">Done</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select defaultValue={filters.priority ?? "all"} onValueChange={(val) => handleFilter('priority', val)}>
                                        <SelectTrigger className="w-full sm:w-[150px] bg-background h-10"><SelectValue placeholder="Priority" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Priorities</SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="urgent">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow className="bg-muted/5">
                                            <TableHead className="pl-6 py-4">Task Details</TableHead>
                                            <TableHead>Project / Sprint</TableHead>
                                            <TableHead>Status & Priority</TableHead>
                                            <TableHead>Assignee</TableHead>
                                            <TableHead className="text-right pr-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tasks.data.length === 0 ? (
                                            <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground border-b-0">No tasks found.</TableCell></TableRow>
                                        ) : (
                                            tasks.data.map((task: any) => (
                                                <TableRow key={task.id} className="hover:bg-muted/20 transition-colors">
                                                    <TableCell className="pl-6 py-4">
                                                        <div className="font-semibold text-base">{task.title}</div>
                                                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                                            <Badge variant="outline" className="uppercase text-[10px] bg-muted/50">{task.type}</Badge>
                                                            {task.estimated_hours && <span>Est: {task.estimated_hours}h</span>}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm font-medium">{task.project?.name}</div>
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            {task.sprint ? <span className="bg-blue-500/10 text-blue-700 px-1.5 py-0.5 rounded">{task.sprint.name}</span> : <span className="italic">Backlog</span>}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col gap-2 items-start">
                                                            <Badge variant={task.status === 'done' ? 'default' : 'secondary'} className="capitalize shadow-sm">
                                                                {task.status.replace('_', ' ')}
                                                            </Badge>
                                                            <Badge variant="outline" className={`px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-bold ${getPriorityColor(task.priority)}`}>
                                                                {task.priority}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {task.assignee ? (
                                                            <div className="flex items-center gap-3 text-sm font-medium">
                                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{task.assignee.name.charAt(0)}</div>
                                                                {task.assignee.name}
                                                            </div>
                                                        ) : <span className="text-muted-foreground text-sm italic">Unassigned</span>}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-40">
                                                                <DropdownMenuItem asChild><Link href={`/admin/tasks/${task.id}/edit`} className="w-full cursor-pointer"><Edit className="mr-2 h-4 w-4" /> Edit Details</Link></DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DeleteDialog title="Delete Task" description="Are you sure?" onConfirm={() => deleteTask(task.id)}>
                                                                    <div className="relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm text-red-600 hover:bg-red-50"><Trash2 className="mr-2 h-4 w-4" /> Delete</div>
                                                                </DeleteDialog>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <div className="mt-2 shrink-0"><InertiaPagination data={tasks} /></div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-hidden h-full">
                        <TasksKanban tasks={tasks} />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
