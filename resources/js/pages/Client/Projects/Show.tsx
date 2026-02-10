import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Calendar } from "lucide-react";
import ClientReadKanban from "./ClientReadKanban"; // We create this next

export default function ClientProjectShow({ project, tasks }: any) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Projects', href: '/client/projects' }, { title: project.name, href: '' }]}>
            <Head title={project.name} />

            <div className="flex flex-col h-screen max-h-[calc(100vh-64px)]">
                {/* Header */}
                <div className="px-6 py-4 border-b bg-background flex items-center gap-4 shrink-0">
                    <Link href="/client/projects" className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">{project.name}</h1>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> Due: {project.due_date || 'N/A'}</span>
                            <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 capitalize">{project.status}</span>
                        </div>
                    </div>
                </div>

                {/* Read-Only Kanban Board */}
                <div className="flex-1 overflow-hidden p-4 bg-muted/20">
                    <ClientReadKanban tasks={tasks} />
                </div>
            </div>
        </AppLayout>
    );
}
