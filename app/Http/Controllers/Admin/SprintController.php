<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Sprint;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SprintController extends Controller
{
    public function index(Request $request)
    {
        $query = Sprint::query()->with('project');

        return Inertia::render('Admin/Sprints/Index', [
            'sprints' => $query->latest()->paginate(10),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'project_id' => 'required|exists:projects,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        Sprint::create($validated);
        return back()->with('success', 'Sprint created.');
    }
}
