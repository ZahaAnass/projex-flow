import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldAlert, Briefcase, User as UserIcon, Eye, CheckCircle2 } from "lucide-react";
import { BreadcrumbItem } from '@/types';
import { cn } from "@/lib/utils";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Roles & Permissions', href: '/admin/roles' },
];

// Static creative data for the roles
const rolesData = [
    {
        id: 'admin',
        title: 'System Admin',
        description: 'Unrestricted access to the entire platform and settings.',
        icon: ShieldAlert,
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-200 dark:border-purple-900/50',
        gradient: 'from-purple-500/5 to-transparent',
        permissions: [
            'Manage all users and assign roles',
            'Full access to all projects and tasks',
            'System configuration and settings',
            'View global time and activity logs',
            'Delete sensitive records'
        ]
    },
    {
        id: 'team_leader',
        title: 'Team Leader',
        description: 'Project managers who oversee sprints and team members.',
        icon: Briefcase,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-200 dark:border-blue-900/50',
        gradient: 'from-blue-500/5 to-transparent',
        permissions: [
            'Create and edit assigned projects',
            'Manage sprints and deadlines',
            'Create, assign, and delete tasks',
            'Review team time entries',
            'Cannot manage system users'
        ]
    },
    {
        id: 'user',
        title: 'Team Member',
        description: 'Standard users executing tasks and logging time.',
        icon: UserIcon,
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-200 dark:border-emerald-900/50',
        gradient: 'from-emerald-500/5 to-transparent',
        permissions: [
            'View assigned projects and sprints',
            'Update task statuses (Kanban)',
            'Log working hours to tasks',
            'Add comments and attachments',
            'Cannot delete projects or tasks'
        ]
    },
    {
        id: 'client',
        title: 'Client Viewer',
        description: 'External stakeholders monitoring project progress.',
        icon: Eye,
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-200 dark:border-amber-900/50',
        gradient: 'from-amber-500/5 to-transparent',
        permissions: [
            'Read-only access to specific projects',
            'View completed tasks and milestones',
            'Leave feedback via comments',
            'Cannot view internal time logs',
            'Cannot modify any task states'
        ]
    }
];

export default function RolesIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Roles" />
            <div className="p-6 space-y-8 w-full max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-2 mt-4 mb-8">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary mb-2">
                        Security & Access
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Roles & Permissions</h2>
                    <p className="text-muted-foreground max-w-2xl text-base">
                        Review the access levels available within the platform. Roles are strictly enforced to ensure data security and proper workflow management.
                    </p>
                </div>

                {/* Creative Roles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {rolesData.map((role) => {
                        const Icon = role.icon;
                        return (
                            <Card
                                key={role.id}
                                className={cn(
                                    "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-t-4",
                                    role.borderColor
                                )}
                            >
                                {/* Background Gradient Blob */}
                                <div className={cn("absolute inset-0 bg-gradient-to-b opacity-50 pointer-events-none", role.gradient)} />

                                <CardHeader className="relative z-10 pb-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={cn("p-2.5 rounded-xl shadow-sm", role.bgColor)}>
                                            <Icon className={cn("h-6 w-6", role.color)} />
                                        </div>
                                        <CardTitle className="text-xl">{role.title}</CardTitle>
                                    </div>
                                    <CardDescription className="text-sm leading-relaxed">
                                        {role.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="relative z-10 pt-6">
                                    <div className="space-y-1 mb-4">
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Access Privileges</span>
                                    </div>
                                    <ul className="space-y-3">
                                        {role.permissions.map((perm, index) => (
                                            <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                                <CheckCircle2 className={cn("h-4 w-4 shrink-0 mt-0.5", role.color)} />
                                                <span className="leading-snug">{perm}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

            </div>
        </AppLayout>
    );
}
