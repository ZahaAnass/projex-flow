<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TimeEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TimeEntryController extends Controller
{
    public function index(Request $request)
    {
        // Eager load the user and the task (along with the task's project)
        $query = TimeEntry::query()->with(['user:id,name', 'task.project:id,name']);

        if ($request->search) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('task', function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Admin/TimeEntries/Index', [
            'entries' => $query->latest('date')->latest('id')->paginate(15)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }
}
