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
import { ArrowLeft, Save, Clock } from 'lucide-react';

export default function TimeEntryCreate({ my_tasks }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'My Workspace', href: '/user/dashboard' },
        { title: 'Time Logs', href: '/user/time-entries' },
        { title: 'Log Time', href: '/user/time-entries/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        task_id: '',
        date: new Date().toISOString().split('T')[0],
        duration_minutes: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/user/time-entries', {
            onError: () => toast.error("Please fix the errors in the form.", { className: "bg-red-50 text-red-600 border-red-200" }),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Log Time" />
            <div className="max-w-4xl mx-auto p-6 space-y-6 w-full">

                <Link href="/user/time-entries" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to History
                </Link>

                <Card className="border-t-4 border-t-emerald-500 shadow-lg w-full">
                    <CardHeader className="bg-muted/10 pb-8 px-8 border-b">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-xl"><Clock className="h-8 w-8 text-emerald-600 dark:text-emerald-400" /></div>
                            <div>
                                <CardTitle className="text-2xl">Log Working Hours</CardTitle>
                                <CardDescription className="text-base mt-1">Record the time spent on your active tasks.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <form onSubmit={submit}>
                        <CardContent className="space-y-8 p-8">

                            <div className="space-y-3">
                                <Label className="text-base">Select Task <span className="text-red-500">*</span></Label>
                                <Select value={data.task_id} onValueChange={(val) => setData('task_id', val)}>
                                    <SelectTrigger className="h-12 text-base">
                                        <SelectValue placeholder="Choose a task you are working on..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {my_tasks.length === 0 ? (
                                            <SelectItem value="none" disabled>No active tasks assigned to you</SelectItem>
                                        ) : (
                                            my_tasks.map((t: any) => <SelectItem key={t.id} value={String(t.id)} className="text-base">{t.title}</SelectItem>)
                                        )}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.task_id} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-base">Date <span className="text-red-500">*</span></Label>
                                    <Input type="date" className="h-12 text-base" value={data.date} onChange={(e) => setData('date', e.target.value)} max={new Date().toISOString().split('T')[0]} />
                                    <InputError message={errors.date} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-base">Duration (in Minutes) <span className="text-red-500">*</span></Label>
                                    <Input type="number" min="1" className="h-12 text-base" placeholder="e.g. 120 (for 2 hours)" value={data.duration_minutes} onChange={(e) => setData('duration_minutes', e.target.value)} />
                                    <p className="text-xs text-muted-foreground">1 hour = 60 mins</p>
                                    <InputError message={errors.duration_minutes} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-base">Work Description <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                                <Textarea className="text-base resize-y" rows={4} placeholder="Briefly describe what you accomplished..." value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                <InputError message={errors.description} />
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-end gap-4 py-6 px-8 bg-muted/5 border-t">
                            <Button variant="outline" size="lg" className="h-12 px-6" asChild><Link href="/user/time-entries">Cancel</Link></Button>
                            <Button type="submit" size="lg" disabled={processing || my_tasks.length === 0} className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white">
                                {processing ? 'Saving...' : <><Save className="mr-2 h-5 w-5" /> Save Time Log</>}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
