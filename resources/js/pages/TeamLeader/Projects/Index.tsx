import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { useRef } from "react";
import { debounce } from "lodash";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import InertiaPagination from "@/components/inertia-pagination";

export default function TeamProjectsIndex({ projects, filters }: any) {
    const handleSearch = useRef(debounce((q: string) => {
        // Direct Route
        router.get("/team/projects", { ...filters, search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    return (
        <AppLayout breadcrumbs={[{ title: 'Team', href: '/team/dashboard' }, { title: 'Projects', href: '/team/projects' }]}>
            <Head title="Team Projects" />
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
                                    <TableHead className="pl-6">Name</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right pr-6">Created</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.data.map((project: any) => (
                                    <TableRow key={project.id}>
                                        <TableCell className="font-medium pl-6">{project.name}</TableCell>
                                        <TableCell>{project.owner?.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>{project.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">{new Date(project.created_at).toLocaleDateString()}</TableCell>
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
