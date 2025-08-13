import React, { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { router } from '@inertiajs/react';
import { Heart, ShoppingCart, Star, Plus, Minus, Share2, Truck, Shield, RotateCcw } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    short_description?: string;
    price: string;
    sale_price: string | null;
    images: string[];
    category: {
        id: number;
        name: string;
        slug: string;
    };
    brand?: {
        id: number;
        name: string;
        slug: string;
    };
    is_featured: boolean;
    stock_status: string;
    stock_quantity: number;
    manage_stock: boolean;
    type: string;
    weight?: string;
    dimensions?: string;
}

interface Props {
    product: Product;
    relatedProducts: Product[];
    [key: string]: unknown;
}

export default function ProductShow({ product, relatedProducts }: Props) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const discountPercentage = product.sale_price 
        ? Math.round(((parseFloat(product.price) - parseFloat(product.sale_price)) / parseFloat(product.price)) * 100)
        : 0;

    const currentPrice = product.sale_price ? parseFloat(product.sale_price) : parseFloat(product.price);
    const isOutOfStock = product.stock_status === 'outofstock';
    const maxQuantity = product.manage_stock ? Math.min(product.stock_quantity, 10) : 10;

    const handleAddToCart = () => {
        router.post(route('cart.store'), {
            product_id: product.id,
            quantity: quantity
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                // Optional: Show success message
            }
        });
    };

    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= maxQuantity) {
            setQuantity(newQuantity);
        }
    };

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
                        <button onClick={() => router.get(route('home'))} className="hover:text-gray-900">
                            Home
                        </button>
                        <span>/</span>
                        <button 
                            onClick={() => router.get(route('products.index'))} 
                            className="hover:text-gray-900"
                        >
                            Products
                        </button>
                        <span>/</span>
                        <button 
                            onClick={() => router.get(route('products.index', { category: product.category.slug }))} 
                            className="hover:text-gray-900"
                        >
                            {product.category.name}
                        </button>
                        <span>/</span>
                        <span className="text-gray-900">{product.name}</span>
                    </nav>

                    <div className="grid lg:grid-cols-2 gap-12 mb-16">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-white rounded-lg shadow-sm overflow-hidden">
                                <img
                                    src={product.images?.[selectedImageIndex] || 'https://via.placeholder.com/600x600?text=No+Image'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {product.images && product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                                                selectedImageIndex === index 
                                                    ? 'border-blue-500' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary">{product.category.name}</Badge>
                                    {product.brand && (
                                        <Badge variant="outline">{product.brand.name}</Badge>
                                    )}
                                    {product.is_featured && (
                                        <Badge className="bg-yellow-500 text-white">⭐ Featured</Badge>
                                    )}
                                    {product.type === 'digital' && (
                                        <Badge className="bg-green-500 text-white">📱 Digital</Badge>
                                    )}
                                </div>
                                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                                
                                {/* Rating */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center text-yellow-400">
                                        <Star className="w-5 h-5 fill-current" />
                                        <Star className="w-5 h-5 fill-current" />
                                        <Star className="w-5 h-5 fill-current" />
                                        <Star className="w-5 h-5 fill-current" />
                                        <Star className="w-5 h-5" />
                                        <span className="ml-2 text-gray-600 text-sm">4.2 (128 reviews)</span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-4 mb-6">
                                    {product.sale_price ? (
                                        <>
                                            <span className="text-3xl font-bold text-red-600">
                                                Rp {parseFloat(product.sale_price).toLocaleString('id-ID')}
                                            </span>
                                            <span className="text-xl text-gray-500 line-through">
                                                Rp {parseFloat(product.price).toLocaleString('id-ID')}
                                            </span>
                                            <Badge className="bg-red-500 text-white">
                                                Save {discountPercentage}%
                                            </Badge>
                                        </>
                                    ) : (
                                        <span className="text-3xl font-bold">
                                            Rp {parseFloat(product.price).toLocaleString('id-ID')}
                                        </span>
                                    )}
                                </div>

                                {/* Stock Status */}
                                <div className="mb-6">
                                    {isOutOfStock ? (
                                        <Badge variant="destructive" className="text-base">
                                            ❌ Out of Stock
                                        </Badge>
                                    ) : (
                                        <Badge variant="default" className="text-base bg-green-500">
                                            ✅ In Stock
                                            {product.manage_stock && ` (${product.stock_quantity} available)`}
                                        </Badge>
                                    )}
                                </div>

                                {/* Short Description */}
                                {product.short_description && (
                                    <p className="text-gray-600 mb-6">{product.short_description}</p>
                                )}
                            </div>

                            {/* Quantity and Add to Cart */}
                            {!isOutOfStock && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <label className="font-medium">Quantity:</label>
                                        <div className="flex items-center border rounded-lg">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleQuantityChange(-1)}
                                                disabled={quantity <= 1}
                                                className="h-10 w-10"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>
                                            <Input
                                                type="number"
                                                min="1"
                                                max={maxQuantity}
                                                value={quantity}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value) || 1;
                                                    if (value >= 1 && value <= maxQuantity) {
                                                        setQuantity(value);
                                                    }
                                                }}
                                                className="w-16 text-center border-0 focus:ring-0"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleQuantityChange(1)}
                                                disabled={quantity >= maxQuantity}
                                                className="h-10 w-10"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            Max: {maxQuantity} items
                                        </span>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button 
                                            className="flex-1" 
                                            size="lg"
                                            onClick={handleAddToCart}
                                        >
                                            <ShoppingCart className="w-5 h-5 mr-2" />
                                            Add to Cart
                                        </Button>
                                        <Button variant="outline" size="lg">
                                            <Heart className="w-5 h-5" />
                                        </Button>
                                        <Button variant="outline" size="lg">
                                            <Share2 className="w-5 h-5" />
                                        </Button>
                                    </div>

                                    <div className="text-lg font-semibold">
                                        Total: Rp {(currentPrice * quantity).toLocaleString('id-ID')}
                                    </div>
                                </div>
                            )}

                            {/* Features */}
                            <div className="border-t pt-6">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="space-y-2">
                                        <Truck className="w-8 h-8 mx-auto text-blue-500" />
                                        <div>
                                            <div className="font-medium text-sm">Free Shipping</div>
                                            <div className="text-xs text-gray-600">Orders over Rp 100k</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Shield className="w-8 h-8 mx-auto text-green-500" />
                                        <div>
                                            <div className="font-medium text-sm">Secure Payment</div>
                                            <div className="text-xs text-gray-600">100% Protected</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <RotateCcw className="w-8 h-8 mx-auto text-orange-500" />
                                        <div>
                                            <div className="font-medium text-sm">Easy Returns</div>
                                            <div className="text-xs text-gray-600">30 days return</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Details Tabs */}
                    <div className="mb-16">
                        <Tabs defaultValue="description" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="description">Description</TabsTrigger>
                                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                                <TabsTrigger value="reviews">Reviews (128)</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="description" className="mt-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="prose max-w-none">
                                            {product.description.split('\n').map((paragraph, index) => (
                                                <p key={index} className="mb-4">{paragraph}</p>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            
                            <TabsContent value="specifications" className="mt-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <div className="font-semibold">Product Details</div>
                                                <div className="text-sm space-y-1">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Category:</span>
                                                        <span>{product.category.name}</span>
                                                    </div>
                                                    {product.brand && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Brand:</span>
                                                            <span>{product.brand.name}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Type:</span>
                                                        <span className="capitalize">{product.type}</span>
                                                    </div>
                                                    {product.weight && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Weight:</span>
                                                            <span>{product.weight} kg</span>
                                                        </div>
                                                    )}
                                                    {product.dimensions && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Dimensions:</span>
                                                            <span>{product.dimensions}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            
                            <TabsContent value="reviews" className="mt-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center py-8">
                                            <div className="text-4xl mb-4">⭐</div>
                                            <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
                                            <p className="text-gray-600">Reviews feature coming soon!</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((relatedProduct) => (
                                    <Card 
                                        key={relatedProduct.id}
                                        className="group hover:shadow-lg transition-shadow duration-300"
                                    >
                                        <CardHeader className="p-0">
                                            <div className="aspect-square bg-white rounded-t-lg overflow-hidden">
                                                <img
                                                    src={relatedProduct.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
                                                    alt={relatedProduct.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <CardTitle className="text-sm font-medium mb-2 line-clamp-2">
                                                {relatedProduct.name}
                                            </CardTitle>
                                            <div className="flex items-center gap-2">
                                                {relatedProduct.sale_price ? (
                                                    <>
                                                        <span className="font-bold text-red-600">
                                                            Rp {parseFloat(relatedProduct.sale_price).toLocaleString('id-ID')}
                                                        </span>
                                                        <span className="text-sm text-gray-500 line-through">
                                                            Rp {parseFloat(relatedProduct.price).toLocaleString('id-ID')}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="font-bold">
                                                        Rp {parseFloat(relatedProduct.price).toLocaleString('id-ID')}
                                                    </span>
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0">
                                            <Button 
                                                size="sm"
                                                className="w-full"
                                                onClick={() => router.get(route('products.show', relatedProduct.slug))}
                                            >
                                                View Product
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}