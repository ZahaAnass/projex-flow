import AppLayout from "@/layouts/app-layout";
import { Head, Link, router } from "@inertiajs/react";
import { useRef } from "react";
import { debounce } from "lodash";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Briefcase, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbItem } from '@/types';
import InertiaPagination from "@/components/inertia-pagination";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Client Portal', href: '/client/dashboard' },
    { title: 'My Projects', href: '/client/projects' },
];

export default function ClientProjectsIndex({ projects, filters }: any) {
    const handleSearch = useRef(debounce((q: string) => {
        router.get("/client/projects", { search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'on_hold': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Projects" />
            <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">My Projects</h2>
                        <p className="text-sm text-muted-foreground mt-1">Browse your complete project portfolio.</p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Input defaultValue={filters.search ?? ""} onChange={(e) => handleSearch(e.target.value)} className="peer ps-9 bg-background h-10 shadow-sm" placeholder="Search projects..." />
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/80"><Search size={16} /></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {projects.data.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-muted-foreground">No projects found.</div>
                    ) : (
                        projects.data.map((project: any) => (
                            <Link key={project.id} href={`/client/projects/${project.id}`} className="group h-full flex">
                                <Card className="w-full flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 hover:border-blue-500/50">
                                    <div className="h-2 w-full bg-blue-500/20 group-hover:bg-blue-500 transition-colors" />
                                    <CardContent className="p-5 flex flex-col flex-1 justify-between gap-6">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div className="p-2 bg-muted/50 rounded-lg"><Briefcase className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 transition-colors" /></div>
                                                <Badge variant="secondary" className={`capitalize ${getStatusColor(project.status)} px-2 py-0.5 text-[10px]`}>
                                                    {project.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg leading-tight line-clamp-2 text-foreground group-hover:text-blue-600 transition-colors">{project.name}</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{project.description || "No description provided."}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t text-xs font-medium text-muted-foreground">
                                            <span className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-1" /> {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Ongoing'}</span>
                                            <span className="flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">View Details <ArrowRight className="h-3 w-3 ml-1" /></span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>

                <div className="mt-8 flex justify-center"><InertiaPagination data={projects} /></div>
            </div>
        </AppLayout>
    );
}
