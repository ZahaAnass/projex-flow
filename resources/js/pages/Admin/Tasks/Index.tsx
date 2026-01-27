import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { debounce } from "lodash";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BreadcrumbItem } from '@/types';
import InertiaPagination from "@/components/inertia-pagination";
import { toast } from "sonner";
import DeleteDialog from "@/components/delete-dialog";

// Types
type Task = {
    id: number;
    title: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in_progress' | 'review' | 'done';
    project: { name: string };
    assignee: { name: string } | null;
};

type Props = {
    tasks: {
        data: Task[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
        links: { url: string | null; label: string; active: boolean }[];
        from: number;
        to: number;
        total: number;
    }
    filters: { search?: string; status?: string; priority?: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Tasks', href: '/admin/tasks' },
];

export default function TasksIndex({ tasks, filters }: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

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
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Low</Badge>;
    };

    const getStatusBadge = (s: string) => {
        if (s === 'todo') return <Badge className="bg-gray-100 text-gray-800 border-gray-200">To Do</Badge>;
        if (s === 'in_progress') return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
        if (s === 'review') return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Review</Badge>;
        return <Badge className="bg-green-100 text-green-800 border-green-200">Done</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Tasks" />
            <div className="p-4 space-y-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap p-6">
                        <div className="flex gap-4 items-center flex-1">
                            <div className="relative w-full sm:w-64">
                                <Input defaultValue={filters.search ?? ""} onChange={(e) => handleSearch(e.target.value)} className="peer ps-9" placeholder="Search tasks..." />
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-muted-foreground/80"><Search size={16} /></div>
                            </div>

                            <Select defaultValue={filters.status ?? "all"} onValueChange={(v) => router.get("/admin/tasks", { ...filters, status: v === "all" ? null : v }, { preserveState: true, replace: true })}>
                                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="todo">To Do</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="review">Review</SelectItem>
                                    <SelectItem value="done">Done</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select defaultValue={filters.priority ?? "all"} onValueChange={(v) => router.get("/admin/tasks", { ...filters, priority: v === "all" ? null : v }, { preserveState: true, replace: true })}>
                                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Priority" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priority</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button asChild><Link href="/admin/tasks/create">+ New Task</Link></Button>
                    </CardHeader>
                </Card>

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
                                                        <div className="h-6 w-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">{task.assignee.name.charAt(0)}</div>
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
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/tasks/${task.id}/edit`} className="cursor-pointer w-full flex items-center">
                                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DeleteDialog title="Delete Task" description={`Are you sure you want to delete "${task.title}"?`} onConfirm={() => deleteTask(task.id)}>
                                                            <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-red-600 focus:bg-red-50 focus:text-red-700">
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
            </div>
        </AppLayout>
    );
}
