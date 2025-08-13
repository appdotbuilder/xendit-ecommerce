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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('short_description')->nullable();
            $table->string('sku')->unique();
            $table->decimal('price', 10, 2);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->boolean('manage_stock')->default(true);
            $table->enum('stock_status', ['instock', 'outofstock', 'onbackorder'])->default('instock');
            $table->enum('type', ['physical', 'digital'])->default('physical');
            $table->json('images')->nullable();
            $table->string('digital_file')->nullable();
            $table->decimal('weight', 8, 2)->nullable();
            $table->string('dimensions')->nullable();
            $table->foreignId('brand_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->json('meta_data')->nullable();
            $table->timestamps();
            
            $table->index('slug');
            $table->index('sku');
            $table->index('type');
            $table->index('is_featured');
            $table->index('is_active');
            $table->index(['category_id', 'is_active']);
            $table->index(['brand_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};