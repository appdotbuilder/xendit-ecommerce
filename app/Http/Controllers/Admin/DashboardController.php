<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use App\Models\Category;
use App\Models\Brand;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        // Get statistics
        $stats = [
            'total_products' => Product::count(),
            'total_orders' => Order::count(),
            'total_customers' => User::count(),
            'total_categories' => Category::count(),
            'total_brands' => Brand::count(),
            'total_revenue' => Order::where('payment_status', 'paid')->sum('total'),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'low_stock_products' => Product::where('manage_stock', true)
                ->where('stock_quantity', '<=', 5)
                ->count(),
        ];

        // Recent orders
        $recentOrders = Order::with(['user', 'items'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Top selling products
        $topProducts = Product::select(['products.*', DB::raw('SUM(order_items.quantity) as total_sold')])
            ->join('order_items', 'products.id', '=', 'order_items.product_id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.payment_status', 'paid')
            ->groupBy('products.id')
            ->orderBy('total_sold', 'desc')
            ->limit(5)
            ->get();

        // Monthly sales data
        $monthlySales = Order::select([
                DB::raw('MONTH(created_at) as month'),
                DB::raw('YEAR(created_at) as year'),
                DB::raw('SUM(total) as total_sales'),
                DB::raw('COUNT(*) as total_orders')
            ])
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', now()->subYear())
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->limit(12)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
            'monthlySales' => $monthlySales
        ]);
    }
}