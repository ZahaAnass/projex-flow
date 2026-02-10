<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Spatie\Permission\Traits\HasRoles; // Install spatie/laravel-permission for this

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes, HasUuids, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'status',
        'avatar_url',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Specify that 'uuid' is the unique identifier column for routes
    public function uniqueIds()
    {
        return ['uuid'];
    }

    // --- Relationships ---

    // Projects managed/owned by this user
    public function ownedProjects()
    {
        return $this->hasMany(Project::class, 'owner_id');
    }

    // Tasks assigned to this user to work on
    public function assignedTasks()
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    // Tasks created by this user
    public function createdTasks()
    {
        return $this->hasMany(Task::class, 'created_by');
    }

    // Time logs
    public function timeEntries()
    {
        return $this->hasMany(TimeEntry::class);
    }
}
