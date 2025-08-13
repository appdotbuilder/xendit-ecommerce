import React, { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { Search, Filter, Heart, ShoppingCart, Star, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

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
    stock_status: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Brand {
    id: number;
    name: string;
    slug: string;
}

interface Pagination {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    products: Pagination;
    categories: Category[];
    brands: Brand[];
    filters: {
        category?: string;
        brand?: string;
        search?: string;
        type?: string;
        sort?: string;
        order?: string;
    };
    [key: string]: unknown;
}

export default function ProductsIndex({ products, categories, brands, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('products.index'), {
            ...filters,
            search: searchQuery
        }, {
            preserveState: true
        });
    };

    const handleFilterChange = (key: string, value: string | null) => {
        router.get(route('products.index'), {
            ...filters,
            [key]: value || undefined
        }, {
            preserveState: true
        });
    };

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

        const isOutOfStock = product.stock_status === 'outofstock';

        return (
            <Card className="group hover:shadow-lg transition-shadow duration-300 relative">
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-gray-900/50 z-10 flex items-center justify-center rounded-lg">
                        <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
                    </div>
                )}
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
                        disabled={isOutOfStock}
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                </CardFooter>
            </Card>
        );
    };

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-4">🛍️ All Products</h1>
                        <p className="text-gray-600">
                            Discover our full range of products ({products.total} items)
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                </div>
                                <Button type="submit">Search</Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filters
                                </Button>
                            </div>
                        </form>

                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Category</label>
                                    <Select
                                        value={filters.category || ''}
                                        onValueChange={(value) => handleFilterChange('category', value || null)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Categories" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All Categories</SelectItem>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.slug}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Brand</label>
                                    <Select
                                        value={filters.brand || ''}
                                        onValueChange={(value) => handleFilterChange('brand', value || null)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Brands" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All Brands</SelectItem>
                                            {brands.map((brand) => (
                                                <SelectItem key={brand.id} value={brand.slug}>
                                                    {brand.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Type</label>
                                    <Select
                                        value={filters.type || ''}
                                        onValueChange={(value) => handleFilterChange('type', value || null)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All Types</SelectItem>
                                            <SelectItem value="physical">Physical</SelectItem>
                                            <SelectItem value="digital">Digital</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Sort By</label>
                                    <Select
                                        value={`${filters.sort || 'created_at'}-${filters.order || 'desc'}`}
                                        onValueChange={(value) => {
                                            const [sort, order] = value.split('-');
                                            router.get(route('products.index'), {
                                                ...filters,
                                                sort,
                                                order
                                            }, {
                                                preserveState: true
                                            });
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="created_at-desc">Newest First</SelectItem>
                                            <SelectItem value="created_at-asc">Oldest First</SelectItem>
                                            <SelectItem value="name-asc">Name A-Z</SelectItem>
                                            <SelectItem value="name-desc">Name Z-A</SelectItem>
                                            <SelectItem value="price-asc">Price Low-High</SelectItem>
                                            <SelectItem value="price-desc">Price High-Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Empty State */}
                    {products.data.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold mb-2">No products found</h3>
                            <p className="text-gray-600 mb-4">
                                Try adjusting your search criteria or browse all products
                            </p>
                            <Button onClick={() => router.get(route('products.index'))}>
                                View All Products
                            </Button>
                        </div>
                    )}

                    {/* Pagination */}
                    {products.last_page > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            {products.links.map((link, index) => {
                                if (!link.url) {
                                    return (
                                        <Button
                                            key={index}
                                            variant="ghost"
                                            disabled
                                            className="w-10 h-10 p-0"
                                        >
                                            {link.label === '&laquo; Previous' ? (
                                                <ChevronLeft className="w-4 h-4" />
                                            ) : link.label === 'Next &raquo;' ? (
                                                <ChevronRight className="w-4 h-4" />
                                            ) : (
                                                link.label
                                            )}
                                        </Button>
                                    );
                                }

                                return (
                                    <Button
                                        key={index}
                                        variant={link.active ? "default" : "ghost"}
                                        onClick={() => router.get(link.url!)}
                                        className="w-10 h-10 p-0"
                                    >
                                        {link.label === '&laquo; Previous' ? (
                                            <ChevronLeft className="w-4 h-4" />
                                        ) : link.label === 'Next &raquo;' ? (
                                            <ChevronRight className="w-4 h-4" />
                                        ) : (
                                            link.label
                                        )}
                                    </Button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}