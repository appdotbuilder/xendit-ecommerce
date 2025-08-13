<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Order>
     */
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 50, 1000);
        $taxAmount = $subtotal * 0.1; // 10% tax
        $shippingAmount = fake()->randomFloat(2, 5, 25);
        $discountAmount = fake()->boolean(30) ? fake()->randomFloat(2, 0, $subtotal * 0.2) : 0;
        $total = $subtotal + $taxAmount + $shippingAmount - $discountAmount;
        
        return [
            'order_number' => Order::generateOrderNumber(),
            'user_id' => User::factory(),
            'status' => fake()->randomElement(['pending', 'processing', 'shipped', 'delivered']),
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'shipping_amount' => $shippingAmount,
            'discount_amount' => $discountAmount,
            'total' => $total,
            'currency' => 'IDR',
            'payment_status' => fake()->randomElement(['pending', 'paid', 'failed']),
            'payment_method' => fake()->randomElement(['credit_card', 'bank_transfer', 'e_wallet']),
            'xendit_invoice_id' => 'inv_' . fake()->uuid(),
            'billing_address' => [
                'first_name' => fake()->firstName(),
                'last_name' => fake()->lastName(),
                'company' => fake()->company(),
                'address_1' => fake()->streetAddress(),
                'address_2' => fake()->optional()->streetAddress(),
                'city' => fake()->city(),
                'state' => fake()->city(),
                'postcode' => fake()->postcode(),
                'country' => 'ID',
                'email' => fake()->safeEmail(),
                'phone' => fake()->phoneNumber(),
            ],
            'shipping_address' => [
                'first_name' => fake()->firstName(),
                'last_name' => fake()->lastName(),
                'company' => fake()->company(),
                'address_1' => fake()->streetAddress(),
                'address_2' => fake()->optional()->streetAddress(),
                'city' => fake()->city(),
                'state' => fake()->city(),
                'postcode' => fake()->postcode(),
                'country' => 'ID',
            ],
            'notes' => fake()->boolean(20) ? fake()->sentence() : null,
            'shipped_at' => null,
            'delivered_at' => null,
        ];
    }

    /**
     * Indicate that the order is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'delivered',
            'payment_status' => 'paid',
            'shipped_at' => now()->subDays(fake()->numberBetween(3, 10)),
            'delivered_at' => now()->subDays(fake()->numberBetween(1, 5)),
        ]);
    }

    /**
     * Indicate that the order is pending payment.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'payment_status' => 'pending',
        ]);
    }
}