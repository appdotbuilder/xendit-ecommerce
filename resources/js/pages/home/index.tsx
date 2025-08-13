import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    slug: string;
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
}

interface Category {
    id: number;
    name: string;
    slug: string;
    image: string | null;
}

interface Brand {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
}

interface Props {
    featuredProducts: Product[];
    latestProducts: Product[];
    saleProducts: Product[];
    categories: Category[];
    brands: Brand[];
    [key: string]: unknown;
}

export default function HomeIndex({ 
    featuredProducts, 
    latestProducts, 
    saleProducts, 
    categories, 
    brands 
}: Props) {
    const handleAddToCart = (productId: number) => {
        router.post(route('cart.store'), {
            product_id: productId,
            quantity: 1
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const ProductCard = ({ product }: { product: Product }) => {
        const discountPercentage = product.sale_price 
            ? Math.round(((parseFloat(product.price) - parseFloat(product.sale_price)) / parseFloat(product.price)) * 100)
            : 0;

        return (
            <Card className="group hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0 relative">
                    <div className="relative overflow-hidden rounded-t-lg">
                        <img
                            src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
                            alt={product.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.sale_price && (
                            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                                -{discountPercentage}%
                            </Badge>
                        )}
                        {product.is_featured && (
                            <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
                                ⭐ Featured
                            </Badge>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => router.get(route('products.show', product.slug))}
                            >
                                <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="secondary"
                            >
                                <Heart className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="mb-2">
                        <Badge variant="secondary" className="text-xs">
                            {product.category.name}
                        </Badge>
                        {product.brand && (
                            <Badge variant="outline" className="text-xs ml-2">
                                {product.brand.name}
                            </Badge>
                        )}
                    </div>
                    <CardTitle className="text-sm font-medium mb-2 line-clamp-2">
                        {product.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center text-yellow-400 text-sm">
                            <Star className="w-3 h-3 fill-current" />
                            <Star className="w-3 h-3 fill-current" />
                            <Star className="w-3 h-3 fill-current" />
                            <Star className="w-3 h-3 fill-current" />
                            <Star className="w-3 h-3" />
                            <span className="ml-1 text-gray-600">4.2</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {product.sale_price ? (
                            <>
                                <span className="text-lg font-bold text-red-600">
                                    Rp {parseFloat(product.sale_price).toLocaleString('id-ID')}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                    Rp {parseFloat(product.price).toLocaleString('id-ID')}
                                </span>
                            </>
                        ) : (
                            <span className="text-lg font-bold">
                                Rp {parseFloat(product.price).toLocaleString('id-ID')}
                            </span>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                    <Button 
                        className="w-full" 
                        onClick={() => handleAddToCart(product.id)}
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                    </Button>
                </CardFooter>
            </Card>
        );
    };

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative container mx-auto px-4 py-24">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-5xl font-bold mb-6">
                                🛍️ Welcome to ShopHub
                            </h1>
                            <p className="text-xl mb-8 opacity-90">
                                Discover amazing products at unbeatable prices. From electronics to fashion, 
                                we have everything you need in one place.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Button 
                                    size="lg" 
                                    className="bg-white text-gray-900 hover:bg-gray-100"
                                    onClick={() => router.get(route('products.index'))}
                                >
                                    Shop Now 🛒
                                </Button>
                                <Button 
                                    size="lg" 
                                    variant="outline" 
                                    className="border-white text-white hover:bg-white hover:text-gray-900"
                                    onClick={() => router.get(route('register'))}
                                >
                                    Sign Up Free ✨
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
                            <p className="text-gray-600">Explore our wide range of product categories</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {categories.map((category) => (
                                <Card 
                                    key={category.id}
                                    className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
                                    onClick={() => router.get(route('products.index', { category: category.slug }))}
                                >
                                    <CardContent className="p-6 text-center">
                                        <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                                            📦
                                        </div>
                                        <h3 className="font-semibold">{category.name}</h3>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Products */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">⭐ Featured Products</h2>
                            <p className="text-gray-600">Hand-picked products just for you</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        <div className="text-center">
                            <Button 
                                variant="outline" 
                                onClick={() => router.get(route('products.index'))}
                            >
                                View All Products →
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Sale Products */}
                {saleProducts.length > 0 && (
                    <section className="py-16 bg-red-50">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold mb-4 text-red-700">🔥 Hot Deals</h2>
                                <p className="text-gray-600">Limited time offers you can't miss</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {saleProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Latest Products */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">🆕 Latest Arrivals</h2>
                            <p className="text-gray-600">Check out our newest products</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {latestProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Brands Section */}
                {brands.length > 0 && (
                    <section className="py-16 bg-gray-100">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold mb-4">🏪 Popular Brands</h2>
                                <p className="text-gray-600">Trusted brands we partner with</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                                {brands.map((brand) => (
                                    <Card 
                                        key={brand.id}
                                        className="cursor-pointer hover:shadow-md transition-shadow duration-300"
                                        onClick={() => router.get(route('products.index', { brand: brand.slug }))}
                                    >
                                        <CardContent className="p-4 text-center">
                                            <div className="h-16 flex items-center justify-center mb-2">
                                                {brand.logo ? (
                                                    <img 
                                                        src={brand.logo} 
                                                        alt={brand.name}
                                                        className="max-h-full max-w-full object-contain"
                                                    />
                                                ) : (
                                                    <div className="text-2xl">🏷️</div>
                                                )}
                                            </div>
                                            <h3 className="text-sm font-medium">{brand.name}</h3>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-r from-green-500 to-blue-600 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping? 🎉</h2>
                        <p className="text-xl mb-8 opacity-90">
                            Join thousands of satisfied customers and discover great deals today!
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button 
                                size="lg" 
                                className="bg-white text-gray-900 hover:bg-gray-100"
                                onClick={() => router.get(route('login'))}
                            >
                                Sign In 🔐
                            </Button>
                            <Button 
                                size="lg" 
                                variant="outline" 
                                className="border-white text-white hover:bg-white hover:text-gray-900"
                                onClick={() => router.get(route('register'))}
                            >
                                Create Account 🚀
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </AppShell>
    );
}