import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, usePage } from "@inertiajs/react"; // Added usePage
import { useRef, useEffect } from "react"; // Added useEffect
import { debounce } from "lodash";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Edit, Trash2, Shield, User as UserIcon } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BreadcrumbItem } from '@/types';
import InertiaPagination from "@/components/inertia-pagination";
import DeleteDialog from "@/components/delete-dialog";
import { toast } from "sonner"; // Imported toast

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Users', href: '/admin/users' },
];

export default function UsersIndex({ users, filters, roles, auth }: any) {
    // Catch flash messages from Laravel
    const { flash } = usePage().props as any;

    // Trigger toast when flash message exists
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleSearch = useRef(debounce((q: string) => {
        router.get("/admin/users", { ...filters, search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    const handleRoleFilter = (role: string) => {
        router.get("/admin/users", { ...filters, role }, { preserveState: true, replace: true });
    };

    function deleteUser(id: number) {
        router.delete(`/admin/users/${id}`, { preserveScroll: true });
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'inactive': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'banned': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />
            <div className="p-6 space-y-6 w-full">

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Team Members</h2>
                        <p className="text-sm text-muted-foreground mt-1">Manage system access and roles across the entire platform.</p>
                    </div>
                    <Button asChild size="lg"><Link href="/admin/users/create"><UserIcon className="mr-2 h-4 w-4"/> Add New User</Link></Button>
                </div>

                <Card className="shadow-sm w-full">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-muted/10 border-b">
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <div className="relative w-full sm:w-80">
                                <Input defaultValue={filters.search ?? ""} onChange={(e) => handleSearch(e.target.value)} className="peer ps-9 bg-background" placeholder="Search by name or email..." />
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/80"><Search size={16} /></div>
                            </div>
                            <Select defaultValue={filters.role ?? "all"} onValueChange={handleRoleFilter}>
                                <SelectTrigger className="w-full sm:w-[200px] bg-background"><SelectValue placeholder="Filter Role" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    {roles.map((r: string) => <SelectItem key={r} value={r} className="capitalize"><span className="flex items-center"><Shield className="mr-2 h-3 w-3 opacity-50"/> {r.replace('_', ' ')}</span></SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="bg-muted/5">
                                    <TableHead className="pl-6 py-4">Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground border-b-0">No users found.</TableCell></TableRow>
                                ) : (
                                    users.data.map((user: any) => (
                                        <TableRow key={user.id} className="hover:bg-muted/20 transition-colors">
                                            <TableCell className="font-medium pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    {user.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize border-primary/20 bg-primary/5 py-1 px-3">
                                                    {user.role.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={`capitalize ${getStatusColor(user.status)} border-none py-1 px-3`}>
                                                    {user.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild><Link href={`/admin/users/${user.id}/edit`} className="w-full cursor-pointer"><Edit className="mr-2 h-4 w-4" /> Edit</Link></DropdownMenuItem>

                                                        {user.id !== auth.user.id && (
                                                            <>
                                                                <DropdownMenuSeparator />
                                                                <DeleteDialog title="Delete User" description={`Remove ${user.name} from the system?`} onConfirm={() => deleteUser(user.id)}>
                                                                    <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-red-100 hover:text-red-900 text-red-600 dark:hover:bg-red-900/30">
                                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                                    </div>
                                                                </DeleteDialog>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <div className="mt-6"><InertiaPagination data={users} /></div>
            </div>
        </AppLayout>
    );
}
