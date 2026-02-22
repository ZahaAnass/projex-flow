import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Briefcase, Calendar, CheckSquare, Timer, Edit, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BreadcrumbItem } from '@/types';

export default function ProjectShow({ project, stats }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Leader Workspace', href: '/leader/dashboard' },
        { title: 'Projects', href: '/leader/projects' },
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
                {/* Back Link & Actions */}
                <div className="flex items-center justify-between">
                    <Link href="/leader/projects" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Projects
                    </Link>
                    <Button asChild variant="outline">
                        <Link href={`/leader/projects/${project.id}/edit`}><Edit className="mr-2 h-4 w-4" /> Edit Project</Link>
                    </Button>
                </div>

                {/* Header Banner */}
                <Card className="border-t-4 border-t-primary shadow-sm">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-primary/10 rounded-lg"><Briefcase className="h-6 w-6 text-primary" /></div>
                                        <Badge variant="secondary" className={`capitalize ${getStatusColor(project.status)} border-none py-1 px-3`}>
                                            {project.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                                </div>
                                <p className="text-muted-foreground max-w-3xl leading-relaxed text-base">
                                    {project.description || "No project description provided."}
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 min-w-[250px] p-5 bg-muted/20 rounded-xl border border-border/50">
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Project Manager</span>
                                    <div className="flex items-center gap-2 font-medium">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        {project.owner?.name || 'Unassigned'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Timeline</span>
                                    <div className="flex flex-col text-sm font-medium">
                                        <span className="flex items-center"><Calendar className="h-3 w-3 mr-2" /> Start: {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'}</span>
                                        <span className="flex items-center mt-1 text-muted-foreground"><Calendar className="h-3 w-3 mr-2" /> End: {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'TBD'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                                <CheckSquare className="mr-2 h-4 w-4" /> Task Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold mb-2">{stats.progress}%</div>
                            <Progress value={stats.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-2">{stats.completed_tasks} of {stats.total_tasks} tasks completed</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                                <Timer className="mr-2 h-4 w-4" /> Sprints
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.sprints_count}</div>
                            <p className="text-xs text-muted-foreground mt-2">Active sprints planned for this project</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-l-4 border-l-blue-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                                <Briefcase className="mr-2 h-4 w-4" /> Workspace
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-end h-[68px]">
                            {/* This filters the Task board specifically for this project! */}
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                                <Link href={`/leader/tasks?search=${encodeURIComponent(project.name)}`}>Open Project Board</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
