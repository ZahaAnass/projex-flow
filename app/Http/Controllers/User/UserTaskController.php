<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserTaskController extends Controller
{
    /**
     * Display "My Tasks".
     */
    public function index(Request $request)
    {
        // 1. Fetch ONLY tasks assigned to the logged-in user
        $query = Task::query()
            ->with(['project', 'assignee'])
            ->where('assigned_to', auth()->id());

        // 2. Filters
        if ($request->search) {
            $query->where('title', 'like', '%'.$request->search.'%');
        }
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        if ($request->priority && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        return Inertia::render('User/Tasks/Index', [
            'tasks' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'status', 'priority']),
        ]);
    }

    /**
     * Update task status
     */
    public function update(Request $request, Task $task)
    {
        // Security: Ensure the user actually owns this task before letting them move it
        if ($task->assigned_to !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'status' => 'required|in:todo,in_progress,review,done',
        ]);

        $task->update($validated);

        return redirect()->back()->with('success', 'Task updated.');
    }
}
