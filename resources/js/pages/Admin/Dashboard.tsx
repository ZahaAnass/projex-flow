import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Users, Briefcase, ArrowUpRight, Timer, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Admin", href: "/admin/dashboard" }
];

export default function AdminDashboard({
                                           stats,
                                           recent_projects,
                                           task_distribution
                                       }: any) {
    const totalTasks =
        Object.values(task_distribution).reduce(
            (acc: number, val: any) => acc + Number(val),
            0
        ) || 1;

    const calculatePercent = (value: number) =>
        Math.round((value / totalTasks) * 100);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="p-6 space-y-8 w-full">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            System Overview
                        </h2>
                        <p className="text-muted-foreground mt-1">
                            Monitor your agency's performance and projects.
                        </p>
                    </div>

                    <Button asChild size="lg">
                        <Link href="/admin/projects/create">
                            + New Project
                        </Link>
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Users
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_users}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Projects
                            </CardTitle>
                            <Briefcase className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.active_projects}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Sprints
                            </CardTitle>
                            <Timer className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.active_sprints}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Hours Logged
                            </CardTitle>
                            <Clock className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_hours}h
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">

                    {/* Recent Projects */}
                    <Card className="border border-border">
                        <CardHeader>
                            <CardTitle>Recent Projects</CardTitle>
                            <CardDescription>
                                Latest projects created in the system.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-5">
                                {recent_projects.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                                        No projects found.
                                    </div>
                                ) : (
                                    recent_projects.map((project: any) => (
                                        <div
                                            key={project.id}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition"
                                        >
                                            <div>
                                                <p className="font-semibold text-sm">
                                                    {project.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Manager: {project.owner}
                                                </p>
                                            </div>

                                            <Badge
                                                variant={
                                                    project.status === "active"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                                className="capitalize"
                                            >
                                                {project.status.replace(
                                                    "_",
                                                    " "
                                                )}
                                            </Badge>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Global Task Status */}
                    <Card className="border border-border">
                        <CardHeader>
                            <CardTitle>Global Task Status</CardTitle>
                            <CardDescription>
                                Visual breakdown of all ongoing work.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">

                            {/* To Do */}
                            <div className="space-y-2 mb-8">
                                <div className="flex justify-between text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full bg-slate-400" />
                                        To Do
                                    </div>
                                    <span className="text-muted-foreground">
                                        {task_distribution.todo}
                                    </span>
                                </div>
                                <Progress
                                    value={calculatePercent(
                                        task_distribution.todo
                                    )}
                                    className="h-2"
                                />
                            </div>

                            {/* In Progress */}
                            <div className="space-y-2 mb-8">
                                <div className="flex justify-between text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full bg-blue-500" />
                                        In Progress
                                    </div>
                                    <span className="text-muted-foreground">
                                        {task_distribution.in_progress}
                                    </span>
                                </div>
                                <Progress
                                    value={calculatePercent(
                                        task_distribution.in_progress
                                    )}
                                    className="h-2 [&>div]:bg-blue-500"
                                />
                            </div>

                            {/* Review */}
                            <div className="space-y-2 mb-8">
                                <div className="flex justify-between text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full bg-yellow-500" />
                                        Review
                                    </div>
                                    <span className="text-muted-foreground">
                                        {task_distribution.review}
                                    </span>
                                </div>
                                <Progress
                                    value={calculatePercent(
                                        task_distribution.review
                                    )}
                                    className="h-2 [&>div]:bg-yellow-500"
                                />
                            </div>

                            {/* Done */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full bg-green-500" />
                                        Done
                                    </div>
                                    <span className="text-muted-foreground">
                                        {task_distribution.done}
                                    </span>
                                </div>
                                <Progress
                                    value={calculatePercent(
                                        task_distribution.done
                                    )}
                                    className="h-2 [&>div]:bg-green-500"
                                />
                            </div>

                            <div className="pt-4">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    asChild
                                >
                                    <Link href="/admin/tasks">
                                        Manage All Tasks
                                        <ArrowUpRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
