import AppLayout from "@/layouts/app-layout";
import { Head, Link, router } from "@inertiajs/react";
import { useRef } from "react";
import { debounce } from "lodash";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import InertiaPagination from "@/components/inertia-pagination";

export default function ClientProjectsIndex({ projects, filters }: any) {
    const handleSearch = useRef(debounce((q: string) => {
        router.get("/client/projects", { ...filters, search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/client/dashboard' }, { title: 'Projects', href: '/client/projects' }]}>
            <Head title="My Projects" />
            <div className="p-4 space-y-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4 p-6">
                        <div className="relative w-full sm:w-64">
                            <Input defaultValue={filters.search ?? ""} onChange={(e) => handleSearch(e.target.value)} className="peer ps-9" placeholder="Search projects..." />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-muted-foreground/80"><Search size={16} /></div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Project Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead className="text-right pr-6">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.data.map((project: any) => (
                                    <TableRow key={project.id}>
                                        <TableCell className="font-medium pl-6">{project.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={project.status === 'completed' ? 'default' : 'secondary'} className="capitalize">
                                                {project.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{project.due_date ?? 'N/A'}</TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/client/projects/${project.id}`}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Status
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <div className="mt-4"><InertiaPagination data={projects} /></div>
            </div>
        </AppLayout>
    );
}
