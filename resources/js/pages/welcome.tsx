import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { router, Head, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { 
    ShoppingBag, 
    CreditCard, 
    Truck, 
    Shield, 
    Users, 
    BarChart3,
    Star,
    Globe,
    Zap
} from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const features = [
        {
            icon: <ShoppingBag className="w-6 h-6" />,
            title: "Product Management",
            description: "Manage physical & digital products with categories, brands, and inventory tracking"
        },
        {
            icon: <CreditCard className="w-6 h-6" />,
            title: "Xendit Payment Integration",
            description: "Secure payment processing with multiple payment methods through Xendit"
        },
        {
            icon: <Truck className="w-6 h-6" />,
            title: "Order Management", 
            description: "Complete order lifecycle from cart to delivery with status tracking"
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "Admin Dashboard",
            description: "Comprehensive analytics, sales reports, and inventory management tools"
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Customer Experience",
            description: "User-friendly shopping cart, wishlist, and order history features"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Discount System",
            description: "Flexible coupon system with product-specific and percentage/fixed discounts"
        }
    ];

    const mockStats = [
        { label: "Active Products", value: "500+", icon: "📦" },
        { label: "Happy Customers", value: "10K+", icon: "😊" },
        { label: "Orders Processed", value: "25K+", icon: "📋" },
        { label: "Revenue Generated", value: "Rp 2B+", icon: "💰" }
    ];

    return (
        <>
            <Head title="Welcome to ShopHub - E-Commerce Platform" />
            <AppShell>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
                        <div className="relative container mx-auto px-4 py-20">
                            <div className="text-center max-w-4xl mx-auto">
                                <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm px-4 py-2">
                                    ✨ E-Commerce Platform Ready
                                </Badge>
                                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                                    🛍️ ShopHub Platform
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                                    Complete e-commerce solution with <strong>product management</strong>, 
                                    <strong> Xendit payments</strong>, <strong>discount coupons</strong>, 
                                    and <strong>admin dashboard</strong> - ready for your business!
                                </p>
                                
                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                                    <Button 
                                        size="lg" 
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
                                        onClick={() => router.get(route('products.index'))}
                                    >
                                        <Zap className="w-5 h-5 mr-2" />
                                        Explore Store 🚀
                                    </Button>
                                    {!auth.user ? (
                                        <Button 
                                            size="lg" 
                                            variant="outline"
                                            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg"
                                            onClick={() => router.get(route('register'))}
                                        >
                                            <Users className="w-5 h-5 mr-2" />
                                            Start Selling 💼
                                        </Button>
                                    ) : (
                                        <Button 
                                            size="lg" 
                                            variant="outline"
                                            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg"
                                            onClick={() => router.get(route('dashboard'))}
                                        >
                                            <BarChart3 className="w-5 h-5 mr-2" />
                                            Dashboard 📊
                                        </Button>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                                    {mockStats.map((stat, index) => (
                                        <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                                            <CardContent className="p-6 text-center">
                                                <div className="text-3xl mb-2">{stat.icon}</div>
                                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                                    {stat.value}
                                                </div>
                                                <div className="text-sm text-gray-600">{stat.label}</div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-20 bg-white">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    🎯 Platform Features
                                </h2>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                    Everything you need to run a successful e-commerce business
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {features.map((feature, index) => (
                                    <Card key={index} className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
                                        <CardContent className="p-8">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4">
                                                {feature.icon}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                                {feature.title}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Demo Section */}
                    <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                        <div className="container mx-auto px-4 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                🎪 See It In Action
                            </h2>
                            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                                Browse products, add to cart, experience the complete shopping flow
                            </p>
                            
                            <div className="grid md:grid-cols-3 gap-6 mb-12">
                                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                                    <CardContent className="p-6 text-center">
                                        <div className="text-4xl mb-4">🛒</div>
                                        <h3 className="text-lg font-bold mb-2">Shop Products</h3>
                                        <p className="text-gray-300 text-sm">Browse categories, search, filter products</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                                    <CardContent className="p-6 text-center">
                                        <div className="text-4xl mb-4">💳</div>
                                        <h3 className="text-lg font-bold mb-2">Secure Checkout</h3>
                                        <p className="text-gray-300 text-sm">Apply coupons, process payments</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                                    <CardContent className="p-6 text-center">
                                        <div className="text-4xl mb-4">📊</div>
                                        <h3 className="text-lg font-bold mb-2">Admin Panel</h3>
                                        <p className="text-gray-300 text-sm">Manage orders, track sales, analytics</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button 
                                    size="lg"
                                    className="bg-white text-gray-900 hover:bg-gray-100"
                                    onClick={() => router.get(route('products.index'))}
                                >
                                    <ShoppingBag className="w-5 h-5 mr-2" />
                                    Browse Products 🔍
                                </Button>
                                {auth.user ? (
                                    <Button 
                                        size="lg"
                                        variant="outline"
                                        className="border-white text-white hover:bg-white hover:text-gray-900"
                                        onClick={() => router.get(route('dashboard'))}
                                    >
                                        <Shield className="w-5 h-5 mr-2" />
                                        Your Dashboard 🎛️
                                    </Button>
                                ) : (
                                    <Button 
                                        size="lg"
                                        variant="outline"
                                        className="border-white text-white hover:bg-white hover:text-gray-900"
                                        onClick={() => router.get(route('login'))}
                                    >
                                        <Shield className="w-5 h-5 mr-2" />
                                        Sign In 🔐
                                    </Button>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Tech Stack */}
                    <section className="py-16 bg-gray-50">
                        <div className="container mx-auto px-4 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">
                                ⚡ Built With Modern Technology
                            </h2>
                            <div className="flex flex-wrap justify-center gap-4">
                                {[
                                    "Laravel 11", "React 18", "TypeScript", "Inertia.js", 
                                    "Tailwind CSS", "Xendit API", "MySQL", "Vite"
                                ].map((tech, index) => (
                                    <Badge 
                                        key={index}
                                        variant="secondary" 
                                        className="px-4 py-2 text-sm font-medium"
                                    >
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Final CTA */}
                    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <div className="container mx-auto px-4 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Ready to Launch Your Store? 🚀
                            </h2>
                            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                                Start your e-commerce journey today with our complete platform solution
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {!auth.user ? (
                                    <>
                                        <Button 
                                            size="lg"
                                            className="bg-white text-blue-600 hover:bg-gray-100"
                                            onClick={() => router.get(route('register'))}
                                        >
                                            <Star className="w-5 h-5 mr-2" />
                                            Get Started Free ✨
                                        </Button>
                                        <Button 
                                            size="lg"
                                            variant="outline"
                                            className="border-white text-white hover:bg-white hover:text-blue-600"
                                            onClick={() => router.get(route('products.index'))}
                                        >
                                            <Globe className="w-5 h-5 mr-2" />
                                            View Demo Store 🌟
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button 
                                            size="lg"
                                            className="bg-white text-blue-600 hover:bg-gray-100"
                                            onClick={() => router.get(route('dashboard'))}
                                        >
                                            <BarChart3 className="w-5 h-5 mr-2" />
                                            Go to Dashboard ✨
                                        </Button>
                                        <Button 
                                            size="lg"
                                            variant="outline"
                                            className="border-white text-white hover:bg-white hover:text-blue-600"
                                            onClick={() => router.get(route('cart.index'))}
                                        >
                                            <ShoppingBag className="w-5 h-5 mr-2" />
                                            View Cart 🛒
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </AppShell>
        </>
    );
}