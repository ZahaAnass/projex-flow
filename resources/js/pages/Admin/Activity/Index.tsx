import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { useRef } from "react";
import { debounce } from "lodash";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Activity, Clock, Globe } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbItem } from '@/types';
import InertiaPagination from "@/components/inertia-pagination";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Network Traffic', href: '/admin/activities' },
];

export default function ActivityLogIndex({ activities, filters }: any) {
    const handleSearch = useRef(debounce((q: string) => {
        router.get("/admin/activities", { search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    // Helper to color code HTTP methods
    const getMethodColor = (method: string) => {
        switch (method) {
            case 'GET': return 'bg-blue-500/10 text-blue-600 border-blue-200/50';
            case 'POST': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50';
            case 'PUT':
            case 'PATCH': return 'bg-amber-500/10 text-amber-600 border-amber-200/50';
            case 'DELETE': return 'bg-red-500/10 text-red-600 border-red-200/50';
            default: return 'bg-slate-500/10 text-slate-600 border-slate-200/50';
        }
    };

    // Helper to color code Status Codes
    const getStatusColor = (code: number) => {
        if (code >= 200 && code < 300) return 'bg-emerald-500 text-white';
        if (code >= 300 && code < 400) return 'bg-blue-500 text-white';
        if (code >= 400 && code < 500) return 'bg-amber-500 text-white';
        if (code >= 500) return 'bg-red-600 text-white';
        return 'bg-zinc-500 text-white';
    };

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Network Traffic Logs" />
            <div className="p-6 space-y-6 w-full">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Network Traffic Logs</h2>
                        <p className="text-sm text-muted-foreground mt-1">Monitor real-time HTTP requests, payloads, and response statuses.</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 text-blue-700 rounded-xl border border-blue-200 flex items-center gap-2 shadow-sm">
                        <Activity className="h-5 w-5 animate-pulse" />
                        <span className="font-bold text-sm tracking-wide uppercase">Live Traffic Monitoring</span>
                    </div>
                </div>

                <Card className="shadow-sm w-full border-t-4 border-t-blue-500">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-muted/10 border-b">
                        <div className="relative w-full sm:w-96">
                            <Input
                                defaultValue={filters.search ?? ""}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="peer ps-9 bg-background h-10"
                                placeholder="Search by URL, method, or user..."
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
                                    <TableHead className="pl-6 py-4">Status & Method</TableHead>
                                    <TableHead>Endpoint</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Payload</TableHead>
                                    <TableHead className="text-right pr-6">Performance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activities.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground border-b-0">
                                            No traffic logs found. Make sure your middleware is registered!
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    activities.data.map((log: any) => (
                                        <TableRow key={log.id} className="hover:bg-muted/20 transition-colors">

                                            {/* Status & Method */}
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Badge className={`${getStatusColor(log.status_code)} font-bold shadow-sm`}>
                                                        {log.status_code}
                                                    </Badge>
                                                    <Badge variant="outline" className={`${getMethodColor(log.method)} uppercase tracking-wider text-[10px] font-bold`}>
                                                        {log.method}
                                                    </Badge>
                                                </div>
                                            </TableCell>

                                            {/* URL & IP */}
                                            <TableCell>
                                                <div className="font-mono text-sm text-zinc-800 dark:text-zinc-200 truncate max-w-[250px] lg:max-w-md">
                                                    {log.url.replace(window.location.origin, '')}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                    <Globe className="w-3 h-3" /> {log.ip_address}
                                                </div>
                                            </TableCell>

                                            {/* User */}
                                            <TableCell>
                                                {log.user ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                                                            {log.user.name.charAt(0)}
                                                        </div>
                                                        <span className="font-medium text-sm">{log.user.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm italic text-muted-foreground">Guest</span>
                                                )}
                                            </TableCell>

                                            {/* Payload */}
                                            <TableCell>
                                                {log.payload && Object.keys(log.payload).length > 0 ? (
                                                    <div className="max-w-xs max-h-16 overflow-y-auto bg-zinc-100 dark:bg-zinc-900 rounded p-2 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
                                                        <pre>{JSON.stringify(typeof log.payload === 'string' ? JSON.parse(log.payload) : log.payload, null, 2)}</pre>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs italic">No payload</span>
                                                )}
                                            </TableCell>

                                            {/* Performance & Time */}
                                            <TableCell className="text-right pr-6">
                                                <div className="flex items-center justify-end gap-1 text-sm font-medium">
                                                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                                    <span className={log.duration_ms > 1000 ? "text-red-500" : log.duration_ms > 500 ? "text-amber-500" : "text-emerald-500"}>
                                                        {log.duration_ms} ms
                                                    </span>
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {formatDate(log.created_at)}
                                                </div>
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
