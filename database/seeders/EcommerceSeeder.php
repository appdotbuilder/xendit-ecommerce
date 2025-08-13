<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Coupon;
use App\Models\User;
use Illuminate\Database\Seeder;

class EcommerceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create brands
        $brands = Brand::factory()->count(10)->create();
        
        // Create categories
        $categories = Category::factory()->count(8)->create();
        
        // Create products
        $products = collect();
        
        // Create regular products
        foreach ($categories as $category) {
            $categoryProducts = Product::factory()
                ->count(random_int(5, 12))
                ->create([
                    'category_id' => $category->id,
                    'brand_id' => $brands->random()->id,
                ]);
            $products = $products->concat($categoryProducts);
        }
        
        // Create some featured products
        $products->random(8)->each(function ($product) {
            $product->update(['is_featured' => true]);
        });
        
        // Create some digital products
        Product::factory()
            ->digital()
            ->count(5)
            ->create([
                'category_id' => $categories->random()->id,
                'brand_id' => $brands->random()->id,
            ]);
        
        // Create some products on sale
        $products->random(15)->each(function ($product) {
            $salePrice = $product->price * (random_int(50, 90) / 100);
            $product->update(['sale_price' => $salePrice]);
        });
        
        // Create coupons
        $coupons = Coupon::factory()->count(10)->create();
        
        // Attach some products to coupons
        $coupons->each(function ($coupon) use ($products) {
            $couponProducts = $products->random(random_int(3, 8));
            $coupon->products()->attach($couponProducts->pluck('id'));
        });
        
        // Create some additional users for testing
        User::factory()->count(5)->create();
    }
}