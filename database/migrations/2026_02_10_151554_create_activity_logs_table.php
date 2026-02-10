<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();

            // Who performed the action?
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // What happened? (e.g., "created", "updated", "deleted", "status_change")
            $table->string('action');

            // Polymorphic: Which object was changed? (e.g., Project, Task #50)
            // This creates 'subject_type' and 'subject_id'
            $table->morphs('subject');

            // Audit Trail: What changed?
            $table->json('data_before')->nullable(); // donnees_avant
            $table->json('data_after')->nullable();  // donnees_apres

            // Metadata
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();

            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
