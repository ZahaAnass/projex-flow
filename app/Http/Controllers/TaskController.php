<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\StoreTaskRequest;
use App\Http\Requests\Admin\UpdateTaskRequest;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Task::query()
            ->with(['project', 'assignee']); // Eager load relationships

        if ($request->search) {
            $query->where('title', 'like', '%'.$request->search.'%');
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->priority && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        return Inertia::render('Admin/Tasks/Index', [
            'tasks' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'status', 'priority']),
        ]);
    }

    /**
     * Show create form.
     */
    public function create()
    {
        return Inertia::render('Admin/Tasks/Create', [
            'projects' => Project::select('id', 'name')->get(),
            // Get users who can perform tasks (Leaders + Users)
            'users' => User::whereIn('role', ['team_leader', 'user'])->select('id', 'name')->get(),
        ]);
    }

    /**
     * Store new task.
     */
    public function store(StoreTaskRequest $request)
    {
        Task::create($request->validated());

        return redirect()->route('admin.tasks.index')
            ->with('success', 'Task created successfully.');
    }

    /**
     * Show edit form.
     */
    public function edit(Task $task)
    {
        return Inertia::render('Admin/Tasks/Edit', [
            'task' => $task,
            'projects' => Project::select('id', 'name')->get(),
            'users' => User::whereIn('role', ['team_leader', 'user'])->select('id', 'name')->get(),
        ]);
    }

    /**
     * Update task.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $task->update($request->validated());

        return redirect()->route('admin.tasks.index')
            ->with('success', 'Task updated successfully.');
    }

    /**
     * Delete task.
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return redirect()->back()->with('success', 'Task deleted successfully.');
    }
}
