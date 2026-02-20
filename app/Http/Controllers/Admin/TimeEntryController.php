<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TimeEntry;
use Inertia\Inertia;

class TimeEntryController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/TimeEntries/Index', [
            'entries' => TimeEntry::with(['user', 'task.project'])
                ->latest()
                ->paginate(20),
        ]);
    }
}
