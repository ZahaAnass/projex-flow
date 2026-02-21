import { useState, useMemo, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MoreHorizontal,
    Plus,
    Calendar,
    Edit,
    Trash2,
    Clock
} from "lucide-react";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteDialog from "@/components/delete-dialog";
import InertiaPagination from "@/components/inertia-pagination";

export type Task = {
    id: number;
    title: string;
    type: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'todo' | 'in_progress' | 'review' | 'done';
    project_id: number;
    assigned_to: number | null;
    project?: { name: string };
    sprint?: { name: string } | null;
    assignee?: { name: string } | null;
    description?: string;
    created_at?: string;
    estimated_hours?: number;
    due_date?: string;
};

type PaginatedTasks = {
    data: Task[];
    links: any[];
    meta?: any;
    from: number;
    to: number;
    total: number;
};

type Column = {
    id: string;
    title: string;
};

const initialColumns: Column[] = [
    { id: "todo", title: "To Do" },
    { id: "in_progress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
];

export default function TasksKanban({ tasks: paginatedTasks }: { tasks: PaginatedTasks }) {
    const [tasks, setTasks] = useState<Task[]>(paginatedTasks.data);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    useEffect(() => {
        setTasks(paginatedTasks.data);
    }, [paginatedTasks.data]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 3 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const columnsId = useMemo(() => initialColumns.map((col) => col.id), []);

    function deleteTask(id: number) {
        router.delete(`/admin/tasks/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setTasks((prev) => prev.filter(t => t.id !== id));
            }
        });
    }

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }
        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = over.data.current?.type === "Task";

        if (!isActiveTask) return;

        if (isActiveTask && isOverTask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);

                if (tasks[activeIndex].status !== tasks[overIndex].status) {
                    tasks[activeIndex].status = tasks[overIndex].status;
                }

                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        const isOverColumn = over.data.current?.type === "Column";

        if (isActiveTask && isOverColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                tasks[activeIndex].status = overId as Task['status'];
                return arrayMove(tasks, activeIndex, activeIndex);
            });
        }
    }

    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveColumn(null);
        setActiveTask(null);

        if (!over) return;

        const activeId = active.id;
        const activeTask = tasks.find(t => t.id === activeId);

        if (activeTask) {
            router.put(`/admin/tasks/${activeTask.id}`, {
                ...activeTask,
                status: activeTask.status,
            }, {
                preserveScroll: true,
                onError: () => toast.error("Failed to sync move."),
            });
        }
    }

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: "0.5" } },
        }),
    };

    return (
        // FIX 1: Added min-h-0 to ensure flex children don't overflow the screen
        <div className="flex flex-col h-full space-y-4 min-h-0">
            {/* FIX 2: Added 'flex' here so 'flex-col' actually works and constrains the column height! */}
            <div className="relative flex flex-1 w-full flex-col overflow-hidden bg-background/30 rounded-xl p-4 md:p-6 border border-border/40 min-h-0">

                <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden rounded-xl">
                    <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
                    <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[120px]" />
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragEnd={onDragEnd}
                >
                    <div className="flex h-full gap-6 overflow-x-auto pb-4">
                        <SortableContext items={columnsId} strategy={horizontalListSortingStrategy}>
                            {initialColumns.map((col) => (
                                <BoardColumn
                                    key={col.id}
                                    column={col}
                                    tasks={tasks.filter((task) => task.status === col.id)}
                                    onDeleteTask={deleteTask}
                                />
                            ))}
                        </SortableContext>
                    </div>

                    <DragOverlay dropAnimation={dropAnimation}>
                        {activeColumn && (
                            <BoardColumn
                                column={activeColumn}
                                tasks={tasks.filter((task) => task.status === activeColumn.id)}
                                onDeleteTask={deleteTask}
                                isOverlay
                            />
                        )}
                        {activeTask && <TaskCard task={activeTask} isOverlay onDelete={() => {}} />}
                    </DragOverlay>
                </DndContext>
            </div>

            <div className="px-2 shrink-0">
                <InertiaPagination data={paginatedTasks} />
            </div>
        </div>
    );
}

// --- Sub Components ---

interface BoardColumnProps {
    column: Column;
    tasks: Task[];
    isOverlay?: boolean;
    onDeleteTask: (id: number) => void;
}

function BoardColumn({ column, tasks, isOverlay, onDeleteTask }: BoardColumnProps) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: { type: "Column", column },
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group/column relative flex h-full w-[350px] min-w-[350px] flex-col overflow-hidden rounded-2xl border border-border/40 bg-background/50 backdrop-blur-xl shadow-sm",
                isDragging && "opacity-50",
                isOverlay && "rotate-2 scale-105 shadow-2xl cursor-grabbing bg-background/70"
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none opacity-0 group-hover/column:opacity-100 transition-opacity" />

            <div
                {...attributes}
                {...listeners}
                className="relative z-10 flex items-center justify-between border-b border-border/30 bg-background/30 p-4 backdrop-blur-sm cursor-grab active:cursor-grabbing"
            >
                <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary shadow-sm">
                        {tasks.length}
                    </div>
                    <h3 className="font-semibold text-foreground tracking-tight">{column.title}</h3>
                </div>
            </div>

            {/* FIX 3: Added custom scrollbar styles so overflowing tasks are neatly scrollable inside the column */}
            <div className="relative z-10 flex flex-1 flex-col gap-3 p-3 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-border/80 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                <SortableContext items={tasksIds} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
                    ))}
                </SortableContext>

                <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start gap-2 border border-dashed border-border/30 text-muted-foreground hover:text-foreground hover:bg-background/60 hover:border-border/50 backdrop-blur-sm h-10 shrink-0 mt-1"
                >
                    <Link href="/admin/tasks/create">
                        <Plus className="h-4 w-4" /> Add Task
                    </Link>
                </Button>
            </div>
        </div>
    );
}

interface TaskCardProps {
    task: Task;
    isOverlay?: boolean;
    onDelete: (id: number) => void;
}

function TaskCard({ task, isOverlay, onDelete }: TaskCardProps) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: { type: "Task", task },
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    const priorityColors: Record<string, string> = {
        low: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900",
        medium: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
        high: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900",
        urgent: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "group relative flex cursor-grab flex-col gap-3 overflow-hidden rounded-xl border border-border/40 bg-card/80 p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 active:cursor-grabbing shrink-0",
                isDragging && "opacity-30",
                isOverlay && "rotate-2 scale-105 shadow-2xl cursor-grabbing opacity-100 bg-background/90 backdrop-blur-xl z-50 ring-1 ring-primary/20"
            )}
        >
            <div className="relative z-10 flex items-start justify-between">

                <div className="flex flex-wrap gap-1.5 pr-6">
                    <Badge
                        variant="outline"
                        className={cn(
                            "border px-1.5 py-0.5 text-[10px] uppercase tracking-wider backdrop-blur-sm",
                            priorityColors[task.priority] || priorityColors.medium
                        )}
                    >
                        {task.priority}
                    </Badge>

                    <Badge variant="outline" className="border px-1.5 py-0.5 text-[10px] uppercase tracking-wider backdrop-blur-sm bg-muted/50 text-muted-foreground">
                        {task.type || 'task'}
                    </Badge>

                    {task.project && (
                        <Badge
                            variant="secondary"
                            className="bg-secondary/50 text-secondary-foreground/80 px-1.5 py-0.5 text-[10px] backdrop-blur-sm truncate max-w-[100px]"
                        >
                            {task.project.name}
                        </Badge>
                    )}

                    {task.sprint && (
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200/50 px-1.5 py-0.5 text-[10px] backdrop-blur-sm truncate max-w-[100px]">
                            {task.sprint.name}
                        </Badge>
                    )}
                </div>

                <div
                    className="absolute top-0 right-0 opacity-0 transition-opacity group-hover:opacity-100"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/tasks/${task.id}/edit`}>
                                    <Edit className="mr-2 h-3.5 w-3.5" /> Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DeleteDialog
                                title="Delete Task"
                                description="Are you sure?"
                                onConfirm={() => onDelete(task.id)}
                            >
                                <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-red-600 focus:bg-red-50 focus:text-red-700">
                                    <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                                </div>
                            </DeleteDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <p className="relative z-10 text-sm font-medium text-foreground leading-snug line-clamp-2">
                {task.title}
            </p>

            <div className="relative z-10 flex items-center justify-between pt-2 border-t border-border/30">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}</span>
                    </div>
                    {task.estimated_hours && (
                        <div className="flex items-center gap-1 font-medium">
                            <Clock className="h-3 w-3" />
                            <span>{task.estimated_hours}h</span>
                        </div>
                    )}
                </div>

                {task.assignee ? (
                    <div className="flex items-center gap-2" title={task.assignee.name}>
                        <Avatar className="h-6 w-6 border border-background">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${task.assignee.name}&background=random`} />
                            <AvatarFallback className="text-[9px]">
                                {task.assignee.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                ) : (
                    <div className="h-6 w-6 rounded-full border border-dashed border-border flex items-center justify-center">
                        <span className="text-[10px] text-muted-foreground">?</span>
                    </div>
                )}
            </div>
        </div>
    );
}
