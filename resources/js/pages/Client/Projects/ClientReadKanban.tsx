import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

// Simplified Task Type
type Task = {
    id: number;
    title: string;
    priority: string;
    status: string;
    project_id: number;
    assignee?: { name: string } | null;
    created_at?: string;
};

const columns = [
    { id: "todo", title: "To Do" },
    { id: "in_progress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
];

export default function ClientReadKanban({ tasks }: { tasks: Task[] }) {
    return (
        <div className="flex h-full gap-4 overflow-x-auto pb-4">
            {columns.map((col) => (
                <div
                    key={col.id}
                    className="w-[300px] min-w-[300px] flex flex-col bg-slate-100/50 dark:bg-zinc-900/30 rounded-xl p-4 border border-border/40"
                >
                    {/* Column Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-foreground tracking-tight">{col.title}</h3>
                        <Badge variant="secondary" className="rounded-full px-2">
                            {tasks.filter((t) => t.status === col.id).length}
                        </Badge>
                    </div>

                    {/* Cards Container */}
                    <div className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-[100px]">
                        {tasks
                            .filter((task) => task.status === col.id)
                            .map((task) => (
                                <ReadOnlyCard key={task.id} task={task} />
                            ))}

                        {tasks.filter((t) => t.status === col.id).length === 0 && (
                            <div className="text-center py-8 text-sm text-muted-foreground italic border-2 border-dashed rounded-lg">
                                No tasks
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

function ReadOnlyCard({ task }: { task: Task }) {
    const getPriorityColor = (p: string) => {
        const map: any = {
            low: "text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20",
            medium: "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20",
            high: "text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20"
        };
        return map[p?.toLowerCase()] || map.low;
    };

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-border/40 bg-white dark:bg-zinc-900 p-4 shadow-sm">
            <div className="flex items-start justify-between">
                <Badge variant="outline" className={cn("text-[10px] uppercase", getPriorityColor(task.priority))}>
                    {task.priority}
                </Badge>
            </div>

            <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
                {task.title}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{task.created_at ? new Date(task.created_at).toLocaleDateString() : 'N/A'}</span>
                </div>

                {task.assignee && (
                    <div className="flex items-center gap-2" title={`Assigned to ${task.assignee.name}`}>
                        <Avatar className="h-6 w-6 border border-background">
                            <AvatarFallback className="text-[9px]">
                                {task.assignee.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                )}
            </div>
        </div>
    );
}
