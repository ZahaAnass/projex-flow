import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Briefcase, ArrowUpRight, Timer, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    }
];

export default function AdminDashboard({ stats, recent_projects, task_distribution }: any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="p-4 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">System Overview</h2>
                    <div className="flex items-center space-x-2">
                        <Button asChild>
                            <Link href="/admin/projects/create">+ New Project</Link>
                        </Button>
                    </div>
                </div>

                {/* Professional Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                            <Briefcase className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_projects}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Sprints</CardTitle>
                            <Timer className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_sprints}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Hours Logged</CardTitle>
                            <Clock className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_hours}h</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Recent Projects */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Recent Projects</CardTitle>
                            <CardDescription>Latest projects created in the system.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {recent_projects.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-4">No projects found.</div>
                                ) : (
                                    recent_projects.map((project: any) => (
                                        <div key={project.id} className="flex items-center">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{project.name}</p>
                                                <p className="text-xs text-muted-foreground">Manager: {project.owner}</p>
                                            </div>
                                            <div className="ml-auto font-medium">
                                                <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                                    {project.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Task Distribution */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Global Task Status</CardTitle>
                            <CardDescription>Distribution across all projects.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700" />
                                        <span className="text-sm font-medium">To Do</span>
                                    </div>
                                    <span className="font-bold">{task_distribution.todo}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-blue-500" />
                                        <span className="text-sm font-medium">In Progress</span>
                                    </div>
                                    <span className="font-bold">{task_distribution.in_progress}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                        <span className="text-sm font-medium">Review</span>
                                    </div>
                                    <span className="font-bold">{task_distribution.review}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-green-500" />
                                        <span className="text-sm font-medium">Done</span>
                                    </div>
                                    <span className="font-bold">{task_distribution.done}</span>
                                </div>

                                <div className="pt-4 mt-4 border-t">
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/admin/tasks">View All Tasks <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
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
