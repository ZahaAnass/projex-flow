import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Folder, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function ClientDashboard({ stats, recent_projects }: any) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/client/dashboard' }]}>
            <Head title="Client Dashboard" />
            <div className="p-4 space-y-6">

                <h2 className="text-3xl font-bold tracking-tight">Project Overview</h2>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                            <Folder className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_projects}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_projects}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completed_projects}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Projects List */}
                <div className="grid gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Projects Status</CardTitle>
                            <CardDescription>Real-time progress of your ongoing projects.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {recent_projects.map((project: any) => (
                                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 dark:bg-zinc-900/50">
                                    <div className="space-y-1 w-1/3">
                                        <p className="text-sm font-medium leading-none">{project.name}</p>
                                        <p className="text-xs text-muted-foreground">Due: {project.due_date || 'No Date'}</p>
                                    </div>

                                    <div className="w-1/3 px-4">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>Progress</span>
                                            <span>{project.progress}%</span>
                                        </div>
                                        <Progress value={project.progress} className="h-2" />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>{project.status}</Badge>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/client/projects/${project.id}`}>Details <ArrowRight className="ml-1 h-3 w-3" /></Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
