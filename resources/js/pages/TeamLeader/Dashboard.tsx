import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Clock, FileText, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type TeamDashboardProps = {
    stats: {
        active_projects: number;
        pending_tasks: number;
        completed_tasks: number;
    };
    recent_tasks: Array<{
        id: number;
        title: string;
        project: {
            name: string;
        } | null;
        assignee: {
            name: string;
        } | null;
        status: string;
    }>;
};

type task = {
    id: number;
    title: string;
    project: {
        name: string;
    } | null;
    assignee: {
        name: string;
    } | null;
    status: string;
};

export default function TeamDashboard({ stats, recent_tasks }: TeamDashboardProps) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Team', href: '/team/dashboard' }]}>
            <Head title="Team Dashboard" />
            <div className="p-4 space-y-6">

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                            <FileText className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_projects}</div>
                            <p className="text-xs text-muted-foreground">Currently in progress</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-yellow-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_tasks}</div>
                            <p className="text-xs text-muted-foreground">Tasks in To-Do</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completed_tasks}</div>
                            <p className="text-xs text-muted-foreground">Successfully finished</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card className="col-span-4">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Team Tasks</CardTitle>
                            <CardDescription>Latest updates across your projects.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/team/projects`}>View All Projects <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Task</TableHead>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Assignee</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recent_tasks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">No recent activity.</TableCell>
                                    </TableRow>
                                ) : (
                                    recent_tasks.map((task: task) => (
                                        <TableRow key={task.id}>
                                            <TableCell className="font-medium">{task.title}</TableCell>
                                            <TableCell>{task.project?.name}</TableCell>
                                            <TableCell>
                                                {task.assignee ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
                                                            {task.assignee.name.charAt(0)}
                                                        </div>
                                                        <span className="text-xs">{task.assignee.name}</span>
                                                    </div>
                                                ) : <span className="text-xs text-muted-foreground italic">Unassigned</span>}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={task.status === 'done' ? 'default' : 'secondary'}>
                                                    {task.status.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
