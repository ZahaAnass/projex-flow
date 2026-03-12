<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SprintController;
use App\Http\Controllers\Admin\TaskController;
use App\Http\Controllers\Admin\TimeEntryController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Client\ClientProjectController;
use App\Http\Controllers\TeamLeader\ProjectController as TeamLeaderProjectController;
use App\Http\Controllers\TeamLeader\SprintController as TeamLeaderSprintController;
use App\Http\Controllers\TeamLeader\TaskController as TeamLeaderTaskController;
use App\Http\Controllers\TeamLeader\DashboardController as TeamLeaderDashboardController;
use App\Http\Controllers\TeamLeader\TimeEntryController as TeamLeaderTimeEntryController;
use App\Http\Controllers\User\DashboardController as UserDashboardController;
use App\Http\Controllers\User\TaskController as UserTaskController;
use App\Http\Controllers\User\TimeEntryController as UserTimeEntryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


Route::get('/', function () {
    return Inertia::render('welcome', ['canRegister' => Features::enabled(Features::registration())]);
})->name('home');

Route::get('/pricing', function () {
    return Inertia::render('Pricing');
})->name('pricing');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::middleware(['auth'])->group(function () {

    Route::get('/dashboard', function () {
        $role = auth()->user()->getRoleNames()->first();
        return match($role) {
            'admin' => redirect()->route('admin.dashboard'),
            'team_leader' => redirect()->route('leader.dashboard'),
            'client' => redirect()->route('client.dashboard'),
            default => redirect()->route('user.dashboard'),
        };
    })->name('dashboard');

    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::resource('users', UserController::class);
        Route::resource('projects', ProjectController::class);
        Route::resource('tasks', TaskController::class);

        Route::resource('sprints', SprintController::class);
        Route::get('/time-entries', [TimeEntryController::class, 'index'])->name('time-entries.index');
        Route::get('/activities', [ActivityLogController::class, 'index'])->name('activities.index');
        Route::get('/roles', [RoleController::class, 'index'])->name('roles');
    });

    Route::middleware(['auth', 'role:team_leader'])->prefix('leader')->name('leader.')->group(function () {
        Route::get('/dashboard', [TeamLeaderDashboardController::class, 'index'])->name('dashboard');

        Route::resource('projects', TeamLeaderProjectController::class);
        Route::resource('sprints', TeamLeaderSprintController::class);
        Route::resource('tasks', TeamLeaderTaskController::class);

        Route::get('/time-entries', [TeamLeaderTimeEntryController::class, 'index'])->name('time-entries.index');

    });

    Route::middleware(['auth', 'role:user'])->prefix('user')->name('user.')->group(function () {
        Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');

        Route::get('/tasks', [UserTaskController::class, 'index'])->name('tasks.index');
        Route::put('/tasks/{task}', [UserTaskController::class, 'update'])->name('tasks.update');

        Route::resource('time-entries', UserTimeEntryController::class)->except(['edit', 'show']);
    });

    Route::middleware('role:client')->prefix('client')->name('client.')->group(function () {
        Route::get('/dashboard', [ClientProjectController::class, 'dashboard'])->name('dashboard');
        Route::get('/projects', [ClientProjectController::class, 'index'])->name('projects.index');
        Route::get('/projects/{project}', [ClientProjectController::class, 'show'])->name('projects.show');
    });
});

require __DIR__ . '/settings.php';
