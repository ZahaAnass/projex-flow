<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TimeEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        $stats = [
            'pending_tasks' => Task::where('assigned_to', $userId)->whereIn('status', ['todo', 'in_progress'])->count(),
            'review_tasks' => Task::where('assigned_to', $userId)->where('status', 'review')->count(),
            'completed_tasks' => Task::where('assigned_to', $userId)->where('status', 'done')->count(),

            'hours_this_week' => round(TimeEntry::where('user_id', $userId)
                    ->whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
                    ->sum('duration_minutes') / 60, 1),
        ];

        $upcoming_deadlines = Task::where('assigned_to', $userId)
            ->whereNotIn('status', ['done'])
            ->whereNotNull('due_date')
            ->orderBy('due_date', 'asc')
            ->take(5)
            ->with('project:id,name')
            ->get(['id', 'title', 'due_date', 'priority', 'status', 'project_id']);

        $recent_logs = TimeEntry::where('user_id', $userId)
            ->with('task:id,title')
            ->latest('date')
            ->latest('id')
            ->take(5)
            ->get();

        return Inertia::render('User/Dashboard', [
            'stats' => $stats,
            'upcoming_deadlines' => $upcoming_deadlines,
            'recent_logs' => $recent_logs,
        ]);
    }
}
