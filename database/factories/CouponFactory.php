<?php

namespace Database\Factories;

use App\Models\Coupon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Coupon>
 */
class CouponFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Coupon>
     */
    protected $model = Coupon::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['fixed', 'percentage']);
        
        return [
            'code' => Str::upper(fake()->lexify('??????')),
            'name' => fake()->words(3, true) . ' Discount',
            'description' => fake()->sentence(),
            'type' => $type,
            'value' => $type === 'fixed' ? fake()->randomFloat(2, 5, 100) : fake()->numberBetween(5, 50),
            'minimum_amount' => fake()->boolean(60) ? fake()->randomFloat(2, 50, 200) : null,
            'maximum_discount' => $type === 'percentage' && fake()->boolean(70) ? fake()->randomFloat(2, 20, 100) : null,
            'usage_limit' => fake()->boolean(80) ? fake()->numberBetween(10, 1000) : null,
            'usage_count' => 0,
            'usage_limit_per_user' => fake()->boolean(60) ? fake()->numberBetween(1, 5) : null,
            'starts_at' => fake()->boolean(70) ? now()->subDays(fake()->numberBetween(1, 30)) : null,
            'expires_at' => fake()->boolean(90) ? now()->addDays(fake()->numberBetween(7, 90)) : null,
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the coupon is expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => now()->subDays(fake()->numberBetween(1, 30)),
        ]);
    }

    /**
     * Indicate that the coupon is percentage-based.
     */
    public function percentage(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'percentage',
            'value' => fake()->numberBetween(5, 50),
            'maximum_discount' => fake()->randomFloat(2, 20, 100),
        ]);
    }

    /**
     * Indicate that the coupon is fixed amount.
     */
    public function fixed(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'fixed',
            'value' => fake()->randomFloat(2, 5, 100),
            'maximum_discount' => null,
        ]);
    }
}