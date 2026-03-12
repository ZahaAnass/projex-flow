<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TimeEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TimeEntryController extends Controller
{
    public function index(Request $request)
    {
        $query = TimeEntry::where('user_id', auth()->id())->with('task.project');

        if ($request->search) {
            $query->whereHas('task', function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%");
            });
        }

        return Inertia::render('User/TimeEntries/Index', [
            'entries' => $query->latest('date')->latest('id')->paginate(15)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('User/TimeEntries/Create', [
            'my_tasks' => Task::where('assigned_to', auth()->id())
                ->where('status', '!=', 'done')
                ->select('id', 'title')
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'date' => 'required|date|before_or_equal:today',
            'duration_minutes' => 'required|integer|min:1',
            'description' => 'nullable|string|max:500',
        ]);

        $task = Task::findOrFail($validated['task_id']);
        abort_if($task->assigned_to !== auth()->id(), 403, 'You can only log time for your own tasks.');

        $validated['user_id'] = auth()->id();
        TimeEntry::create($validated);

        return redirect()->route('user.time-entries.index')->with('success', 'Time logged successfully.');
    }

    public function destroy(TimeEntry $timeEntry)
    {
        abort_if($timeEntry->user_id !== auth()->id(), 403);
        $timeEntry->delete();
        return back()->with('success', 'Time log deleted.');
    }
}
