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
        Schema::create('custom_post_form_submissions', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('category_id');
        $table->json('data');
        $table->timestamps();

        $table->foreign('category_id')->references('id')->on('post_categories')->onDelete('cascade');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_post_form_submissions');
    }
};
