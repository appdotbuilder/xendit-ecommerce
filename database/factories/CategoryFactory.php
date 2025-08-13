<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Category>
     */
    protected $model = Category::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            'Electronics', 'Clothing & Fashion', 'Home & Garden', 'Sports & Outdoors',
            'Health & Beauty', 'Books & Media', 'Toys & Games', 'Food & Beverages',
            'Automotive', 'Office Supplies', 'Pet Supplies', 'Digital Products'
        ];
        
        $name = fake()->randomElement($categories);
        
        return [
            'name' => $name,
            'slug' => Str::slug($name . '-' . fake()->randomNumber(3)),
            'description' => fake()->paragraph(),
            'image' => null,
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the category is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}