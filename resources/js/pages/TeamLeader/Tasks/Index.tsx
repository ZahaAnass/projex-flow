import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Edit, Trash2, LayoutList, KanbanSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import InertiaPagination from "@/components/inertia-pagination";
import { toast } from "sonner";
import DeleteDialog from "@/components/delete-dialog";
import TasksKanban from "./TasksKanban";

export default function TeamTasksIndex({ tasks, filters }: any) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    const [view, setView] = useState<'table' | 'kanban'>(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('team-tasks-view') as 'table' | 'kanban' || 'table';
        return 'table';
    });

    useEffect(() => { localStorage.setItem('team-tasks-view', view); }, [view]);

    const handleSearch = useRef(debounce((q: string) => {
        // Direct Route
        router.get("/team/tasks", { ...filters, search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { className: "bg-green-500 text-white border-green-600" });
        if (flash?.error) toast.error(flash.error, { className: "bg-red-500 text-white border-red-600" });
    }, [flash]);

    function deleteTask(id: number) {
        // Direct Route
        router.delete(`/team/tasks/${id}`, { preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Team', href: '/team/dashboard' }, { title: 'Tasks', href: '/team/tasks' }]}>
            <Head title="Team Tasks" />
            <div className="p-4 space-y-4 h-full flex flex-col">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap p-6">
                        <div className="flex gap-4 items-center flex-1">
                            <div className="relative w-full sm:w-64">
                                <Input defaultValue={filters.search ?? ""} onChange={(e) => handleSearch(e.target.value)} className="peer ps-9" placeholder="Search tasks..." />
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-muted-foreground/80"><Search size={16} /></div>
                            </div>
                            <div className="flex items-center border rounded-md bg-muted/20 p-1">
                                <Button variant={view === 'table' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('table')} className="h-8 px-2"><LayoutList className="h-4 w-4 mr-2" /> List</Button>
                                <Button variant={view === 'kanban' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('kanban')} className="h-8 px-2"><KanbanSquare className="h-4 w-4 mr-2" /> Board</Button>
                            </div>
                        </div>
                        {/* Direct Link */}
                        <Button asChild><Link href="/team/tasks/create">+ New Task</Link></Button>
                    </CardHeader>
                </Card>

                {view === 'table' ? (
                    <>
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="pl-6">Title</TableHead>
                                            <TableHead>Project</TableHead>
                                            <TableHead>Assigned</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right pr-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tasks.data.map((task: any) => (
                                            <TableRow key={task.id}>
                                                <TableCell className="font-medium pl-6">{task.title}</TableCell>
                                                <TableCell>{task.project?.name}</TableCell>
                                                <TableCell>{task.assignee?.name || 'Unassigned'}</TableCell>
                                                <TableCell><Badge variant="secondary">{task.status.replace('_', ' ')}</Badge></TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            {/* Direct Link */}
                                                            <DropdownMenuItem asChild><Link href={`/team/tasks/${task.id}/edit`} className="cursor-pointer w-full flex items-center"><Edit className="mr-2 h-4 w-4" /> Edit</Link></DropdownMenuItem>
                                                            <DeleteDialog title="Delete Task" description="Are you sure?" onConfirm={() => deleteTask(task.id)}>
                                                                <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Delete</div>
                                                            </DeleteDialog>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <div className="mt-4"><InertiaPagination data={tasks} /></div>
                    </>
                ) : (
                    <div className="flex-1 overflow-hidden h-full"><TasksKanban tasks={tasks} /></div>
                )}
            </div>
        </AppLayout>
    );
}
