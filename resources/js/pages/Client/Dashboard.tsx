import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, CheckCircle2, TrendingUp, Presentation, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Client Portal', href: '/client/dashboard' }
];

export default function ClientDashboard({ stats, recent_projects }: any) {

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
            <Head title="Client Portal" />
            <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Welcome to your Portal</h2>
                        <p className="text-muted-foreground mt-1">Track the progress and health of your current projects.</p>
                    </div>
                </div>

                {/* Executive Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="shadow-sm border-l-4 border-l-slate-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                            <Briefcase className="h-4 w-4 text-slate-500" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.total_projects}</div></CardContent>
                    </Card>
                    <Card className="shadow-sm border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                            <Presentation className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.active_projects}</div></CardContent>
                    </Card>
                    <Card className="shadow-sm border-l-4 border-l-emerald-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.completed_projects}</div></CardContent>
                    </Card>
                    <Card className="shadow-sm border-l-4 border-l-purple-500 bg-purple-500/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">Overall Progress</CardTitle>
                            <TrendingUp className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-2">{stats.overall_progress}%</div>
                            <Progress value={stats.overall_progress} className="h-2 [&>div]:bg-purple-500" />
                        </CardContent>
                    </Card>
                </div>

                <Card className="shadow-sm border-t-4 border-t-blue-500">
                    <CardHeader>
                        <CardTitle>Your Project Portfolio</CardTitle>
                        <CardDescription>A quick glance at your ongoing and past projects.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {recent_projects.length === 0 ? (
                                <div className="col-span-full text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg bg-muted/10">
                                    No projects have been assigned to your account yet.
                                </div>
                            ) : (
                                recent_projects.map((project: any) => (
                                    <Link key={project.id} href={`/client/projects/${project.id}`} className="block group">
                                        <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-blue-500/50 bg-muted/10 group-hover:bg-background">
                                            <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-start">
                                                        <Badge variant="secondary" className={`capitalize ${getStatusColor(project.status)} px-2 py-0.5 text-[10px]`}>
                                                            {project.status.replace('_', ' ')}
                                                        </Badge>
                                                        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <h3 className="font-bold text-lg leading-tight line-clamp-2">{project.name}</h3>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))
                            )}
                        </div>
                        {recent_projects.length > 0 && (
                            <div className="pt-6 mt-4 border-t flex justify-end">
                                <Button variant="ghost" className="text-blue-600" asChild>
                                    <Link href="/client/projects">View All Projects <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
