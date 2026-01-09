import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const user = usePage().props.auth.user;

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome back, {user.name}!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-zinc-500">
                            You are logged in as <span className="font-bold capitalize">{user.role}</span>.
                            Please use the sidebar to navigate to your specific workspace.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
