import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Briefcase, Calendar, CheckSquare, Layers, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BreadcrumbItem } from '@/types';

export default function ClientProjectShow({ project, stats }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Client Portal', href: '/client/dashboard' },
        { title: 'Projects', href: '/client/projects' },
        { title: project.name, href: '' },
    ];

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
            <Head title={`Project: ${project.name}`} />

            <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">
                <Link href="/client/projects" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Projects
                </Link>

                {/* Main Project Banner */}
                <Card className="border-t-4 border-t-blue-500 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Briefcase className="h-64 w-64" />
                    </div>
                    <CardContent className="p-8 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="space-y-4 max-w-3xl">
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Badge variant="secondary" className={`capitalize ${getStatusColor(project.status)} border-none py-1 px-3 text-xs tracking-wider uppercase font-bold`}>
                                            {project.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{project.name}</h1>
                                </div>
                                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                                    {project.description || "No project description provided."}
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 min-w-[250px] p-5 bg-muted/30 rounded-xl border border-border/50 backdrop-blur-sm">
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Project Timeline</span>
                                    <div className="flex flex-col text-sm font-medium space-y-2 mt-2">
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center text-muted-foreground"><Calendar className="h-4 w-4 mr-2" /> Start Date:</span>
                                            <span>{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center text-muted-foreground"><Calendar className="h-4 w-4 mr-2" /> End Date:</span>
                                            <span>{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Ongoing'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Executive Progress View */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-bold flex items-center">
                                <CheckSquare className="mr-2 h-5 w-5 text-emerald-500" /> Development Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-end mb-2">
                                <div className="text-3xl font-bold text-emerald-600">{stats.progress}%</div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">{stats.completed_tasks} / {stats.total_tasks} Tasks</div>
                            </div>
                            <Progress value={stats.progress} className="h-3 [&>div]:bg-emerald-500" />
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-bold flex items-center">
                                <Layers className="mr-2 h-5 w-5 text-blue-500" /> Project Structure
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-around py-2">
                            <div className="text-center space-y-1">
                                <div className="text-3xl font-bold">{stats.sprints_count}</div>
                                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active Sprints</div>
                            </div>
                            <div className="h-12 w-px bg-border"></div>
                            <div className="text-center space-y-1">
                                <div className="text-3xl font-bold">{stats.total_tasks}</div>
                                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Deliverables</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </AppLayout>
    );
}
