import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { debounce } from "lodash";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Edit, Trash2, Briefcase, Calendar, Eye, Filter } from "lucide-react";
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
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Projects', href: '/admin/projects' },
];

export default function ProjectsIndex({ projects, filters }: any) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleSearch = useRef(debounce((q: string) => {
        router.get("/admin/projects", { ...filters, search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    // Filter Logic
    const handleStatusFilter = (status: string) => {
        router.get("/admin/projects", { ...filters, status }, { preserveState: true, replace: true });
    };

    function deleteProject(id: number) {
        router.delete(`/admin/projects/${id}`, { preserveScroll: true });
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'on_hold': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
            case 'pending': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Projects" />
            <div className="p-6 space-y-6 w-full">

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Project Directory</h2>
                        <p className="text-sm text-muted-foreground mt-1">Manage all agency projects, timelines, and managers.</p>
                    </div>
                    <Button asChild size="lg">
                        <Link href="/admin/projects/create"><Briefcase className="mr-2 h-4 w-4"/> New Project</Link>
                    </Button>
                </div>

                <Card className="shadow-sm w-full">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-muted/10 border-b">
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <div className="relative w-full sm:w-80">
                                <Input defaultValue={filters.search ?? ""} onChange={(e) => handleSearch(e.target.value)} className="peer ps-9 bg-background" placeholder="Search projects by name..." />
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/80"><Search size={16} /></div>
                            </div>

                            {/* New Status Filter */}
                            <Select defaultValue={filters.status ?? "all"} onValueChange={handleStatusFilter}>
                                <SelectTrigger className="w-full sm:w-[180px] bg-background">
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="on_hold">On Hold</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="bg-muted/5">
                                    <TableHead className="pl-6 py-4">Project Name</TableHead>
                                    <TableHead>Manager</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Timeline</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.data.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground border-b-0">No projects found.</TableCell></TableRow>
                                ) : (
                                    projects.data.map((project: any) => (
                                        <TableRow key={project.id} className="hover:bg-muted/20 transition-colors">
                                            <TableCell className="font-medium pl-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-base">{project.name}</span>
                                                    <span className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                                        {project.description ? project.description.substring(0, 77) + '...' : 'No description provided.'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                                                        {project.owner?.name.charAt(0) || '?'}
                                                    </div>
                                                    <span className="text-sm font-medium">{project.owner?.name || 'Unassigned'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={`capitalize ${getStatusColor(project.status)} border-none py-1 px-3`}>
                                                    {project.status.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-sm text-muted-foreground">
                                                    <span className="flex items-center">
                                                        <Calendar className="h-3 w-3 mr-1" /> Start: {project.start_date && !isNaN(new Date(project.start_date).getTime()) ? new Date(project.start_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'TBD'}
                                                    </span>
                                                    <span className="flex items-center mt-1">
                                                        <Calendar className="h-3 w-3 mr-1" /> End: {project.end_date && !isNaN(new Date(project.end_date).getTime()) ? new Date(project.end_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'TBD'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                                                        {/* NEW View Action */}
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/projects/${project.id}`} className="w-full cursor-pointer"><Eye className="mr-2 h-4 w-4" /> View Details</Link>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/projects/${project.id}/edit`} className="w-full cursor-pointer"><Edit className="mr-2 h-4 w-4" /> Edit</Link>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator />
                                                        <DeleteDialog title="Delete Project" description={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`} onConfirm={() => deleteProject(project.id)}>
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

                <div className="mt-6"><InertiaPagination data={projects} /></div>
            </div>
        </AppLayout>
    );
}
