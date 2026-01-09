import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { useRef } from "react";
import { debounce } from "lodash";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Tasks',
        href: '/admin/tasks',
    }
];

export default function TasksIndex({ tasks, filters }: any) {

    const handleSearch = useRef(debounce((q: string) => {
        router.get("/admin/tasks", { ...filters, search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Tasks" />
            <div className="p-4">
                <Card className="border border-sidebar-border/70">
                    <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
                        <div className="relative w-64">
                            <Input
                                defaultValue={filters.search ?? ""}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="peer ps-9"
                                placeholder="Search tasks..."
                            />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-muted-foreground/80"><Search size={16} /></div>
                        </div>
                        <Button variant="outline">Export Report</Button>
                    </CardHeader>

                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Task Title</TableHead>
                                        <TableHead>Project</TableHead>
                                        <TableHead>Assigned To</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tasks.data.map((task: any) => (
                                        <TableRow key={task.id}>
                                            <TableCell className="font-medium">{task.title}</TableCell>
                                            <TableCell>{task.project?.name}</TableCell>
                                            <TableCell>{task.assignee?.name || 'Unassigned'}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={task.priority === 'high' ? 'text-red-600 border-red-200 bg-red-50' : ''}>
                                                    {task.priority}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="capitalize">{task.status.replace('_', ' ')}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
