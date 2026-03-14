<!DOCTYPE html>
<html>
<head>
    <title>Tasks Report</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f4f4f5; }
        .header { text-align: center; margin-bottom: 30px; }
        .badge { padding: 3px 6px; border-radius: 4px; font-size: 10px; text-transform: uppercase; }
    </style>
</head>
<body>
<div class="header">
    <h2>Tasks Report</h2>
    <p>Generated on: {{ now()->format('Y-m-d H:i') }}</p>
</div>

<table>
    <thead>
    <tr>
        <th>Title</th>
        <th>Project</th>
        <th>Status</th>
        <th>Priority</th>
        <th>Assignee</th>
    </tr>
    </thead>
    <tbody>
    @foreach($tasks as $task)
        <tr>
            <td>{{ $task->title }}</td>
            <td>{{ $task->project->name ?? 'N/A' }}</td>
            <td>{{ str_replace('_', ' ', $task->status) }}</td>
            <td>{{ $task->priority }}</td>
            <td>{{ $task->assignee->name ?? 'Unassigned' }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
