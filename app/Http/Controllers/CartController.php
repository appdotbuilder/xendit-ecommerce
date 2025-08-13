<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display the shopping cart.
     */
    public function index()
    {
        $cartItems = CartItem::with(['product.category', 'product.brand'])
            ->where('user_id', auth()->id())
            ->get();

        $total = $cartItems->sum(function ($item) {
            return $item->product->getCurrentPrice() * $item->quantity;
        });

        return Inertia::render('cart/index', [
            'cartItems' => $cartItems,
            'total' => $total
        ]);
    }

    /**
     * Add product to cart.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1|max:10'
        ]);

        $product = Product::findOrFail($request->product_id);

        if (!$product->is_active || !$product->isInStock()) {
            return back()->with('error', 'This product is not available.');
        }

        $cartItem = CartItem::where('user_id', auth()->id())
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $request->quantity;
            
            if ($product->manage_stock && $newQuantity > $product->stock_quantity) {
                return back()->with('error', 'Not enough stock available.');
            }
            
            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            if ($product->manage_stock && $request->quantity > $product->stock_quantity) {
                return back()->with('error', 'Not enough stock available.');
            }
            
            CartItem::create([
                'user_id' => auth()->id(),
                'product_id' => $product->id,
                'quantity' => $request->quantity
            ]);
        }

        return back()->with('success', 'Product added to cart successfully.');
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, CartItem $cartItem)
    {
        if ($cartItem->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1|max:10'
        ]);

        if ($cartItem->product->manage_stock && $request->quantity > $cartItem->product->stock_quantity) {
            return back()->with('error', 'Not enough stock available.');
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return back()->with('success', 'Cart updated successfully.');
    }

    /**
     * Remove cart item.
     */
    public function destroy(CartItem $cartItem)
    {
        if ($cartItem->user_id !== auth()->id()) {
            abort(403);
        }

        $cartItem->delete();

        return back()->with('success', 'Item removed from cart.');
    }
}