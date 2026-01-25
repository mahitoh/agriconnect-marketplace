import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaShoppingCart, FaTruck, FaShieldAlt, FaUndo, FaMinus, FaPlus, FaMapMarkerAlt, FaShare } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/ProductCard';
import { products } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [selectedImage, setSelectedImage] = useState(0);

    // In a real app, fetch product by ID. Here we find it in mock data or use a fallback.
    const product = products.find(p => p.id === parseInt(id)) || products[0];

    // Dummy gallery images (in real app, product would have an array of specific images)
    const images = [
        product.image,
        'https://images.unsplash.com/photo-1595855700996-3c5825700281?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=800&fit=crop'
    ];

    const handleQuantityChange = (type) => {
        if (type === 'minus' && quantity > 1) setQuantity(prev => prev - 1);
        if (type === 'plus') setQuantity(prev => prev + 1);
    };

    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = () => {
        if (!user) {
            if (window.confirm("You must be logged in to add items to your cart. Would you like to login now?")) {
                navigate('/login');
            }
            return;
        }

        addToCart({
            ...product,
            price: parseInt(product.price.replace(/[^\d]/g, '')),
            quantity
        });
    };

    const relatedProducts = products.filter(p => p.badge === product.badge && p.id !== product.id).slice(0, 3);

    return (
        <div className="min-h-screen bg-[var(--bg-secondary)]">
            <Navbar />

            <div className="pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-8">
                        <Link to="/" className="hover:text-[var(--primary-600)]">Home</Link>
                        <span>/</span>
                        <Link to="/marketplace" className="hover:text-[var(--primary-600)]">Marketplace</Link>
                        <span>/</span>
                        <span className="text-[var(--text-primary)] font-medium">{product.name}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <motion.div
                                layoutId={`product-image-${product.id}`}
                                className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg border border-[var(--border-light)]"
                            >
                                <img
                                    src={images[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index
                                            ? 'border-[var(--primary-500)] ring-2 ring-[var(--primary-500)]/20 shadow-md transform scale-95'
                                            : 'border-transparent hover:border-[var(--border-color)]'
                                            }`}
                                    >
                                        <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
                                        {product.name}
                                    </h1>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="bg-[var(--primary-50)] text-[var(--primary-700)] px-3 py-1 rounded-full font-medium">
                                            {product.badge}
                                        </span>
                                        <div className="flex items-center gap-1 text-[var(--warning)]">
                                            <FaStar />
                                            <span className="font-bold text-[var(--text-primary)]">4.8</span>
                                            <span className="text-[var(--text-tertiary)]">(120 reviews)</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-10 h-10 rounded-full bg-white border border-[var(--border-color)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-red-500 hover:border-red-500 transition-colors shadow-sm">
                                    <FaHeart />
                                </button>
                            </div>

                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-3xl font-bold text-[var(--primary-600)]">{product.price}</span>
                                <span className="text-[var(--text-tertiary)] line-through">
                                    {(parseInt(product.price.replace(/[^\d]/g, '')) * 1.2).toLocaleString()} FCFA
                                </span>
                            </div>

                            <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
                                Freshly harvested {product.name.toLowerCase()} sourced directly from {product.farmer}.
                                Grown using sustainable farming practices without harmful chemicals. Perfect for your daily nutritional needs.
                            </p>

                            {/* Farmer Profile Snippet */}
                            <div className="bg-white p-4 rounded-xl border border-[var(--border-light)] mb-8 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)] font-bold text-xl">
                                    {product.farmer.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-[var(--text-secondary)]">Sold by</p>
                                    <h4 className="font-bold text-[var(--text-primary)]">{product.farmer}</h4>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-[var(--text-secondary)] text-sm mb-1">
                                        <FaMapMarkerAlt /> {product.location}
                                    </div>
                                    <Link to="/farmers" className="text-[var(--primary-600)] text-sm font-semibold hover:underline">
                                        View Profile
                                    </Link>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8 border-b border-[var(--border-light)] pb-8">
                                <div className="flex items-center border-2 border-[var(--border-color)] rounded-xl h-14 w-fit">
                                    <button
                                        onClick={() => handleQuantityChange('minus')}
                                        className="w-12 h-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded-l-lg disabled:opacity-50"
                                        disabled={quantity <= 1}
                                    >
                                        <FaMinus size={12} />
                                    </button>
                                    <span className="w-12 text-center font-bold text-[var(--text-primary)]">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange('plus')}
                                        className="w-12 h-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded-r-lg"
                                    >
                                        <FaPlus size={12} />
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 h-14 bg-[var(--primary-500)] text-white font-bold rounded-xl hover:bg-[var(--primary-600)] transition-all shadow-lg hover:shadow-[var(--primary-500)]/30 flex items-center justify-center gap-2"
                                >
                                    <FaShoppingCart /> Add to Cart
                                </button>
                            </div>

                            {/* Value Props */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="w-10 h-10 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                                        <FaTruck />
                                    </div>
                                    <p className="text-xs font-semibold text-[var(--text-secondary)]">Fast Delivery</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-10 h-10 mx-auto rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-2">
                                        <FaShieldAlt />
                                    </div>
                                    <p className="text-xs font-semibold text-[var(--text-secondary)]">Quality Check</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-10 h-10 mx-auto rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-2">
                                        <FaUndo />
                                    </div>
                                    <p className="text-xs font-semibold text-[var(--text-secondary)]">Easy Returns</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="mb-16">
                        <div className="flex border-b border-[var(--border-light)] mb-8">
                            {['description', 'reviews', 'shipping'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-8 py-4 font-bold text-sm uppercase tracking-wide border-b-2 transition-all ${activeTab === tab
                                        ? 'border-[var(--primary-500)] text-[var(--primary-600)]'
                                        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--border-light)] min-h-[200px]">
                            {activeTab === 'description' && (
                                <div className="prose max-w-none text-[var(--text-secondary)]">
                                    <p className="mb-4">
                                        Experience the taste of authentic {product.name}, grown with care by local farmers.
                                        Harvested at peak ripeness to ensure maximum flavor and nutritional value.
                                    </p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>100% Organic and pesticide-free</li>
                                        <li>Sourced directly from verified local farms</li>
                                        <li>Rich in essential vitamins and minerals</li>
                                        <li>Perfect for healthy home cooking</li>
                                    </ul>
                                </div>
                            )}
                            {activeTab === 'reviews' && (
                                <div className="text-center py-10">
                                    <p className="text-[var(--text-secondary)]">No reviews yet. Be the first to review this product!</p>
                                    <button className="mt-4 px-6 py-2 border-2 border-[var(--primary-500)] text-[var(--primary-600)] rounded-lg font-bold hover:bg-[var(--primary-50)] transition-colors">
                                        Write a Review
                                    </button>
                                </div>
                            )}
                            {activeTab === 'shipping' && (
                                <div className="text-[var(--text-secondary)]">
                                    <h4 className="font-bold text-[var(--text-primary)] mb-2">Delivery Information</h4>
                                    <p className="mb-4">We deliver to all major cities in Cameroon including Douala, Yaoundé, Bafoussam, and Garoua.</p>
                                    <p>Standard delivery takes 24-48 hours. Express delivery available at checkout.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8">You May Also Like</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedProducts.map(p => (
                                    <ProductCard key={p.id} product={p} onAddToCart={() => addToCart(p)} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetails;
