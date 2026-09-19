'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Search, CheckCircle, Package, ArrowRight, X, ShieldCheck } from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

interface CartItem extends Product {
  quantity: number;
}

const CATEGORIES = ['ALL', 'PROJECTOR', 'CONSOLE', 'ACCESSORY', 'GROOMING'];

export default function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Cart & Checkout States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/external/sync', {
          headers: { 'x-api-key': 'bd_ext_development_key_9868814702' },
        });
        if (res.ok) {
          const data = await res.json();
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phone,
          address,
          items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
        }),
      });

      if (res.ok) {
        setCart([]);
        setOrderSuccess(true);
      } else {
        alert('Failed to place order. Please check item stock.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' || p.category.toUpperCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-red-600 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-red-900 via-red-600 to-black text-white text-xs font-medium py-2 px-4 text-center tracking-widest uppercase border-b border-red-500/20">
        ⚡ Free Express Delivery across Nepal on orders over NPR 5,000
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-black/70 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg shadow-red-600/30 tracking-tighter">
              BD
            </div>
            <div>
              <span className="text-xl font-black tracking-tight uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                Black Dragon
              </span>
              <span className="block text-[10px] text-zinc-500 font-mono tracking-widest -mt-1 uppercase">
                Premium Store
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition-all hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-black">
                  {cart.reduce((a, c) => a + c.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-zinc-800/60 bg-gradient-to-b from-zinc-900/50 to-[#0a0a0a] py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-800/40 text-red-400 text-xs font-mono">
              <ShieldCheck className="w-4 h-4" /> Official Brand Warranty Included
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight uppercase">
              Next-Gen Gear <br />
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Engineered to Excel
              </span>
            </h1>
            <p className="text-zinc-400 text-base max-w-lg">
              Explore authentic handheld consoles, 4K smart projectors, and luxury personal grooming tech delivered straight to your doorstep in Nepal.
            </p>
          </div>
        </div>
      </section>

      {/* Main Catalog Area */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 border ${
                  selectedCategory === cat
                    ? 'bg-zinc-100 text-black border-white font-bold shadow-lg shadow-white/10'
                    : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search gear or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-24 text-center text-zinc-500 font-mono">Loading inventory catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-24 text-center text-zinc-500 font-mono">No gear matches your filter criteria.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="group relative bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-red-950/20"
              >
                <div>
                  <div className="aspect-square bg-zinc-950 rounded-xl overflow-hidden mb-4 border border-zinc-800/50 flex items-center justify-center p-4">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <Package className="w-12 h-12 text-zinc-700" />
                    )}
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono text-red-500 font-semibold uppercase">{p.category}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{p.sku}</span>
                  </div>
                  <h2 className="text-base font-bold text-zinc-100 group-hover:text-white transition-colors">{p.name}</h2>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">{p.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono">Price</span>
                    <span className="text-base font-black text-white">NPR {p.price.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    disabled={p.stock <= 0}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      p.stock > 0
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    {p.stock > 0 ? 'Add + ' : 'Sold Out'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart Drawer & Checkout Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-950 border-l border-zinc-800 h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-6 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-red-500" />
                  <h2 className="text-lg font-bold text-white uppercase">Your Cart</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-zinc-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {orderSuccess ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <h3 className="text-xl font-bold text-white">Order Confirmed!</h3>
                  <p className="text-xs text-zinc-400">Our customer team will contact you shortly for dispatch details.</p>
                  <button
                    onClick={() => { setOrderSuccess(false); setIsCartOpen(false); }}
                    className="mt-4 px-6 py-2.5 bg-zinc-800 text-white text-xs font-bold rounded-xl"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <p className="text-zinc-500 text-sm py-12 text-center">Your shopping cart is currently empty.</p>
              ) : (
                <div className="divide-y divide-zinc-800/60 my-4">
                  {cart.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-white">{item.name}</p>
                        <p className="text-xs text-zinc-500 font-mono">
                          {item.quantity} x NPR {item.price.toLocaleString()}
                        </p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:underline">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!orderSuccess && cart.length > 0 && (
              <form onSubmit={handleCheckout} className="space-y-4 pt-6 border-t border-zinc-800">
                <div className="flex justify-between text-base font-bold text-white mb-2">
                  <span>Total Amount</span>
                  <span>NPR {cartTotal.toLocaleString()}</span>
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                />
                <input
                  type="tel"
                  placeholder="Phone Number (e.g. 9841000000)"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                />
                <textarea
                  placeholder="Delivery Address (City, Area, Landmark)"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white h-20"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 font-bold text-xs uppercase tracking-wider text-white rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Order (Cash on Delivery)'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
