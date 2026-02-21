import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { useRef } from "react";
import { debounce } from "lodash";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Activity, Clock, Database } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbItem } from '@/types';
import InertiaPagination from "@/components/inertia-pagination";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Activity Logs', href: '/admin/activities' },
];

export default function ActivityLogIndex({ activities, filters }: any) {
    const handleSearch = useRef(debounce((q: string) => {
        router.get("/admin/activities", { search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    // Helper to format action badges
    const getActionBadge = (action: string) => {
        const lowerAction = action.toLowerCase();
        if (lowerAction.includes('create')) {
            return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200">Created</Badge>;
        }
        if (lowerAction.includes('update')) {
            return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">Updated</Badge>;
        }
        if (lowerAction.includes('delete')) {
            return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">Deleted</Badge>;
        }
        if (lowerAction.includes('login')) {
            return <Badge className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200">Login</Badge>;
        }
        return <Badge variant="outline" className="uppercase">{action}</Badge>;
    };

    // Helper to clean up "App\Models\Task" into just "Task"
    const formatSubjectType = (subjectType: string) => {
        if (!subjectType) return 'System';
        const parts = subjectType.split('\\');
        return parts[parts.length - 1];
    };

    // Helper to format date nicely
    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Activity Logs" />
            <div className="p-6 space-y-6 w-full">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">System Audit Trail</h2>
                        <p className="text-sm text-muted-foreground mt-1">Monitor all database modifications and user activities in real-time.</p>
                    </div>
                    <div className="p-3 bg-purple-500/10 text-purple-700 rounded-xl border border-purple-200 flex items-center gap-2 shadow-sm">
                        <Activity className="h-5 w-5 animate-pulse" />
                        <span className="font-bold text-sm tracking-wide uppercase">Live Tracking</span>
                    </div>
                </div>

                <Card className="shadow-sm w-full border-t-4 border-t-purple-500">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-muted/10 border-b">
                        <div className="relative w-full sm:w-96">
                            <Input
                                defaultValue={filters.search ?? ""}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="peer ps-9 bg-background h-10"
                                placeholder="Search by user, action, or model..."
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
                                    <TableHead className="pl-6 py-4 w-[200px]">Timestamp</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Target Record</TableHead>
                                    <TableHead className="text-right pr-6">Changes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activities.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground border-b-0">
                                            No activity logs found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    activities.data.map((log: any) => (
                                        <TableRow key={log.id} className="hover:bg-muted/20 transition-colors">
                                            {/* Timestamp */}
                                            <TableCell className="pl-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm font-medium text-muted-foreground">
                                                    <Clock className="h-3.5 w-3.5 mr-2 opacity-70" />
                                                    {formatDate(log.created_at)}
                                                </div>
                                            </TableCell>

                                            {/* User */}
                                            <TableCell>
                                                {log.user ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                                                            {log.user.name.charAt(0)}
                                                        </div>
                                                        <span className="font-semibold text-sm">{log.user.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm italic text-muted-foreground">System Generated</span>
                                                )}
                                            </TableCell>

                                            {/* Action Badge */}
                                            <TableCell>
                                                {getActionBadge(log.action)}
                                            </TableCell>

                                            {/* Subject Type & ID */}
                                            <TableCell>
                                                {log.subject_type ? (
                                                    <div className="flex items-center gap-2">
                                                        <Database className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span className="text-sm font-medium">{formatSubjectType(log.subject_type)}</span>
                                                        <span className="text-xs text-muted-foreground">ID: {log.subject_id}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">-</span>
                                                )}
                                            </TableCell>

                                            {/* Optional Details (e.g. JSON diff) */}
                                            <TableCell className="text-right pr-6 text-xs text-muted-foreground max-w-[200px] truncate">
                                                {log.data_after ? (
                                                    <span
                                                        title={`Before: ${log.data_before}\nAfter: ${log.data_after}`}
                                                        className="cursor-help border-b border-dashed border-muted-foreground/50 pb-0.5"
                                                    >
                                                        View Data
                                                    </span>
                                                ) : '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="mt-6"><InertiaPagination data={activities} /></div>
            </div>
        </AppLayout>
    );
}
