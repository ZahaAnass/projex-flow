import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { useRef } from "react";
import { debounce } from "lodash";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Clock, Calendar as CalendarIcon, AlignLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbItem } from '@/types';
import InertiaPagination from "@/components/inertia-pagination";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Leader Workspace', href: '/leader/dashboard' },
    { title: 'Team Time Logs', href: '/leader/time-entries' },
];

export default function TimeEntriesIndex({ entries, filters }: any) {
    const handleSearch = useRef(debounce((q: string) => {
        router.get("/leader/time-entries", { search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    const formatDuration = (totalMinutes: number) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h`;
        return `${minutes}m`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Team Time Logs" />
            <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Team Time Logs</h2>
                        <p className="text-sm text-muted-foreground mt-1">Audit team hours across your managed projects.</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 text-blue-700 rounded-xl border border-blue-200 flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        <span className="font-semibold text-sm tracking-wide uppercase">Leader Audit</span>
                    </div>
                </div>

                <Card className="shadow-sm w-full border-t-4 border-t-blue-500">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-muted/10 border-b">
                        <div className="relative w-full sm:w-96">
                            <Input
                                defaultValue={filters.search ?? ""}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="peer ps-9 bg-background h-10"
                                placeholder="Search by team member or task..."
                            />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/80">
                                <Search size={16} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="bg-muted/5">
                                    <TableHead className="pl-6 py-4">Date</TableHead>
                                    <TableHead>Team Member</TableHead>
                                    <TableHead>Task & Project</TableHead>
                                    <TableHead>Work Description</TableHead>
                                    <TableHead className="text-right pr-6">Time Logged</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entries.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground border-b-0">
                                            No time entries found for your projects.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    entries.data.map((entry: any) => (
                                        <TableRow key={entry.id} className="hover:bg-muted/20 transition-colors">
                                            <TableCell className="pl-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm font-medium text-muted-foreground">
                                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                                    {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                        {entry.user?.name.charAt(0) || '?'}
                                                    </div>
                                                    <span className="font-semibold text-sm">{entry.user?.name || 'Unknown'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium leading-snug line-clamp-1">
                                                        {entry.task?.title || 'Task Deleted'}
                                                    </span>
                                                    {entry.task?.project && (
                                                        <span className="text-xs text-muted-foreground mt-1">
                                                            Project: {entry.task.project.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[300px]">
                                                {entry.description ? (
                                                    <div className="flex items-start text-sm text-muted-foreground">
                                                        <AlignLeft className="h-3 w-3 mr-2 mt-0.5 shrink-0 opacity-50" />
                                                        <span className="line-clamp-2">{entry.description}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic opacity-50">No description provided</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-200 dark:text-blue-400 dark:border-blue-900 px-3 py-1 text-sm font-bold shadow-sm">
                                                    {formatDuration(entry.duration_minutes)}
                                                </Badge>
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
