import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { debounce } from "lodash";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, Calendar as CalendarIcon, AlignLeft, Trash2, Plus } from "lucide-react";
import { BreadcrumbItem } from '@/types';
import InertiaPagination from "@/components/inertia-pagination";
import { toast } from "sonner";
import DeleteDialog from "@/components/delete-dialog";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'My Workspace', href: '/user/dashboard' },
    { title: 'Time Logs', href: '/user/time-entries' },
];

export default function UserTimeEntriesIndex({ entries, filters }: any) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleSearch = useRef(debounce((q: string) => {
        router.get("/user/time-entries", { search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    function deleteLog(id: number) {
        router.delete(`/user/time-entries/${id}`, { preserveScroll: true });
    }

    const formatDuration = (totalMinutes: number) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h`;
        return `${minutes}m`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Time Logs" />
            <div className="p-6 space-y-6 w-full">

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Time Tracking</h2>
                        <p className="text-sm text-muted-foreground mt-1">Review the hours you've logged against your tasks.</p>
                    </div>
                    <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                        <Link href="/user/time-entries/create"><Plus className="mr-2 h-4 w-4"/> Log New Time</Link>
                    </Button>
                </div>

                <Card className="shadow-sm w-full border-t-4 border-t-emerald-500">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-muted/10 border-b">
                        <div className="relative w-full sm:w-80">
                            <Input defaultValue={filters.search ?? ""} onChange={(e) => handleSearch(e.target.value)} className="peer ps-9 bg-background h-10" placeholder="Search by task title..." />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/80"><Search size={16} /></div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="bg-muted/5">
                                    <TableHead className="pl-6 py-4">Date</TableHead>
                                    <TableHead>Task Details</TableHead>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead className="text-right pr-6">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entries.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground border-b-0">You haven't logged any time yet.</TableCell>
                                    </TableRow>
                                ) : (
                                    entries.data.map((entry: any) => (
                                        <TableRow key={entry.id} className="hover:bg-muted/20 transition-colors">
                                            <TableCell className="pl-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm font-medium text-muted-foreground">
                                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                                    {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[300px]">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold truncate" title={entry.task?.title}>{entry.task?.title || 'Task Deleted'}</span>
                                                    {entry.description && (
                                                        <div className="flex items-start text-xs text-muted-foreground mt-1">
                                                            <AlignLeft className="h-3 w-3 mr-1 mt-0.5 shrink-0 opacity-50" />
                                                            <span className="truncate">{entry.description}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {entry.task?.project ? (
                                                    <Badge variant="outline" className="bg-secondary/50 text-secondary-foreground truncate max-w-[150px]">
                                                        {entry.task.project.name}
                                                    </Badge>
                                                ) : <span className="text-muted-foreground text-xs italic">-</span>}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:text-emerald-400 font-bold px-3 py-1 text-sm shadow-sm">
                                                    {formatDuration(entry.duration_minutes)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <DeleteDialog title="Delete Log" description="Are you sure you want to remove this time entry?" onConfirm={() => deleteLog(entry.id)}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </DeleteDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <div className="mt-6"><InertiaPagination data={entries} /></div>
            </div>
        </AppLayout>
    );
}
