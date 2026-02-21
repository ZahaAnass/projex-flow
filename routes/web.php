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
use App\Http\Controllers\TeamLeader\TeamProjectController;
use App\Http\Controllers\TeamLeader\TeamTaskController;
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
            'team_leader' => redirect()->route('team.dashboard'),
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
    Route::middleware('role:team_leader')->prefix('team')->name('team.')->group(function () {
        Route::get('/dashboard', [TeamProjectController::class, 'dashboard'])->name('dashboard');
        Route::get('/projects', [TeamProjectController::class, 'index'])->name('projects.index');
        Route::get('/projects/{project}', [TeamProjectController::class, 'show'])->name('projects.show');
        Route::resource('tasks', TeamTaskController::class);
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

require __DIR__.'/settings.php';
