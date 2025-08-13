<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Display the checkout page.
     */
    public function index()
    {
        $cartItems = CartItem::with(['product.category', 'product.brand'])
            ->where('user_id', auth()->id())
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        $subtotal = $cartItems->sum(function ($item) {
            return $item->product->getCurrentPrice() * $item->quantity;
        });

        $taxRate = 0.1; // 10% tax
        $taxAmount = $subtotal * $taxRate;
        $shippingAmount = 15.00; // Fixed shipping for now
        $total = $subtotal + $taxAmount + $shippingAmount;

        return Inertia::render('checkout/index', [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
            'taxAmount' => $taxAmount,
            'shippingAmount' => $shippingAmount,
            'total' => $total,
            'user' => auth()->user()
        ]);
    }

    /**
     * Apply coupon to checkout.
     */
    public function show(Request $request)
    {
        $request->validate([
            'coupon_code' => 'required|string'
        ]);

        $coupon = Coupon::where('code', strtoupper($request->coupon_code))
            ->where('is_active', true)
            ->first();

        if (!$coupon || !$coupon->isValid()) {
            return back()->with('error', 'Invalid or expired coupon code.');
        }

        $cartItems = CartItem::with(['product'])
            ->where('user_id', auth()->id())
            ->get();

        $subtotal = $cartItems->sum(function ($item) {
            return $item->product->getCurrentPrice() * $item->quantity;
        });

        // Check if coupon applies to any products in cart
        if ($coupon->products()->exists()) {
            $applicableProducts = $cartItems->filter(function ($item) use ($coupon) {
                return $coupon->products()->where('products.id', $item->product_id)->exists();
            });

            if ($applicableProducts->isEmpty()) {
                return back()->with('error', 'This coupon is not applicable to any items in your cart.');
            }

            $applicableTotal = $applicableProducts->sum(function ($item) {
                return $item->product->getCurrentPrice() * $item->quantity;
            });
            
            $discountAmount = $coupon->calculateDiscount($applicableTotal);
        } else {
            $discountAmount = $coupon->calculateDiscount($subtotal);
        }

        $taxAmount = ($subtotal - $discountAmount) * 0.1;
        $shippingAmount = 15.00;
        $total = $subtotal + $taxAmount + $shippingAmount - $discountAmount;

        return back()->with([
            'coupon' => $coupon,
            'discountAmount' => $discountAmount,
            'newTotal' => $total
        ]);
    }

    /**
     * Process the order.
     */
    public function store(Request $request)
    {
        $request->validate([
            'billing_address' => 'required|array',
            'billing_address.first_name' => 'required|string|max:255',
            'billing_address.last_name' => 'required|string|max:255',
            'billing_address.email' => 'required|email',
            'billing_address.phone' => 'required|string|max:20',
            'billing_address.address_1' => 'required|string|max:255',
            'billing_address.city' => 'required|string|max:255',
            'billing_address.state' => 'required|string|max:255',
            'billing_address.postcode' => 'required|string|max:10',
            'billing_address.country' => 'required|string|max:2',
            'payment_method' => 'required|string',
            'coupon_code' => 'nullable|string'
        ]);

        $cartItems = CartItem::with(['product'])
            ->where('user_id', auth()->id())
            ->get();

        if ($cartItems->isEmpty()) {
            return back()->with('error', 'Your cart is empty.');
        }

        return DB::transaction(function () use ($request, $cartItems) {
            $subtotal = $cartItems->sum(function ($item) {
                return $item->product->getCurrentPrice() * $item->quantity;
            });

            $discountAmount = 0;
            $coupon = null;

            // Apply coupon if provided
            if ($request->coupon_code) {
                $coupon = Coupon::where('code', strtoupper($request->coupon_code))
                    ->where('is_active', true)
                    ->first();

                if ($coupon && $coupon->isValid()) {
                    if ($coupon->products()->exists()) {
                        $applicableProducts = $cartItems->filter(function ($item) use ($coupon) {
                            return $coupon->products()->where('products.id', $item->product_id)->exists();
                        });
                        
                        $applicableTotal = $applicableProducts->sum(function ($item) {
                            return $item->product->getCurrentPrice() * $item->quantity;
                        });
                        
                        $discountAmount = $coupon->calculateDiscount($applicableTotal);
                    } else {
                        $discountAmount = $coupon->calculateDiscount($subtotal);
                    }

                    $coupon->increment('usage_count');
                }
            }

            $taxAmount = ($subtotal - $discountAmount) * 0.1;
            $shippingAmount = 15.00;
            $total = $subtotal + $taxAmount + $shippingAmount - $discountAmount;

            // Create order
            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => auth()->id(),
                'status' => 'pending',
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'shipping_amount' => $shippingAmount,
                'discount_amount' => $discountAmount,
                'total' => $total,
                'currency' => 'IDR',
                'payment_status' => 'pending',
                'payment_method' => $request->payment_method,
                'billing_address' => $request->billing_address,
                'shipping_address' => $request->shipping_address ?? $request->billing_address,
                'notes' => $request->notes
            ]);

            // Create order items
            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'product_name' => $cartItem->product->name,
                    'product_sku' => $cartItem->product->sku,
                    'price' => $cartItem->product->getCurrentPrice(),
                    'quantity' => $cartItem->quantity,
                    'total' => $cartItem->product->getCurrentPrice() * $cartItem->quantity
                ]);

                // Update product stock
                if ($cartItem->product->manage_stock) {
                    $cartItem->product->decrement('stock_quantity', $cartItem->quantity);
                }
            }

            // Clear cart
            CartItem::where('user_id', auth()->id())->delete();

            return redirect()->route('orders.show', $order)
                ->with('success', 'Order placed successfully! We will process it shortly.');
        });
    }
}