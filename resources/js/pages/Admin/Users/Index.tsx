import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { debounce } from "lodash";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Trash2, Edit } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbItem } from '@/types';
import InertiaPagination from "@/components/inertia-pagination";
import { toast } from "sonner";
import DeleteDialog from "@/components/delete-dialog";

// Types
type LaravelPagination<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number | null;
    to: number | null;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

type Props = {
    users: LaravelPagination<User>;
    filters: {
        search?: string;
        role?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Users', href: '/admin/users' },
];

export default function UsersIndex({ users, filters }: Props) {
    const { flash, auth } = usePage<{
        flash?: { success?: string; error?: string },
        auth: { user: User }
    }>().props;

    // Search Handler
    const handleSearch = useRef(debounce((q: string) => {
        router.get("/admin/users", { ...filters, search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    // Toast Effect
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, {
                id: flash.success,
                className: "bg-green-500 text-white border-green-600",
            });
        }
        if (flash?.error) {
            toast.error(flash.error, {
                id: flash.error,
                className: "bg-red-500 text-white border-red-600",
            });
        }
    }, [flash]);

    // Delete Handler
    function deleteUser(id: number) {
        router.delete(`/admin/users/${id}`, {
            preserveScroll: true,
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />
            <div className="p-4 space-y-4">

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap p-6">
                        <div className="flex gap-4 items-center flex-1">
                            <div className="relative w-full sm:w-64">
                                <Input
                                    defaultValue={filters.search ?? ""}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="peer ps-9"
                                    placeholder="Search users..."
                                />
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-muted-foreground/80">
                                    <Search size={16} />
                                </div>
                            </div>

                            <Select
                                defaultValue={filters.role ?? "all"}
                                onValueChange={(v) => router.get("/admin/users", { ...filters, role: v === "all" ? null : v }, { preserveState: true, replace: true })}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="team_leader">Team Leader</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="client">Client</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button asChild>
                            <Link href={`/admin/users/create`}>+ Add User</Link>
                        </Button>
                    </CardHeader>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.data.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium pl-6">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {user.role.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/users/${user.id}/edit`}>
                                                            <Edit className="w-4 h-4 text-muted-foreground" />
                                                        </Link>
                                                    </Button>

                                                    {user.role !== 'admin' && user.id !== auth.user.id && (
                                                        <DeleteDialog
                                                            title="Delete User"
                                                            description={`Are you sure you want to delete ${user.name}?`}
                                                            onConfirm={() => deleteUser(user.id)}
                                                        >
                                                            <Button variant="ghost" size="icon" className="hover:bg-red-50 hover:text-red-600">
                                                                <Trash2 className="w-4 h-4 text-red-500" />
                                                            </Button>
                                                        </DeleteDialog>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="mt-4">
                    <InertiaPagination data={users} />
                </div>
            </div>
        </AppLayout>
    );
}
