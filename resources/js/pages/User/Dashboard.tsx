import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertCircle, ListTodo, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function UserDashboard({ stats, recent_tasks }: any) {
    return (
        <AppLayout breadcrumbs={[{ title: 'My Dashboard', href: '/user/dashboard' }]}>
            <Head title="My Dashboard" />
            <div className="p-4 space-y-6">

                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
                    <Button asChild>
                        <Link href="/user/tasks">Go to My Tasks</Link>
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-blue-500 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
                            <ListTodo className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_tasks}</div>
                            <p className="text-xs text-muted-foreground">All time tasks</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-yellow-500 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_tasks}</div>
                            <p className="text-xs text-muted-foreground">Active workload</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                            <AlertCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.high_priority}</div>
                            <p className="text-xs text-muted-foreground">Needs attention</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completed_tasks}</div>
                            <p className="text-xs text-muted-foreground">Tasks finished</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Tasks List */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Tasks</CardTitle>
                            <CardDescription>Your latest assigned work.</CardDescription>
                        </div>
                        <Link href="/user/tasks" className="text-sm text-blue-600 hover:underline flex items-center">
                            View Board <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recent_tasks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                            No tasks assigned yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recent_tasks.map((task: any) => (
                                        <TableRow key={task.id}>
                                            <TableCell className="font-medium">{task.title}</TableCell>
                                            <TableCell>{task.project?.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={
                                                    task.priority === 'high' ? 'text-red-600 border-red-200 bg-red-50' :
                                                        task.priority === 'medium' ? 'text-amber-600 border-amber-200 bg-amber-50' :
                                                            'text-blue-600 border-blue-200 bg-blue-50'
                                                }>
                                                    {task.priority}
                                                </Badge>
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
