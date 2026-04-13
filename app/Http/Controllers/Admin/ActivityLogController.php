<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RequestLog; // Changed to the new HTTP traffic model
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = RequestLog::query()->with('user:id,name');

        if ($request->search) {
            $search = $request->search;
            $query->where('url', 'like', "%{$search}%")
                ->orWhere('method', 'like', "%{$search}%")
                ->orWhereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
        }

        return Inertia::render('Admin/Activity/Index', [
            'activities' => $query->latest()->paginate(15)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }
}
