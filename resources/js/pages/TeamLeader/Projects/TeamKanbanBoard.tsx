import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Simplified Task Type
export type Task = {
    id: number;
    title: string;
    priority: string;
    status: string;
    project_id: number;
    assignee?: { name: string } | null;
};

const columns = [
    { id: "todo", title: "To Do" },
    { id: "in_progress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
];

export default function TeamKanbanBoard({ tasks: initialTasks }: { tasks: Task[] }) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [activeId, setActiveId] = useState<number | null>(null);

    useEffect(() => { setTasks(initialTasks); }, [initialTasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    function onDragEnd(event: any) {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // Find the task in state
        const task = tasks.find(t => t.id === activeId);
        if (!task) return;

        // Case 1: Dropped over a column
        const isColumn = columns.some(c => c.id === overId);
        let newStatus = task.status;

        if (isColumn) {
            newStatus = overId;
        } else {
            // Case 2: Dropped over another task
            const overTask = tasks.find(t => t.id === overId);
            if (overTask) newStatus = overTask.status;
        }

        // Optimistic Update
        if (task.status !== newStatus) {
            setTasks(prev => prev.map(t => t.id === activeId ? { ...t, status: newStatus } : t));

            // Backend Update
            router.put(`/team/tasks/${task.id}`, {
                ...task,
                status: newStatus
            }, { preserveScroll: true });
        }
    }

    // Delete Task
    function deleteTask(id: number) {
        if(confirm('Are you sure you want to delete this task?')) {
            router.delete(`/team/tasks/${id}`, {
                preserveScroll: true,
                onSuccess: () => setTasks(prev => prev.filter(t => t.id !== id))
            });
        }
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd} onDragStart={(e) => setActiveId(Number(e.active.id))}>
            <div className="flex h-full gap-4 overflow-x-auto pb-4">
                {columns.map(col => (
                    <div key={col.id} className="w-[300px] min-w-[300px] flex flex-col bg-slate-100 dark:bg-slate-900 rounded-xl p-3 border">
                        <div className="font-semibold mb-3 flex justify-between items-center px-1">
                            {col.title}
                            <Badge variant="secondary" className="rounded-full">{tasks.filter(t => t.status === col.id).length}</Badge>
                        </div>
                        <SortableContext items={tasks.filter(t => t.status === col.id).map(t => t.id)} strategy={verticalListSortingStrategy}>
                            <div className="flex-1 space-y-3 overflow-y-auto min-h-[100px]">
                                {tasks.filter(t => t.status === col.id).map(task => (
                                    <SortableTask key={task.id} task={task} onDelete={() => deleteTask(task.id)} />
                                ))}
                            </div>
                        </SortableContext>
                    </div>
                ))}
            </div>
            <DragOverlay>
                {activeId ? <SortableTask task={tasks.find(t => t.id === activeId)!} isOverlay /> : null}
            </DragOverlay>
        </DndContext>
    );
}

function SortableTask({ task, isOverlay, onDelete }: { task: Task, isOverlay?: boolean, onDelete?: () => void }) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: task.id });

    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}
             className={cn("bg-white dark:bg-slate-800 p-3 rounded-lg border shadow-sm cursor-grab active:cursor-grabbing", isOverlay && "shadow-xl rotate-2 ring-2 ring-primary")}
        >
            <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className={cn("text-[10px] uppercase",
                    task.priority === 'high' ? "text-red-600 border-red-200 bg-red-50" :
                        task.priority === 'medium' ? "text-amber-600 border-amber-200 bg-amber-50" :
                            "text-blue-600 border-blue-200 bg-blue-50"
                )}>{task.priority}</Badge>

                {!isOverlay && onDelete && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2"><MoreHorizontal className="h-3 w-3" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-red-600" onClick={onDelete}>
                                <Trash2 className="mr-2 h-3 w-3" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
            <p className="font-medium text-sm leading-snug mb-3">{task.title}</p>
            {task.assignee && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                    <Avatar className="h-5 w-5"><AvatarImage /><AvatarFallback className="text-[9px]">{task.assignee.name[0]}</AvatarFallback></Avatar>
                    <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
                </div>
            )}
        </div>
    );
}
