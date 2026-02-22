import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, ArrowUpRight, Timer, CheckSquare, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Leader Workspace', href: '/leader/dashboard' }
];

export default function LeaderDashboard({ stats, recent_projects, task_distribution }: any) {
    // Calculate total tasks strictly for their own projects
    const totalTasks = Object.values(task_distribution).reduce((acc: any, val: any) => acc + val, 0) || 1;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leader Dashboard" />
            <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Your Workspace</h2>
                        <p className="text-muted-foreground mt-1">Track the progress of projects under your management.</p>
                    </div>
                    {/* We will route this to a specific Leader Task creation later */}
                    <Button asChild size="lg">
                        <Link href="/leader/tasks/create">+ Create Task</Link>
                    </Button>
                </div>

                {/* Scoped Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="shadow-sm border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Your Active Projects</CardTitle>
                            <Briefcase className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.active_projects ?? 0}</div></CardContent>
                    </Card>
                    <Card className="shadow-sm border-l-4 border-l-amber-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Sprints</CardTitle>
                            <Timer className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        {/* Added ?? 0 fallback */}
                        <CardContent><div className="text-2xl font-bold">{stats.active_sprints ?? 0}</div></CardContent>
                    </Card>
                    <Card className="shadow-sm border-l-4 border-l-purple-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tracked Tasks</CardTitle>
                            <CheckSquare className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        {/* Added ?? 0 fallback */}
                        <CardContent><div className="text-2xl font-bold">{stats.total_tasks ?? 0}</div></CardContent>
                    </Card>
                    <Card className="shadow-sm border-l-4 border-l-emerald-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                            <Target className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.completed_tasks ?? 0}</div></CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

                    {/* Leader's Own Projects */}
                    <Card className="col-span-4 shadow-sm border-t-4 border-t-primary">
                        <CardHeader>
                            <CardTitle>Your Managed Projects</CardTitle>
                            <CardDescription>Recent projects assigned to you as Team Leader.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {recent_projects.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg bg-muted/10">
                                        You don't own any projects yet.
                                    </div>
                                ) : (
                                    recent_projects.map((project: any) => (
                                        <div key={project.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border">
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold leading-none text-foreground">{project.name}</p>
                                                <p className="text-xs text-muted-foreground">Created: {new Date(project.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="capitalize shadow-sm px-3">
                                                {project.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    ))
                                )}
                            </div>

                            {recent_projects.length > 0 && (
                                <div className="pt-6 mt-4 border-t">
                                    <Button variant="ghost" className="w-full text-primary" asChild>
                                        <Link href="/leader/projects">View All My Projects <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Task Progress Within Their Projects */}
                    <Card className="col-span-3 shadow-sm border-t-4 border-t-blue-500">
                        <CardHeader>
                            <CardTitle>Team Task Progress</CardTitle>
                            <CardDescription>Visual breakdown of tasks across your projects.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* To Do */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 font-medium">
                                            <div className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-600" /> To Do
                                        </div>
                                        <span className="font-bold text-muted-foreground">{task_distribution.todo}</span>
                                    </div>
                                    <Progress value={(task_distribution.todo / totalTasks as number) * 100} className="h-2" />
                                </div>

                                {/* In Progress */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 font-medium">
                                            <div className="h-3 w-3 rounded-full bg-blue-500" /> In Progress
                                        </div>
                                        <span className="font-bold text-muted-foreground">{task_distribution.in_progress}</span>
                                    </div>
                                    <Progress value={(task_distribution.in_progress / totalTasks as number) * 100} className="h-2 [&>div]:bg-blue-500" />
                                </div>

                                {/* Review */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 font-medium">
                                            <div className="h-3 w-3 rounded-full bg-amber-500" /> Review
                                        </div>
                                        <span className="font-bold text-muted-foreground">{task_distribution.review}</span>
                                    </div>
                                    <Progress value={(task_distribution.review / totalTasks as number) * 100} className="h-2 [&>div]:bg-amber-500" />
                                </div>

                                {/* Done */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 font-medium">
                                            <div className="h-3 w-3 rounded-full bg-emerald-500" /> Done
                                        </div>
                                        <span className="font-bold text-muted-foreground">{task_distribution.done}</span>
                                    </div>
                                    <Progress value={(task_distribution.done / totalTasks as number) * 100} className="h-2 [&>div]:bg-emerald-500" />
                                </div>

                                <div className="pt-6 border-t">
                                    <Button variant="outline" className="w-full bg-muted/20" asChild>
                                        <Link href="/leader/tasks">Open Team Task Board <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
