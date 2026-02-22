import { FormEventHandler } from 'react';
import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import InputError from '@/components/input-error';
import { BreadcrumbItem } from '@/types';
import { toast } from "sonner";
import { ArrowLeft, Save, Timer } from 'lucide-react';

export default function SprintCreate({ projects }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Leader Workspace', href: '/leader/dashboard' },
        { title: 'Sprints', href: '/leader/sprints' },
        { title: 'Create', href: '/leader/sprints/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        goal: '',
        project_id: '',
        status: 'planned',
        start_date: '',
        end_date: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/leader/sprints', {
            onError: () => toast.error("Please fix the errors in the form.", { className: "bg-red-50 text-red-600 border-red-200" }),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Sprint" />
            <div className="max-w-5xl mx-auto p-6 space-y-6 w-full">

                <Link href="/leader/sprints" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sprints
                </Link>

                <Card className="border-t-4 border-t-primary shadow-lg w-full">
                    <CardHeader className="bg-muted/10 pb-8 px-8 border-b">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl"><Timer className="h-8 w-8 text-primary" /></div>
                            <div>
                                <CardTitle className="text-2xl">Plan New Sprint</CardTitle>
                                <CardDescription className="text-base mt-1">Define the cycle, goals, and timeline.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <form onSubmit={submit}>
                        <CardContent className="space-y-10 p-8">

                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider pb-2 border-b">Sprint Identity</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label htmlFor="name" className="text-base">Sprint Name <span className="text-red-500">*</span></Label>
                                        <Input id="name" className="h-12 text-base" value={data.name} onChange={(e) => setData('name', e.target.value)} autoFocus />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-base">Project <span className="text-red-500">*</span></Label>
                                        <Select value={data.project_id} onValueChange={(val) => setData('project_id', val)}>
                                            <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Select a project" /></SelectTrigger>
                                            <SelectContent>
                                                {projects.map((p: any) => <SelectItem key={p.id} value={String(p.id)} className="text-base">{p.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.project_id} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider pb-2 border-b">Timeline & Status</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-base">Status</Label>
                                        <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                            <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="planned" className="text-base">Planned</SelectItem>
                                                <SelectItem value="active" className="text-base text-blue-600 font-medium">Active</SelectItem>
                                                <SelectItem value="completed" className="text-base text-emerald-600 font-medium">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.status} />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="start_date" className="text-base">Start Date <span className="text-red-500">*</span></Label>
                                        <Input id="start_date" type="date" className="h-12 text-base" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} />
                                        <InputError message={errors.start_date} />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="end_date" className="text-base">End Date <span className="text-red-500">*</span></Label>
                                        <Input id="end_date" type="date" className="h-12 text-base" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} />
                                        <InputError message={errors.end_date} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="goal" className="text-base">Sprint Goal</Label>
                                <Textarea id="goal" className="text-base resize-y" value={data.goal} onChange={(e) => setData('goal', e.target.value)} rows={4} />
                                <InputError message={errors.goal} />
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-end gap-4 py-6 px-8 bg-muted/5 border-t">
                            <Button variant="outline" size="lg" className="h-12 px-6" asChild><Link href="/leader/sprints">Cancel</Link></Button>
                            <Button type="submit" size="lg" disabled={processing} className="h-12 px-8">
                                {processing ? 'Saving...' : <><Save className="mr-2 h-5 w-5" /> Plan Sprint</>}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
