<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTaskRequest;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::query()->with(['project', 'assignee', 'sprint']);

        if ($request->search) $query->where('title', 'like', '%'.$request->search.'%');
        if ($request->status && $request->status !== 'all') $query->where('status', $request->status);
        if ($request->priority && $request->priority !== 'all') $query->where('priority', $request->priority);

        return Inertia::render('Admin/Tasks/Index', [
            'tasks' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'status', 'priority']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Tasks/Create', [
            'projects' => Project::select('id', 'name')->get(),
            'users' => User::role(['team_leader', 'user'])->select('id', 'name')->get(),
        ]);
    }

    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = auth()->id();

        Task::create($data);
        return redirect()->route('admin.tasks.index')->with('success', 'Task created.');
    }

    public function edit(Task $task)
    {
        return Inertia::render('Admin/Tasks/Edit', [
            'task' => $task,
            'projects' => Project::select('id', 'name')->get(),
            'users' => User::role(['team_leader', 'user'])->select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, Task $task)
    {
        $task->update($request->all()); // Use FormRequest in production
        return redirect()->route('admin.tasks.index')->with('success', 'Task updated.');
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return back()->with('success', 'Task deleted.');
    }
}
