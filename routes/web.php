<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');

// Authentication required routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Cart routes
    Route::controller(CartController::class)->prefix('cart')->name('cart.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::patch('/{cartItem}', 'update')->name('update');
        Route::delete('/{cartItem}', 'destroy')->name('destroy');
    });
    
    // Checkout routes
    Route::controller(CheckoutController::class)->prefix('checkout')->name('checkout.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/coupon', 'show')->name('coupon');
        Route::post('/', 'store')->name('store');
    });
    
    // Order routes
    Route::controller(OrderController::class)->prefix('orders')->name('orders.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{order}', 'show')->name('show');
    });
    
    // Admin routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';