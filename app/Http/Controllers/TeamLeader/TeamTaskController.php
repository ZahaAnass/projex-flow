<?php

namespace App\Http\Controllers\TeamLeader;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class TeamTaskController extends Controller
{
    public function index(Request $request)
    {
        // If they want to see a list of ALL tasks across projects
        $query = Task::query()->with(['project', 'assignee']);

        if ($request->search) {
            $query->where('title', 'like', '%'.$request->search.'%');
        }

        return Inertia::render('TeamLeader/Tasks/Index', [
            'tasks' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'priority' => 'required|in:low,medium,high',
            'assigned_to' => 'nullable|exists:users,id',
            'description' => 'nullable|string'
        ]);

        Task::create([
            ...$validated,
            'status' => 'todo' // Default status
        ]);

        return redirect()->back()->with('success', 'Task assigned successfully.');
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'priority' => 'required|in:low,medium,high',
            'status' => 'required|in:todo,in_progress,review,done',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $task->update($validated);

        return redirect()->back()->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return redirect()->back()->with('success', 'Task removed.');
    }
}
