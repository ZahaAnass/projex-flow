import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { useRef } from "react";
import { debounce } from "lodash";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Projects',
        href: '/admin/projects',
    }
];

export default function ProjectsIndex({ projects, filters }: any) {

    const handleSearch = useRef(debounce((q: string) => {
        router.get("/admin/projects", { ...filters, search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Projects" />
            <div className="p-4">
                <Card className="border border-sidebar-border/70">
                    <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
                        <div className="flex gap-4 items-center flex-1">
                            <div className="relative w-64">
                                <Input
                                    defaultValue={filters.search ?? ""}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="peer ps-9"
                                    placeholder="Search projects..."
                                />
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-muted-foreground/80"><Search size={16} /></div>
                            </div>

                            <Select
                                defaultValue={filters.status ?? "all"}
                                onValueChange={(v) => router.get("/admin/projects", { ...filters, status: v === "all" ? null : v }, { preserveState: true, replace: true })}
                            >
                                <SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button>+ New Project</Button>
                    </CardHeader>

                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Project Name</TableHead>
                                        <TableHead>Created By</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {projects.data.map((project: any) => (
                                        <TableRow key={project.id}>
                                            <TableCell className="font-medium">{project.name}</TableCell>
                                            <TableCell>{project.owner?.name || 'N/A'}</TableCell>
                                            <TableCell>
                                                {
                                                    project.status === 'completed' ? (
                                                        <Badge className={"capitalize bg-green-100 text-green-800"}>
                                                            {project.status}
                                                        </Badge>
                                                    ) : project.status === 'active' ? (
                                                        <Badge className={"capitalize bg-red-100 text-red-800"}>
                                                            {project.status}
                                                        </Badge>
                                                    ) : project.status === 'pending' ? (
                                                        <Badge className={"capitalize bg-yellow-100 text-yellow-800"}>
                                                            {project.status}
                                                        </Badge>
                                                    ) : (
                                                        <></>
                                                    )
                                                }
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                                        <DropdownMenuItem>Edit Project</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
