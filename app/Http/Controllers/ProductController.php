<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand'])
            ->where('is_active', true);

        // Filter by category
        if ($request->has('category') && $request->category) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filter by brand
        if ($request->has('brand') && $request->brand) {
            $query->whereHas('brand', function ($q) use ($request) {
                $q->where('slug', $request->brand);
            });
        }

        // Search by name
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filter by type
        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        // Sort products
        $sort = $request->get('sort', 'created_at');
        $order = $request->get('order', 'desc');
        
        switch ($sort) {
            case 'name':
                $query->orderBy('name', $order);
                break;
            case 'price':
                $query->orderBy('price', $order);
                break;
            case 'created_at':
            default:
                $query->orderBy('created_at', $order);
                break;
        }

        $products = $query->paginate(12);
        $categories = Category::where('is_active', true)->get();
        $brands = Brand::where('is_active', true)->get();

        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'filters' => $request->only(['category', 'brand', 'search', 'type', 'sort', 'order'])
        ]);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product)
    {
        if (!$product->is_active) {
            abort(404);
        }

        $product->load(['category', 'brand']);
        
        // Get related products
        $relatedProducts = Product::with(['category', 'brand'])
            ->where('is_active', true)
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        return Inertia::render('products/show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts
        ]);
    }
}