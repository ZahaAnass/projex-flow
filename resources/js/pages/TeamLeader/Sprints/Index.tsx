import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { debounce } from "lodash";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Edit, Trash2, Timer, Calendar, Target } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BreadcrumbItem } from '@/types';
import InertiaPagination from "@/components/inertia-pagination";
import { toast } from "sonner";
import DeleteDialog from "@/components/delete-dialog";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Leader Workspace', href: '/leader/dashboard' },
    { title: 'Sprints', href: '/leader/sprints' },
];

export default function SprintsIndex({ sprints, filters }: any) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleSearch = useRef(debounce((q: string) => {
        router.get("/leader/sprints", { ...filters, search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    const handleStatusFilter = (status: string) => {
        router.get("/leader/sprints", { ...filters, status }, { preserveState: true, replace: true });
    };

    function deleteSprint(id: number) {
        router.delete(`/leader/sprints/${id}`, { preserveScroll: true });
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'planned': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Sprints" />
            <div className="p-6 space-y-6 w-full">

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Sprint Planning</h2>
                        <p className="text-sm text-muted-foreground mt-1">Manage project cycles and goals.</p>
                    </div>
                    <Button asChild size="lg">
                        <Link href="/leader/sprints/create"><Timer className="mr-2 h-4 w-4"/> New Sprint</Link>
                    </Button>
                </div>

                <Card className="shadow-sm w-full">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-muted/10 border-b">
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <div className="relative w-full sm:w-80">
                                <Input defaultValue={filters.search ?? ""} onChange={(e) => handleSearch(e.target.value)} className="peer ps-9 bg-background h-10" placeholder="Search sprints..." />
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/80"><Search size={16} /></div>
                            </div>

                            <Select defaultValue={filters.status ?? "all"} onValueChange={handleStatusFilter}>
                                <SelectTrigger className="w-full sm:w-[180px] bg-background h-10">
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="planned">Planned</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="bg-muted/5">
                                    <TableHead className="pl-6 py-4">Sprint Details</TableHead>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Timeline</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sprints.data.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground border-b-0">No sprints found.</TableCell></TableRow>
                                ) : (
                                    sprints.data.map((sprint: any) => (
                                        <TableRow key={sprint.id} className="hover:bg-muted/20 transition-colors">
                                            <TableCell className="font-medium pl-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-base font-semibold">{sprint.name}</span>
                                                    {sprint.goal && (
                                                        <span className="text-xs text-muted-foreground mt-1 flex items-center">
                                                            <Target className="h-3 w-3 mr-1" /> {sprint.goal.substring(0, 50)}...
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-secondary/50 text-secondary-foreground">{sprint.project?.name || 'Unknown'}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={`capitalize ${getStatusColor(sprint.status)} border-none py-1 px-3`}>
                                                    {sprint.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-sm text-muted-foreground">
                                                    <span className="flex items-center">
                                                        <Calendar className="h-3 w-3 mr-1.5" /> Start: {new Date(sprint.start_date).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center mt-1">
                                                        <Calendar className="h-3 w-3 mr-1.5" /> End: {new Date(sprint.end_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/leader/sprints/${sprint.id}/edit`} className="w-full cursor-pointer"><Edit className="mr-2 h-4 w-4" /> Edit</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DeleteDialog title="Delete Sprint" description={`Are you sure you want to delete "${sprint.name}"?`} onConfirm={() => deleteSprint(sprint.id)}>
                                                            <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-red-100 hover:text-red-900 text-red-600 dark:hover:bg-red-900/30">
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

                <div className="mt-6"><InertiaPagination data={sprints} /></div>
            </div>
        </AppLayout>
    );
}
