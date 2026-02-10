import InertiaPagination from '@/components/inertia-pagination';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    closestCorners,
    defaultDropAnimationSideEffects,
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    DropAnimation,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { router } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const initialColumns = [
    { id: 'todo', title: 'To Do' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'done', title: 'Done' },
];

export default function UserTasksKanban({ tasks: paginatedTasks }: any) {
    const [tasks, setTasks] = useState(paginatedTasks.data);
    const [activeColumn, setActiveColumn] = useState<any>(null);
    const [activeTask, setActiveTask] = useState<any>(null);

    useEffect(() => {
        setTasks(paginatedTasks.data);
    }, [paginatedTasks.data]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const columnsId = useMemo(() => initialColumns.map((col) => col.id), []);

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === 'Column')
            setActiveColumn(event.active.data.current.column);
        if (event.active.data.current?.type === 'Task')
            setActiveTask(event.active.data.current.task);
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;
        const activeId = active.id;
        const overId = over.id;
        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === 'Task';
        const isOverTask = over.data.current?.type === 'Task';
        const isOverColumn = over.data.current?.type === 'Column';

        if (isActiveTask && isOverTask) {
            setTasks((tasks: any) => {
                const activeIndex = tasks.findIndex(
                    (t: any) => t.id === activeId,
                );
                const overIndex = tasks.findIndex((t: any) => t.id === overId);
                if (tasks[activeIndex].status !== tasks[overIndex].status)
                    tasks[activeIndex].status = tasks[overIndex].status;
                return arrayMove(tasks, activeIndex, overIndex);
            });
        }
        if (isActiveTask && isOverColumn) {
            setTasks((tasks: any) => {
                const activeIndex = tasks.findIndex(
                    (t: any) => t.id === activeId,
                );
                tasks[activeIndex].status = overId;
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
        const activeTask = tasks.find((t: any) => t.id === activeId);

        if (activeTask) {
            // DIRECT ROUTE for USER Update
            router.put(
                `/user/tasks/${activeTask.id}`,
                { status: activeTask.status },
                {
                    preserveScroll: true,
                    onError: () => toast.error('Failed to update status.'),
                },
            );
        }
    }

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: '0.5' } },
        }),
    };

    return (
        <div className="flex h-full flex-col space-y-4">
            <div className="relative w-full flex-1 flex-col overflow-hidden rounded-xl border border-border/40 bg-slate-50/50 p-4 md:p-6 dark:bg-zinc-900/30">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragEnd={onDragEnd}
                >
                    <div className="flex h-full gap-6 overflow-x-auto pb-4">
                        <SortableContext
                            items={columnsId}
                            strategy={horizontalListSortingStrategy}
                        >
                            {initialColumns.map((col) => (
                                <BoardColumn
                                    key={col.id}
                                    column={col}
                                    tasks={tasks.filter(
                                        (task: any) => task.status === col.id,
                                    )}
                                />
                            ))}
                        </SortableContext>
                    </div>
                    <DragOverlay dropAnimation={dropAnimation}>
                        {activeColumn && (
                            <BoardColumn
                                column={activeColumn}
                                tasks={tasks.filter(
                                    (task: any) =>
                                        task.status === activeColumn.id,
                                )}
                                isOverlay
                            />
                        )}
                        {activeTask && <TaskCard task={activeTask} isOverlay />}
                    </DragOverlay>
                </DndContext>
            </div>
            <div className="px-2">
                <InertiaPagination data={paginatedTasks} />
            </div>
        </div>
    );
}

function BoardColumn({ column, tasks, isOverlay }: any) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: column.id, data: { type: 'Column', column } });
    const style = { transition, transform: CSS.Translate.toString(transform) };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'group/column relative flex h-full w-[350px] min-w-[350px] flex-col overflow-hidden rounded-2xl border border-border/40 bg-background/40 shadow-sm backdrop-blur-md',
                isDragging && 'opacity-50',
                isOverlay &&
                    'scale-105 rotate-2 cursor-grabbing bg-background/80 shadow-2xl',
            )}
        >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 transition-opacity group-hover/column:opacity-100" />
            <div
                {...attributes}
                {...listeners}
                className="relative z-10 flex cursor-grab items-center justify-between border-b border-border/30 bg-white/40 p-4 backdrop-blur-sm active:cursor-grabbing dark:bg-zinc-900/40"
            >
                <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary shadow-sm">
                        {tasks.length}
                    </div>
                    <h3 className="font-semibold tracking-tight text-foreground">
                        {column.title}
                    </h3>
                </div>
            </div>
            <div className="relative z-10 flex flex-1 flex-col gap-3 overflow-y-auto p-3">
                <SortableContext
                    items={tasks.map((t: any) => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {tasks.map((task: any) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}

function TaskCard({ task, isOverlay }: any) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id, data: { type: 'Task', task } });
    const style = { transition, transform: CSS.Translate.toString(transform) };

    const getPriorityColor = (p: string) => {
        const map: any = {
            low: 'bg-blue-500/10 text-blue-600 border-blue-200',
            medium: 'bg-amber-500/10 text-amber-600 border-amber-200',
            high: 'bg-red-500/10 text-red-600 border-red-200',
        };
        return map[p?.toLowerCase()] || map.low;
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                // FIX: Use 'bg-white dark:bg-zinc-900' (SOLID COLOR) to prevent the card looking "muddy" or "muted"
                'group relative flex cursor-grab flex-col gap-3 overflow-hidden rounded-xl border border-border/40 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md active:cursor-grabbing dark:bg-zinc-900',
                isDragging && 'opacity-30',
                isOverlay &&
                    'z-50 scale-105 rotate-2 cursor-grabbing bg-white opacity-100 shadow-2xl ring-1 ring-primary/20 dark:bg-zinc-900',
            )}
        >
            <div className="relative z-10 flex items-start justify-between">
                <div className="flex flex-wrap gap-1.5">
                    <Badge
                        variant="outline"
                        className={cn(
                            'border px-1.5 py-0.5 text-[10px] tracking-wider uppercase',
                            getPriorityColor(task.priority),
                        )}
                    >
                        {task.priority}
                    </Badge>
                    {task.project && (
                        <Badge
                            variant="secondary"
                            className="max-w-[100px] truncate bg-secondary/50 px-1.5 py-0.5 text-[10px] text-secondary-foreground/80"
                        >
                            {task.project.name}
                        </Badge>
                    )}
                </div>
            </div>
            <p className="relative z-10 line-clamp-2 text-sm leading-snug font-medium text-foreground">
                {task.title}
            </p>
            <div className="relative z-10 flex items-center justify-between border-t border-border/30 pt-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                            {task.created_at
                                ? new Date(task.created_at).toLocaleDateString()
                                : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
