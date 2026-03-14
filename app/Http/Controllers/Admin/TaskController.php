<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Sprint;
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
            'tasks' => $query->latest()->paginate(15)->withQueryString(),
            'filters' => $request->only(['search', 'status', 'priority']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Tasks/Create', [
            'projects' => Project::select('id', 'name')->get(),
            'sprints' => Sprint::select('id', 'name', 'project_id')->where('status', '!=', 'completed')->get(),
            'users' => User::role(['team_leader', 'user'])->select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'sprint_id' => 'nullable|exists:sprints,id',
            'assigned_to' => 'nullable|exists:users,id',
            'priority' => 'required|in:low,medium,high,urgent',
            'type' => 'required|in:task,bug,story',
            'status' => 'required|in:todo,in_progress,review,done',
            'estimated_hours' => 'nullable|integer|min:0',
            'due_date' => 'nullable|date',
        ]);

        $validated['created_by'] = auth()->id();

        Task::create($validated);
        return redirect()->route('admin.tasks.index')->with('success', 'Task created successfully.');
    }

    public function edit(Task $task)
    {
        return Inertia::render('Admin/Tasks/Edit', [
            'task' => $task,
            'projects' => Project::select('id', 'name')->get(),
            'sprints' => Sprint::select('id', 'name', 'project_id')->where('status', '!=', 'completed')->get(),
            'users' => User::role(['team_leader', 'user'])->select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'sprint_id' => 'nullable|exists:sprints,id',
            'assigned_to' => 'nullable|exists:users,id',
            'priority' => 'required|in:low,medium,high,urgent',
            'type' => 'required|in:task,bug,story',
            'status' => 'required|in:todo,in_progress,review,done',
            'estimated_hours' => 'nullable|integer|min:0',
            'due_date' => 'nullable|date',
        ]);

        $task->update($validated);
        return redirect()->route('admin.tasks.index')->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return back()->with('success', 'Task deleted.');
    }

    public function exportPdf(Request $request)
    {
        $query = Task::query()->with(['project', 'assignee', 'sprint']);

        if ($request->search) $query->where('title', 'like', '%'.$request->search.'%');
        if ($request->status && $request->status !== 'all') $query->where('status', $request->status);
        if ($request->priority && $request->priority !== 'all') $query->where('priority', $request->priority);

        $tasks = $query->latest()->get();

        $pdf = Pdf::loadView('pdf.tasks', ['tasks' => $tasks]);

        return $pdf->download('tasks-report.pdf');
    }
}
