import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Edit, Trash2, LayoutList, KanbanSquare } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BreadcrumbItem } from '@/types';
import InertiaPagination from "@/components/inertia-pagination";
import { toast } from "sonner";
import DeleteDialog from "@/components/delete-dialog";
import TasksKanban from "./TasksKanban";

// Types
type Task = {
    id: number;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in_progress' | 'review' | 'done';
    project_id: number;
    project: { name: string };
    assigned_to: number | null;
    assignee: { name: string } | null;
};

type Props = {
    // Updated to accept the full paginated object
    tasks: {
        data: Task[];
        links: any[];
        meta?: any;
        from: number;
        to: number;
        total: number;
    };
    filters: { search?: string; status?: string; priority?: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Tasks', href: '/admin/tasks' },
];

export default function TasksIndex({ tasks, filters }: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    // --- FIX: Initialize state from LocalStorage ---
    const [view, setView] = useState<'table' | 'kanban'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('admin-tasks-view');
            return (saved === 'kanban' || saved === 'table') ? saved : 'table';
        }
        return 'table';
    });

    // --- FIX: Save to LocalStorage on change ---
    useEffect(() => {
        localStorage.setItem('admin-tasks-view', view);
    }, [view]);

    const handleSearch = useRef(debounce((q: string) => {
        router.get("/admin/tasks", { ...filters, search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { className: "bg-green-500 text-white border-green-600" });
        if (flash?.error) toast.error(flash.error, { className: "bg-red-500 text-white border-red-600" });
    }, [flash]);

    function deleteTask(id: number) {
        router.delete(`/admin/tasks/${id}`, { preserveScroll: true });
    }

    const getPriorityBadge = (p: string) => {
        if (p === 'high') return <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>;
        if (p === 'medium') return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>;
        if (p === 'low') return <Badge className="bg-green-100 text-green-800 border-green-200">Low</Badge>;
        return <Badge className="bg-green-100 text-green-800 border-green-200">Low</Badge>;
    };

    const getStatusBadge = (s: string) => {
        if (s === 'done') return <Badge className="bg-green-100 text-green-800">Done</Badge>;
        if (s === 'in_progress') return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
        if (s === 'review') return <Badge className="bg-yellow-100 text-yellow-800">In Review</Badge>;
        if (s === 'todo') return <Badge className="bg-gray-100 text-gray-800">To Do</Badge>;
        return <Badge className="bg-gray-100 text-gray-800">To Do</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Tasks" />
            <div className="p-4 space-y-4 h-full flex flex-col">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap p-6">
                        <div className="flex gap-4 items-center flex-1">
                            <div className="relative w-full sm:w-64">
                                <Input defaultValue={filters.search ?? ""} onChange={(e) => handleSearch(e.target.value)} className="peer ps-9" placeholder="Search tasks..." />
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-muted-foreground/80"><Search size={16} /></div>
                            </div>

                            {/* View Toggles */}
                            <div className="flex items-center border rounded-md bg-muted/20 p-1">
                                <Button
                                    variant={view === 'table' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setView('table')}
                                    className="h-8 px-2"
                                >
                                    <LayoutList className="h-4 w-4 mr-2" /> List
                                </Button>
                                <Button
                                    variant={view === 'kanban' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setView('kanban')}
                                    className="h-8 px-2"
                                >
                                    <KanbanSquare className="h-4 w-4 mr-2" /> Board
                                </Button>
                            </div>

                            {/* Status Filter */}
                            <Select
                                defaultValue={filters.status || ''}
                                onValueChange={(value) => {
                                    router.get("/admin/tasks", { ...filters, status: value || undefined }, { preserveState: true, replace: true });
                                }}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Filter by Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="todo">To Do</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="review">In Review</SelectItem>
                                    <SelectItem value="done">Done</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Priority Filter */}
                            <Select
                                defaultValue={filters.priority || ''}
                                onValueChange={(value) => {
                                    router.get("/admin/tasks", { ...filters, priority: value || undefined }, { preserveState: true, replace: true });
                                }}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Filter by Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button asChild><Link href="/admin/tasks/create">+ New Task</Link></Button>
                    </CardHeader>
                </Card>

                {/* --- CONTENT AREA --- */}
                {view === 'table' ? (
                    <>
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="pl-6">Title</TableHead>
                                            <TableHead>Project</TableHead>
                                            <TableHead>Assigned To</TableHead>
                                            <TableHead>Priority</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right pr-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tasks.data.length === 0 ? (
                                            <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No tasks found.</TableCell></TableRow>
                                        ) : (
                                            tasks.data.map((task) => (
                                                <TableRow key={task.id}>
                                                    <TableCell className="font-medium pl-6">{task.title}</TableCell>
                                                    <TableCell>{task.project?.name}</TableCell>
                                                    <TableCell>
                                                        {task.assignee ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">{task.assignee.name.charAt(0)}</div>
                                                                <span className="text-sm">{task.assignee.name}</span>
                                                            </div>
                                                        ) : <span className="text-muted-foreground italic">Unassigned</span>}
                                                    </TableCell>
                                                    <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                                                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/admin/tasks/${task.id}/edit`} className="cursor-pointer w-full flex items-center">
                                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DeleteDialog title="Delete Task" description={`Are you sure?`} onConfirm={() => deleteTask(task.id)}>
                                                                    <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-red-600">
                                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                                    </div>
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
                        <div className="mt-4"><InertiaPagination data={tasks} /></div>
                    </>
                ) : (
                    /* KANBAN VIEW */
                    <div className="flex-1 overflow-hidden h-full">
                        {/* Ensure your TasksKanban component handles the full pagination object now */}
                        <TasksKanban tasks={tasks} />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
