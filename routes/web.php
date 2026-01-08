<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
// Controllers
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TeamLeader\TeamProjectController;
use App\Http\Controllers\TeamLeader\TeamTaskController;
use App\Http\Controllers\Client\ClientProjectController;

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

/*
|--------------------------------------------------------------------------
| AUTHENTICATED
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD (ALL ROLES)
    |--------------------------------------------------------------------------
    */
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | ADMIN ROUTES
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {

        // Auth as admin (logical separation)
        Route::get('/dashboard', fn () =>
        Inertia::render('Admin/Dashboard')
        )->name('dashboard');

        // Manage users
        Route::resource('users', UserController::class);

        // Manage projects
        Route::resource('projects', ProjectController::class);

        // Manage all tasks
        Route::resource('tasks', TaskController::class);

        // Manage roles (simple)
        Route::get('/roles', fn () =>
        Inertia::render('Admin/Roles')
        )->name('roles');
    });

    /*
    |--------------------------------------------------------------------------
    | TEAM LEADER ROUTES
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:team_leader')->prefix('team')->name('team.')->group(function () {

        // Team leader dashboard
        Route::get('/dashboard', fn () =>
        Inertia::render('TeamLeader/Dashboard')
        )->name('dashboard');

        // Manage team projects
        Route::get('/projects', [TeamProjectController::class, 'index'])
            ->name('projects.index');

        // View project
        Route::get('/projects/{project}', [TeamProjectController::class, 'show'])
            ->name('projects.show');

        // Assign tasks to members
        Route::post('/tasks', [TeamTaskController::class, 'store'])
            ->name('tasks.store');

        // Monitor progress
        Route::get('/tasks', [TeamTaskController::class, 'index'])
            ->name('tasks.index');

    });

    /*
    |--------------------------------------------------------------------------
    | USER ROUTES
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:user')->prefix('user')->name('user.')->group(function () {

        // View assigned tasks
        Route::get('/tasks', [TaskController::class, 'myTasks'])
            ->name('tasks.index');

        // Update task status
        Route::patch('/tasks/{task}', [TaskController::class, 'updateStatus'])
            ->name('tasks.update');
    });

    /*
    |--------------------------------------------------------------------------
    | CLIENT ROUTES
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:client')->prefix('client')->name('client.')->group(function () {

        // View projects
        Route::get('/projects', [ClientProjectController::class, 'index'])
            ->name('projects.index');

        // View project progress
        Route::get('/projects/{project}', [ClientProjectController::class, 'show'])
            ->name('projects.show');

    });
});


require __DIR__.'/settings.php';
