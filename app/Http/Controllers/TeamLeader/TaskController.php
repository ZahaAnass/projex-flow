<?php

namespace App\Http\Controllers\TeamLeader;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Sprint;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    private function getMyProjectIds() {
        return Project::where('owner_id', auth()->id())->pluck('id');
    }

    public function index(Request $request)
    {
        $query = Task::whereIn('project_id', $this->getMyProjectIds())->with(['project', 'assignee', 'sprint']);

        if ($request->search) $query->where('title', 'like', '%'.$request->search.'%');
        if ($request->status && $request->status !== 'all') $query->where('status', $request->status);
        if ($request->priority && $request->priority !== 'all') $query->where('priority', $request->priority);

        return Inertia::render('TeamLeader/Tasks/Index', [
            'tasks' => $query->latest()->paginate(15)->withQueryString(),
            'filters' => $request->only(['search', 'status', 'priority']),
        ]);
    }

    public function create()
    {
        $myProjects = $this->getMyProjectIds();
        return Inertia::render('TeamLeader/Tasks/Create', [
            'projects' => Project::whereIn('id', $myProjects)->select('id', 'name')->get(),
            'sprints' => Sprint::whereIn('project_id', $myProjects)->where('status', '!=', 'completed')->get(),
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

        return redirect()->route('leader.tasks.index')->with('success', 'Task created.');
    }

    public function edit(Task $task)
    {
        $myProjects = $this->getMyProjectIds();
        abort_if(!in_array($task->project_id, $myProjects->toArray()), 403);

        return Inertia::render('TeamLeader/Tasks/Edit', [
            'task' => $task,
            'projects' => Project::whereIn('id', $myProjects)->select('id', 'name')->get(),
            'sprints' => Sprint::whereIn('project_id', $myProjects)->where('status', '!=', 'completed')->get(),
            'users' => User::role(['team_leader', 'user'])->select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, Task $task)
    {
        abort_if(!in_array($task->project_id, $this->getMyProjectIds()->toArray()), 403);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'sometimes|required|exists:projects,id',
            'sprint_id' => 'nullable|exists:sprints,id',
            'assigned_to' => 'nullable|exists:users,id',
            'priority' => 'sometimes|required|in:low,medium,high,urgent',
            'type' => 'sometimes|required|in:task,bug,story',
            'status' => 'sometimes|required|in:todo,in_progress,review,done',
            'estimated_hours' => 'nullable|integer|min:0',
            'due_date' => 'nullable|date',
        ]);

        $task->update($validated);

        if (str_contains(url()->previous(), '/edit')) {
            return redirect()->route('leader.tasks.index')->with('success', 'Task updated successfully.');
        }

        return back()->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task)
    {
        abort_if(!in_array($task->project_id, $this->getMyProjectIds()->toArray()), 403);
        $task->delete();
        return back()->with('success', 'Task deleted.');
    }
}
