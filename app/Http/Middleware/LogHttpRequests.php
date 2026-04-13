<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\RequestLog;
use Symfony\Component\HttpFoundation\Response;

class LogHttpRequests
{
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Record the start time
        $startTime = microtime(true);

        // 2. Let the application process the request
        $response = $next($request);

        // 3. Calculate how long it took
        $duration = round((microtime(true) - $startTime) * 1000, 2);

        // 4. Strip out sensitive data before saving the payload
        $payload = $request->except(['password', 'password_confirmation', '_token']);

        // 5. Save the log to the database
        // We use a try-catch so logging doesn't crash the app if the DB is busy
        try {
            RequestLog::create([
                'user_id' => auth()->id(),
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'payload' => empty($payload) ? null : json_encode($payload),
                'status_code' => $response->getStatusCode(),
                'duration_ms' => $duration,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        } catch (\Exception $e) {
            // Silently fail or use Laravel's standard Log::error() here
        }

        return $response;
    }
}
