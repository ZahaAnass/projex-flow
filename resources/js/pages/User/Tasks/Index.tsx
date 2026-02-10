import AppLayout from "@/layouts/app-layout";
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, LayoutList, KanbanSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import InertiaPagination from "@/components/inertia-pagination";
import { toast } from "sonner";
import UserTasksKanban from "./UserTasksKanban"; // We create this next

type Task = { id: number; title: string; priority: string; status: string; project: { name: string }; };

export default function UserTasksIndex({ tasks, filters }: any) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    // Default to Kanban for members
    const [view, setView] = useState<'table' | 'kanban'>(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('user-tasks-view') as 'table' | 'kanban' || 'kanban';
        return 'kanban';
    });

    useEffect(() => { localStorage.setItem('user-tasks-view', view); }, [view]);

    const handleSearch = useRef(debounce((q: string) => {
        // Direct Route
        router.get("/user/tasks", { ...filters, search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { className: "bg-green-500 text-white border-green-600" });
        if (flash?.error) toast.error(flash.error, { className: "bg-red-500 text-white border-red-600" });
    }, [flash]);

    return (
        <AppLayout breadcrumbs={[{ title: 'My Work', href: '/user/tasks' }]}>
            <Head title="My Tasks" />
            <div className="p-4 space-y-4 h-full flex flex-col">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap p-6">
                        <div className="flex gap-4 items-center flex-1">
                            <div className="relative w-full sm:w-64">
                                <Input defaultValue={filters.search ?? ""} onChange={(e) => handleSearch(e.target.value)} className="peer ps-9" placeholder="Search my tasks..." />
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-muted-foreground/80"><Search size={16} /></div>
                            </div>

                            <div className="flex items-center border rounded-md bg-muted/20 p-1">
                                <Button variant={view === 'table' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('table')} className="h-8 px-2"><LayoutList className="h-4 w-4 mr-2" /> List</Button>
                                <Button variant={view === 'kanban' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('kanban')} className="h-8 px-2"><KanbanSquare className="h-4 w-4 mr-2" /> Board</Button>
                            </div>
                        </div>
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
                                            <TableHead>Priority</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tasks.data.length === 0 ? (
                                            <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No tasks assigned to you.</TableCell></TableRow>
                                        ) : (
                                            tasks.data.map((task: Task) => (
                                                <TableRow key={task.id}>
                                                    <TableCell className="font-medium pl-6">{task.title}</TableCell>
                                                    <TableCell>{task.project?.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={task.priority === 'high' ? 'text-red-500 bg-red-50 border-red-200' : 'text-slate-500'}>{task.priority}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary">{task.status.replace('_', ' ')}</Badge>
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
                    <div className="flex-1 overflow-hidden h-full"><UserTasksKanban tasks={tasks} /></div>
                )}
            </div>
        </AppLayout>
    );
}
