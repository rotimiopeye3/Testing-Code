import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  Package,
  ArrowLeft,
  AlertCircle,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserProducts } from '@/hooks/useProducts';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';
import { useSellerOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';

export default function SellDashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { products, loading: productsLoading, removeProduct } = useUserProducts();
  const { orders, loading: ordersLoading, updateItemStatus } = useSellerOrders();
  const { settings } = usePlatformSettings();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'listings' | 'orders'>('listings');

  if (!user) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="h-16 w-16 text-primary" />
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">Login Required</h1>
        <p className="text-muted-foreground max-w-md">You need to be logged in to manage your shop and list products for sale.</p>
        <Button onClick={() => navigate('/login')} className="rounded-full h-12 px-8">Login Now</Button>
      </div>
    );
  }

  const totalEarnings = products.reduce((acc, curr) => acc + curr.price, 0);
  const potentialEarnings = totalEarnings * (1 - settings.sellerFeePercentage / 100);

  return (
    <div className="min-h-screen bg-background pb-20 pt-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/profile')}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Seller Hub</h1>
            </div>
            <p className="text-muted-foreground font-medium">Manage your products, track earnings, and grow your business.</p>
          </div>
          <Button 
            onClick={() => navigate('/sell/list')} 
            className="rounded-full h-14 px-8 text-lg font-bold uppercase tracking-widest shadow-xl shadow-primary/20"
          >
            <Plus className="mr-2 h-5 w-5" /> List New Item
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card p-8 rounded-[2.5rem] border shadow-sm"
          >
            <Package className="h-8 w-8 text-primary mb-4" />
            <div className="text-4xl font-black tracking-tighter">{products.length}</div>
            <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Active Listings</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card p-8 rounded-[2.5rem] border shadow-sm"
          >
            <DollarSign className="h-8 w-8 text-primary mb-4" />
            <div className="text-4xl font-black tracking-tighter">${totalEarnings.toFixed(2)}</div>
            <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Total Value</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card p-8 rounded-[2.5rem] border shadow-sm bg-primary/5 border-primary/20"
          >
            <TrendingUp className="h-8 w-8 text-primary mb-4" />
            <div className="text-4xl font-black tracking-tighter text-primary">${potentialEarnings.toFixed(2)}</div>
            <div className="text-sm font-bold uppercase tracking-widest text-primary/60">Potential Payout</div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b pb-4">
          <button 
            onClick={() => setActiveTab('listings')}
            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
              activeTab === 'listings' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-secondary'
            }`}
          >
            Your Listings
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
              activeTab === 'orders' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-secondary'
            }`}
          >
            Orders Received
          </button>
        </div>

        {/* Products List */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Your Listings</h2>
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground bg-secondary px-4 py-2 rounded-full">
                Platform Fee: {settings.sellerFeePercentage}%
              </div>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-secondary animate-pulse rounded-[2rem]" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative bg-card rounded-[2rem] border overflow-hidden hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={product.images?.[0] || 'https://picsum.photos/seed/product/800/800'} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg truncate pr-4">{product.name}</h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{product.category}</p>
                          </div>
                          <p className="text-xl font-black tracking-tighter">${product.price}</p>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-xs font-bold">{product.rating || '5.0'}</span>
                          </div>
                          <div className="h-4 w-px bg-border" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Stock: {product.stock || 0}
                          </span>
                        </div>

                        <div className="flex gap-2 mt-6">
                          <Button 
                            variant="secondary" 
                            className="flex-1 rounded-xl font-bold uppercase tracking-widest text-xs"
                            onClick={() => navigate(`/products/${product.id}`)}
                          >
                            View
                          </Button>
                          <Button 
                            variant="destructive" 
                            className="rounded-xl aspect-square p-0"
                            onClick={() => setDeletingId(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="bg-card border-2 border-dashed rounded-[3rem] p-20 text-center space-y-6">
                <div className="bg-secondary h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">No items listed yet</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">Start selling your items to reach thousands of buyers on our platform.</p>
                </div>
                <Button onClick={() => navigate('/sell/list')} className="rounded-full h-12 px-8">
                  List Your First Item
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Orders List */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Orders to Fulfill</h2>
            {ordersLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="h-32 bg-secondary animate-pulse rounded-3xl" />)}
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-card border rounded-[2.5rem] p-8 space-y-6">
                    <div className="flex justify-between items-center border-b pb-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Order ID</p>
                        <p className="font-mono font-bold">#{order.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Date</p>
                        <p className="font-bold">{order.createdAt?.toDate().toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {order.items.filter((item: any) => item.sellerId === user.uid).map((item: any, idx: number) => (
                        <div key={idx} className="bg-secondary/30 rounded-3xl p-6">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 bg-background rounded-xl flex items-center justify-center border">
                                <Package className="h-6 w-6 text-muted-foreground opacity-20" />
                              </div>
                              <div>
                                <h4 className="font-bold">{item.name}</h4>
                                <p className="text-xs font-bold text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black">${item.price * item.quantity}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Update Status</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {['awaiting', 'confirmed', 'with_rider', 'delivered'].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => updateItemStatus(order.id, item.productId, status)}
                                  className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                    item.status === status 
                                      ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
                                      : 'bg-background hover:bg-secondary'
                                  }`}
                                >
                                  {status.replace('_', ' ')}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card border-2 border-dashed rounded-[3rem] p-20 text-center">
                <p className="text-muted-foreground font-bold uppercase tracking-widest">No orders received yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card w-full max-w-md rounded-[2.5rem] p-8 border shadow-2xl space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="bg-destructive/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Delete Listing?</h3>
                <p className="text-muted-foreground">This action cannot be undone. Your product will be permanently removed from the marketplace.</p>
              </div>
              <div className="flex gap-4">
                <Button 
                  variant="secondary" 
                  className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest"
                  onClick={() => setDeletingId(null)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest"
                  onClick={async () => {
                    await removeProduct(deletingId);
                    setDeletingId(null);
                  }}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
