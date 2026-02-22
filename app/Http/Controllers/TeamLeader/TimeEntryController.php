<?php

namespace App\Http\Controllers\TeamLeader;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\TimeEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TimeEntryController extends Controller
{
    public function index(Request $request)
    {
        // SCOPE: Get the IDs of projects owned by this leader
        $myProjectIds = Project::where('owner_id', auth()->id())->pluck('id');

        // SCOPE: Only load Time Entries where the related Task belongs to the Leader's projects
        $query = TimeEntry::query()
            ->whereHas('task', function($q) use ($myProjectIds) {
                $q->whereIn('project_id', $myProjectIds);
            })
            ->with(['user:id,name', 'task.project:id,name']);

        // Search Filter (by User Name or Task Title)
        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->whereHas('user', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%");
                })->orWhereHas('task', function ($tq) use ($search) {
                    $tq->where('title', 'like', "%{$search}%");
                });
            });
        }

        return Inertia::render('TeamLeader/TimeEntries/Index', [
            'entries' => $query->latest('date')->latest('id')->paginate(15)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }
}
