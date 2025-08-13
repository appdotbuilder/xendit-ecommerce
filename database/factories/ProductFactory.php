<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Product>
     */
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->words(random_int(2, 4), true);
        $price = fake()->randomFloat(2, 10, 1000);
        $onSale = fake()->boolean(30); // 30% chance of being on sale
        
        return [
            'name' => ucwords($name),
            'slug' => Str::slug($name . '-' . fake()->randomNumber(4)),
            'description' => fake()->paragraphs(3, true),
            'short_description' => fake()->sentence(),
            'sku' => 'SKU-' . fake()->unique()->numerify('######'),
            'price' => $price,
            'sale_price' => $onSale ? fake()->randomFloat(2, $price * 0.5, $price * 0.9) : null,
            'stock_quantity' => fake()->numberBetween(0, 100),
            'manage_stock' => true,
            'stock_status' => fake()->randomElement(['instock', 'outofstock', 'onbackorder']),
            'type' => fake()->randomElement(['physical', 'digital']),
            'images' => [
                'https://via.placeholder.com/400x400?text=Product+Image',
                'https://via.placeholder.com/400x400?text=Product+Image+2',
            ],
            'digital_file' => null,
            'weight' => fake()->randomFloat(2, 0.1, 10),
            'dimensions' => fake()->numerify('##') . 'x' . fake()->numerify('##') . 'x' . fake()->numerify('##') . ' cm',
            'brand_id' => Brand::factory(),
            'category_id' => Category::factory(),
            'is_featured' => fake()->boolean(20), // 20% chance of being featured
            'is_active' => true,
            'meta_data' => null,
        ];
    }

    /**
     * Indicate that the product is digital.
     */
    public function digital(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'digital',
            'digital_file' => 'digital-files/' . fake()->uuid() . '.pdf',
            'weight' => null,
            'dimensions' => null,
            'stock_status' => 'instock',
            'manage_stock' => false,
        ]);
    }

    /**
     * Indicate that the product is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the product is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 0,
            'stock_status' => 'outofstock',
        ]);
    }

    /**
     * Indicate that the product is on sale.
     */
    public function onSale(): static
    {
        return $this->state(function (array $attributes) {
            $price = $attributes['price'] ?? 100;
            return [
                'sale_price' => fake()->randomFloat(2, $price * 0.5, $price * 0.9),
            ];
        });
    }
}