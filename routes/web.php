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
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Admin Controllers
// Kept as is if shared

// Other Roles

Route::get('/', function () {
    return Inertia::render('welcome', ['canRegister' => Features::enabled(Features::registration())]);
})->name('home');

Route::middleware(['auth'])->group(function () {

    // Global Dashboard Redirection
    Route::get('/dashboard', function () {
        $role = auth()->user()->getRoleNames()->first();
        return match($role) {
            'admin' => redirect()->route('admin.dashboard'),
            'team_leader' => redirect()->route('leader.dashboard'),
            'client' => redirect()->route('client.dashboard'),
            default => redirect()->route('users.dashboard'),
        };
    })->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | ADMIN ROUTES
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::resource('users', UserController::class);
        Route::resource('projects', ProjectController::class);
        Route::resource('tasks', TaskController::class);

        // Professional Features
        Route::resource('sprints', SprintController::class);
        Route::get('/time-entries', [TimeEntryController::class, 'index'])->name('time-entries.index');
        Route::get('/activities', [ActivityLogController::class, 'index'])->name('activities.index');
        Route::get('/roles', [RoleController::class, 'index'])->name('roles');
    });

    /*
    |--------------------------------------------------------------------------
    | TEAM LEADER ROUTES
    |--------------------------------------------------------------------------
    */
    Route::middleware(['auth', 'role:team_leader'])->prefix('leader')->name('leader.')->group(function () {
        Route::get('/dashboard', [TeamLeaderDashboardController::class, 'index'])->name('dashboard');

        // The Scoped Resource Routes
        Route::resource('projects', TeamLeaderProjectController::class);
        Route::resource('sprints', TeamLeaderSprintController::class);
        Route::resource('tasks', TeamLeaderTaskController::class);

        Route::get('/time-entries', [TeamLeaderTimeEntryController::class, 'index'])->name('time-entries.index');

    });

    /*
    |--------------------------------------------------------------------------
    | USER ROUTES
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:user')->prefix('users')->name('users.')->group(function () {
        Route::get('/dashboard', [UsersDashboardController::class, 'index'])->name('dashboard');
        Route::get('/tasks', [UsersTaskController::class, 'index'])->name('tasks.index');
        Route::put('/tasks/{task}', [UsersTaskController::class, 'update'])->name('tasks.update');
    });

    /*
    |--------------------------------------------------------------------------
    | CLIENT ROUTES
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:client')->prefix('client')->name('client.')->group(function () {
        Route::get('/dashboard', [ClientProjectController::class, 'dashboard'])->name('dashboard');
        Route::get('/projects', [ClientProjectController::class, 'index'])->name('projects.index');
        Route::get('/projects/{project}', [ClientProjectController::class, 'show'])->name('projects.show');
    });
});

require __DIR__ . '/settings.php';
