import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, CheckSquare, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TeamDashboard({ stats, recent_projects, task_distribution }: any) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Team', href: '/team/dashboard' }]}>
            <Head title="Team Dashboard" />
            <div className="p-4 space-y-6">

                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Team Overview</h2>
                    <Button asChild>
                        <Link href="/team/tasks/create">+ New Task</Link>
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_projects}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_tasks}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completed_tasks}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Recent Projects */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Recent Projects</CardTitle>
                            <CardDescription>Latest projects added.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {recent_projects.map((project: any) => (
                                    <div key={project.id} className="flex items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{project.name}</p>
                                            <p className="text-xs text-muted-foreground">Owner: {project.owner}</p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>{project.status}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Task Overview */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Task Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(task_distribution).map(([key, val]: any) => (
                                    <div key={key} className="flex items-center justify-between">
                                        <span className="capitalize text-sm">{key.replace('_', ' ')}</span>
                                        <span className="font-bold">{val}</span>
                                    </div>
                                ))}
                                <div className="pt-4 mt-4 border-t">
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/team/tasks">Manage Tasks</Link>
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
