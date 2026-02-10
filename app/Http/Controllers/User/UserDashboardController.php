<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserDashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        return Inertia::render('User/Dashboard', [
            'stats' => [
                'total_tasks' => Task::where('assigned_to', $userId)->count(),
                'pending_tasks' => Task::where('assigned_to', $userId)->whereIn('status', ['todo', 'in_progress', 'review'])->count(),
                'completed_tasks' => Task::where('assigned_to', $userId)->where('status', 'done')->count(),
                'high_priority' => Task::where('assigned_to', $userId)->where('priority', 'high')->where('status', '!=', 'done')->count(),
            ],
            'recent_tasks' => Task::with('project')
                ->where('assigned_to', $userId)
                ->latest()
                ->take(5)
                ->get()
        ]);
    }
}
