<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
// Controllers
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\User\UserTaskController;
use App\Http\Controllers\User\UserDashboardController;
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

        // Auth as admin
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Manage users
        Route::resource('users', UserController::class);

        // Manage projects
        Route::resource('projects', ProjectController::class);

        // Manage all tasks
        Route::resource('tasks', TaskController::class);

        // Manage roles
        Route::get('/roles', [RoleController::class, 'index'])->name('roles');
    });

    /*
    |--------------------------------------------------------------------------
    | TEAM LEADER ROUTES
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:team_leader')->prefix('team')->name('team.')->group(function () {

        // Dashboard
        Route::get('/dashboard', [TeamProjectController::class, 'dashboard'])->name('dashboard');

        // Projects (Read Only / View)
        Route::get('/projects', [TeamProjectController::class, 'index'])->name('projects.index');
        Route::get('/projects/{project}', [TeamProjectController::class, 'show'])->name('projects.show');

        // Tasks (Full CRUD)
        Route::get('/tasks', [TeamTaskController::class, 'index'])->name('tasks.index');
        Route::get('/tasks/create', [TeamTaskController::class, 'create'])->name('tasks.create');
        Route::post('/tasks', [TeamTaskController::class, 'store'])->name('tasks.store');
        Route::get('/tasks/{task}/edit', [TeamTaskController::class, 'edit'])->name('tasks.edit');
        Route::put('/tasks/{task}', [TeamTaskController::class, 'update'])->name('tasks.update');
        Route::delete('/tasks/{task}', [TeamTaskController::class, 'destroy'])->name('tasks.destroy');

    });

    /*
    |--------------------------------------------------------------------------
    | USER (MEMBER) ROUTES
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:user')->prefix('user')->name('user.')->group(function () {

        // CHANGE: Point to a controller instead of redirecting
        Route::get('/dashboard', [UserDashboardController::class, 'index'])
            ->name('dashboard');

        // My Tasks
        Route::get('/tasks', [UserTaskController::class, 'index'])->name('tasks.index');
        Route::put('/tasks/{task}', [UserTaskController::class, 'update'])->name('tasks.update'); // For Kanban Move
    });

    /*
    |--------------------------------------------------------------------------
    | CLIENT ROUTES
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:client')->prefix('client')->name('client.')->group(function () {

        // Dashboard
        Route::get('/dashboard', [ClientProjectController::class, 'dashboard'])
            ->name('dashboard');

        // Projects (List & Detail)
        Route::get('/projects', [ClientProjectController::class, 'index'])
            ->name('projects.index');

        Route::get('/projects/{project}', [ClientProjectController::class, 'show'])
            ->name('projects.show');
    });
});


require __DIR__.'/settings.php';
