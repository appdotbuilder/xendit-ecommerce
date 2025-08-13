<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page with featured products.
     */
    public function index()
    {
        // Get featured products
        $featuredProducts = Product::with(['category', 'brand'])
            ->where('is_active', true)
            ->where('is_featured', true)
            ->limit(8)
            ->get();

        // Get latest products
        $latestProducts = Product::with(['category', 'brand'])
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->limit(8)
            ->get();

        // Get products on sale
        $saleProducts = Product::with(['category', 'brand'])
            ->where('is_active', true)
            ->whereNotNull('sale_price')
            ->limit(6)
            ->get();

        // Get categories for navigation
        $categories = Category::where('is_active', true)
            ->limit(8)
            ->get();

        // Get popular brands
        $brands = Brand::where('is_active', true)
            ->limit(6)
            ->get();

        return Inertia::render('home/index', [
            'featuredProducts' => $featuredProducts,
            'latestProducts' => $latestProducts,
            'saleProducts' => $saleProducts,
            'categories' => $categories,
            'brands' => $brands
        ]);
    }
}