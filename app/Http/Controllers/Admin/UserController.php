<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()->with('roles'); // Eager load roles

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('email', 'like', '%'.$request->search.'%');
            });
        }

        if ($request->role && $request->role !== 'all') {
            $query->role($request->role); // Spatie Scope
        }

        return Inertia::render('Admin/Users/Index', [
            'users' => $query->latest()->paginate(10)->through(fn($user) => [
                'id' => $user->id,
                'uuid' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'role' => $user->roles->first()?->name ?? 'user', // Get Spatie Role
                'created_at' => $user->created_at->format('Y-m-d'),
            ])->withQueryString(),
            'filters' => $request->only(['search', 'role']),
            'roles' => Role::pluck('name'), // Pass available roles for filter
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => Role::pluck('name'),
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'status' => 'active',
        ]);

        $user->assignRole($request->role); // Spatie Assign

        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user->load('roles'),
            'current_role' => $user->roles->first()?->name,
            'roles' => Role::pluck('name'),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        // Only take non-password fields
        $data = $request->only(['name', 'email', 'phone', 'status']);

        $user->update($data);
        $user->syncRoles([$request->role]); // Spatie Sync

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) return back()->with('error', 'Cannot delete yourself.');
        $user->delete();
        return back()->with('success', 'User deleted.');
    }
}
