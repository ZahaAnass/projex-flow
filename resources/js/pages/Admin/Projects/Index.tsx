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
type Project = {
    id: number;
    name: string;
    description: string;
    status: 'pending' | 'active' | 'completed' | 'on_hold';
    owner: { name: string };
    created_at: string;
};

type Props = {
    projects: {
        data: Project[];
        meta: { current_page: number; last_page: number; per_page: number; total: number };
        links: { url: string | null; label: string; active: boolean }[];
        from: number;
        to: number;
        total: number;
    };
    filters: { search?: string; status?: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Projects', href: '/admin/projects' },
];

export default function ProjectsIndex({ projects, filters }: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    // Search
    const handleSearch = useRef(debounce((q: string) => {
        router.get("/admin/projects", { ...filters, search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    // Toast
    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { className: "bg-green-500 text-white border-green-600", id: flash.success });
        if (flash?.error) toast.error(flash.error, { className: "bg-red-500 text-white border-red-600", id: flash.error });
    }, [flash]);

    // Delete
    function deleteProject(id: number) {
        router.delete(`/admin/projects/${id}`, { preserveScroll: true });
    }

    // Status Badge Helper
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
            case 'active': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Active</Badge>;
            case 'pending': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
            case 'on_hold': return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">On Hold</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Projects" />
            <div className="p-4 space-y-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap p-6">
                        <div className="flex gap-4 items-center flex-1">
                            <div className="relative w-full sm:w-64">
                                <Input defaultValue={filters.search ?? ""} onChange={(e) => handleSearch(e.target.value)} className="peer ps-9" placeholder="Search projects..." />
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-muted-foreground/80"><Search size={16} /></div>
                            </div>
                            <Select defaultValue={filters.status ?? "all"} onValueChange={(v) => router.get("/admin/projects", { ...filters, status: v === "all" ? null : v }, { preserveState: true, replace: true })}>
                                <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="on_hold">On Hold</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button asChild><Link href="/admin/projects/create">+ New Project</Link></Button>
                    </CardHeader>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Project Name</TableHead>
                                    <TableHead>Created By</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.data.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No projects found.</TableCell></TableRow>
                                ) : (
                                    projects.data.map((project: Project) => (
                                        <TableRow key={project.id}>
                                            <TableCell className="font-medium pl-6">{project.name}</TableCell>
                                            <TableCell>{project.owner?.name || 'Unknown'}</TableCell>
                                            <TableCell>{getStatusBadge(project.status)}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/projects/${project.id}/edit`} className="cursor-pointer w-full flex items-center">
                                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DeleteDialog title="Delete Project" description={`Are you sure you want to delete "${project.name}"?`} onConfirm={() => deleteProject(project.id)}>
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

                <div className="mt-4"><InertiaPagination data={projects} /></div>
            </div>
        </AppLayout>
    );
}
