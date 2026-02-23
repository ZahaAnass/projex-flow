import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ListTodo, CheckCircle2, Clock, Calendar, ArrowUpRight, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'My Workspace', href: '/user/dashboard' }
];

export default function UserDashboard({ stats, upcoming_deadlines, recent_logs }: any) {

    const formatDuration = (totalMinutes: number) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h`;
        return `${minutes}m`;
    };

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'urgent': return 'bg-red-500/10 text-red-600 border-red-200/50';
            case 'high': return 'bg-amber-500/10 text-amber-600 border-amber-200/50';
            case 'medium': return 'bg-blue-500/10 text-blue-600 border-blue-200/50';
            default: return 'bg-slate-500/10 text-slate-600 border-slate-200/50';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Workspace" />
            <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">My Workspace</h2>
                        <p className="text-muted-foreground mt-1">Track your assigned tasks and log your working hours.</p>
                    </div>
                    <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                        <Link href="/user/time-entries"><Clock className="mr-2 h-4 w-4"/> Log Time</Link>
                    </Button>
                </div>

                {/* Personal Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="shadow-sm border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                            <ListTodo className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.pending_tasks ?? 0}</div></CardContent>
                    </Card>
                    <Card className="shadow-sm border-l-4 border-l-amber-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Review</CardTitle>
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.review_tasks ?? 0}</div></CardContent>
                    </Card>
                    <Card className="shadow-sm border-l-4 border-l-emerald-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.completed_tasks ?? 0}</div></CardContent>
                    </Card>
                    <Card className="shadow-sm border-l-4 border-l-purple-500 bg-purple-500/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">Hours This Week</CardTitle>
                            <Clock className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold text-purple-700 dark:text-purple-400">{stats.hours_this_week ?? 0}h</div></CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">

                    {/* Upcoming Deadlines */}
                    <Card className="shadow-sm border-t-4 border-t-primary">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> Upcoming Deadlines</CardTitle>
                            <CardDescription>Your assigned tasks that are due soon.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcoming_deadlines.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg bg-muted/10">
                                        You have no upcoming deadlines! 🎉
                                    </div>
                                ) : (
                                    upcoming_deadlines.map((task: any) => (
                                        <div key={task.id} className="flex flex-col gap-2 p-3 hover:bg-muted/50 rounded-lg transition-colors border border-border/50">
                                            <div className="flex items-start justify-between">
                                                <p className="text-sm font-semibold leading-snug">{task.title}</p>
                                                <Badge variant="outline" className={`ml-2 px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-bold shrink-0 ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-xs text-muted-foreground truncate max-w-[200px]">{task.project?.name}</span>
                                                <span className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center">
                                                    <Calendar className="h-3 w-3 mr-1" /> {new Date(task.due_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="pt-6 mt-4 border-t">
                                <Button variant="ghost" className="w-full text-primary" asChild>
                                    <Link href="/user/tasks">Open My Kanban Board <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Time Logs */}
                    <Card className="shadow-sm border-t-4 border-t-emerald-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-emerald-500" /> Recent Time Logs</CardTitle>
                            <CardDescription>The last few time entries you recorded.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recent_logs.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg bg-muted/10">
                                        You haven't logged any time yet.
                                    </div>
                                ) : (
                                    recent_logs.map((log: any) => (
                                        <div key={log.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors border border-border/50">
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold leading-none truncate max-w-[250px]">{log.task?.title || 'Unknown Task'}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(log.date).toLocaleDateString()}</p>
                                            </div>
                                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold px-3 py-1">
                                                {formatDuration(log.duration_minutes)}
                                            </Badge>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="pt-6 mt-4 border-t">
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/user/time-entries">Manage All Time Logs <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
