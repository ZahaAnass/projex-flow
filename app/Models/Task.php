<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Task extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $fillable = [
        'title',
        'description',
        'type',
        'priority',
        'status',
        'order',
        'due_date',
        'estimated_hours',
        'project_id',
        'sprint_id',
        'assigned_to',
        'created_by'
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    public function uniqueIds()
    {
        return ['uuid'];
    }

    // --- Relationships ---

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function sprint()
    {
        return $this->belongsTo(Sprint::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Many-to-Many Tags
    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'task_tag');
    }

    public function timeEntries()
    {
        return $this->hasMany(TimeEntry::class);
    }

    // Polymorphic Relations
    public function comments() : MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function attachments() : MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    public function activities() : MorphMany
    {
        return $this->morphMany(ActivityLog::class, 'subject');
    }
}
