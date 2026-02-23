<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        // SCOPE: Strictly tasks assigned to the logged-in user!
        $query = Task::where('assigned_to', auth()->id())->with(['project', 'sprint']);

        if ($request->search) $query->where('title', 'like', '%'.$request->search.'%');
        if ($request->status && $request->status !== 'all') $query->where('status', $request->status);
        if ($request->priority && $request->priority !== 'all') $query->where('priority', $request->priority);

        return Inertia::render('User/Tasks/Index', [
            'tasks' => $query->latest()->paginate(15)->withQueryString(),
            'filters' => $request->only(['search', 'status', 'priority']),
        ]);
    }

    public function update(Request $request, Task $task)
    {
        // SECURITY: Ensure the user is only updating a task actually assigned to them
        abort_if($task->assigned_to !== auth()->id(), 403, 'You can only update your own tasks.');

        // Users are usually only allowed to change the status (moving it across the Kanban board)
        $validated = $request->validate([
            'status' => 'required|in:todo,in_progress,review,done',
        ]);

        $task->update($validated);

        return back()->with('success', 'Task status updated.');
    }
}
