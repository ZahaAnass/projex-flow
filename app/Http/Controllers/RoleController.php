<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // specific descriptions for your simple role system
        $definitions = [
            'admin' => [
                'description' => 'Full access to all system resources, including user management and system settings.',
                'color' => 'bg-red-100 text-red-800',
                'permissions' => ['Manage Users', 'Manage All Projects', 'Delete Content', 'Assign Roles']
            ],
            'team_leader' => [
                'description' => 'Can manage assigned projects, create tasks, and view team progress.',
                'color' => 'bg-blue-100 text-blue-800',
                'permissions' => ['Create Projects', 'Assign Tasks', 'View Team Reports', 'Manage Sprints']
            ],
            'user' => [
                'description' => 'Standard access to view assigned tasks and update task status.',
                'color' => 'bg-green-100 text-green-800',
                'permissions' => ['View Assigned Tasks', 'Update Task Status', 'Comment on Tasks']
            ],
            'client' => [
                'description' => 'Read-only access to view specific project progress and deliverables.',
                'color' => 'bg-purple-100 text-purple-800',
                'permissions' => ['View Project Progress', 'View Deliverables']
            ]
        ];

        $stats = User::selectRaw('role, count(*) as count')
            ->groupBy('role')
            ->pluck('count', 'role')
            ->toArray();

        return Inertia::render('Admin/Roles/Index', [
            'definitions' => $definitions,
            'stats' => $stats
        ]);
    }
}
