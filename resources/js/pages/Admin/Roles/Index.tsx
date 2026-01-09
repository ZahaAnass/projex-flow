import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BreadcrumbItem } from '@/types';

type RoleDef = {
    description: string;
    color: string;
    permissions: string[];
};

type Props = {
    definitions: Record<string, RoleDef>;
    stats: Record<string, number>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Roles',
        href: '/admin/roles',
    }
];

export default function RolesIndex({ definitions, stats }: Props) {
    const roles = ['admin', 'team_leader', 'user', 'client'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Roles" />
            <div className="p-4 space-y-6">

                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
                    <p className="text-muted-foreground">
                        Overview of system access levels and user distribution.
                        Since this system uses static roles, permissions are predefined below.
                    </p>
                </div>

                {/* Roles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                    {roles.map((role) => {
                        const def = definitions[role];
                        const count = stats[role] || 0;

                        return (
                            <Card key={role} className="flex flex-col h-full border-t-4 border-t-primary/20 hover:shadow-md transition-shadow">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary" className={`capitalize px-3 py-1 mb-2 ${def.color}`}>
                                            {role.replace('_', ' ')}
                                        </Badge>
                                        <Shield className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <CardTitle className="text-4xl font-bold">{count}</CardTitle>
                                    <CardDescription className="flex items-center gap-1">
                                        <Users className="w-3 h-3" /> Active Users
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1 space-y-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-300 min-h-[40px]">
                                        {def.description}
                                    </p>

                                    <div className="space-y-2">
                                        <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                                            Capabilities
                                        </h4>
                                        <ul className="space-y-1">
                                            {def.permissions.map((perm) => (
                                                <li key={perm} className="text-sm flex items-start gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                    <span>{perm}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-4 border-t bg-muted/20">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Lock className="w-3 h-3" />
                                        <span>Static Definition</span>
                                    </div>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>

                {/* Info Alert */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex gap-3 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100 dark:border-blue-800">
                    <Shield className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <strong>Note on Role Management:</strong> Users can be assigned to these roles via the <span className="font-semibold underline">Users</span> page.
                        Changing a user's role will immediately update their access permissions and dashboard layout upon their next login.
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
