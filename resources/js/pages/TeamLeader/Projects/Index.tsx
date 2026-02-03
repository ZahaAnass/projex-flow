import AppLayout from "@/layouts/app-layout";
import { Head, Link, router } from "@inertiajs/react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Layout, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import InertiaPagination from "@/components/inertia-pagination";

type Project = {
    id: number;
    name: string;
    description: string | null;
    status: string;
    due_date: string | null;
};

export default function TeamProjectsIndex({ projects, filters }: { projects: { data: Project[]; meta: any }, filters: { search: string } }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Projects', href: '/team/projects' }]}>
            <Head title="Team Projects" />
            <div className="p-4 space-y-4">

                {/* Search Header */}
                <div className="flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
                            className="pl-9"
                            defaultValue={filters.search}
                            onChange={(e) => router.get(route('team.projects.index'), { search: e.target.value }, { preserveState: true, replace: true })}
                        />
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.data.map((project: Project) => (
                        <Card key={project.id} className="hover:shadow-md transition-shadow group relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1 h-full ${project.status === 'active' ? 'bg-blue-500' : 'bg-slate-300'}`} />
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-lg leading-tight">{project.name}</h3>
                                    <Badge variant="outline" className="capitalize">{project.status}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                                    {project.description || "No description provided."}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <Calendar className="mr-1 h-3 w-3" />
                                        {project.due_date ? new Date(project.due_date).toLocaleDateString() : 'No due date'}
                                    </div>
                                    <Button size="sm" asChild>
                                        <Link href={`/team/projects/${project.id}`} className="flex items-center">
                                            <Layout className="mr-2 h-4 w-4" /> Board
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <InertiaPagination data={projects} />
            </div>
        </AppLayout>
    );
}
