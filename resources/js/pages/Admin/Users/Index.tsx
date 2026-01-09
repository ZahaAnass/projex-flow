import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { useRef } from "react";
import { debounce } from "lodash";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Trash2, Edit } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Users',
        href: '/admin/users',
    }
];

export default function UsersIndex({ users, filters }: any) {

    // Search Handler
    const handleSearch = useRef(debounce((q: string) => {
        router.get("/admin/users", { ...filters, search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />
            <div className="p-4">
                <Card className="border border-sidebar-border/70">
                    <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
                        <div className="flex gap-4 items-center flex-1">
                            <div className="relative w-64">
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
                                <SelectTrigger className="w-40"><SelectValue placeholder="All Roles" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="team_leader">Team Leader</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="client">Client</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button>+ Add User</Button>
                    </CardHeader>

                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.map((user: any) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">{user.role.replace('_', ' ')}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right flex justify-end gap-2">
                                                <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {users.data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">No results found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
