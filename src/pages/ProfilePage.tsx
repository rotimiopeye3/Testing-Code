import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Package, Settings, CreditCard, MapPin, LogOut, 
  ChevronRight, RefreshCcw, Truck, ShoppingCart, Plus, Trash2, 
  ShieldCheck, Store, Tag, Image as ImageIcon, X
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { logout } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { useProfileData } from '@/hooks/useProfileData';
import { useUserProducts, useAdminProducts } from '@/hooks/useProducts';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.4 } }
};

export default function ProfilePage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const [activeTab, setActiveTab] = useState<'orders' | 'settings' | 'sell' | 'admin'>('orders');
  
  const { addresses, payments, addAddress, removeAddress, addPayment, removePayment } = useProfileData();
  const { products: myProducts, addProduct, removeProduct: removeMyProduct } = useUserProducts();
  const { products: allProducts, removeProduct: adminRemoveProduct } = useAdminProducts();
  const { settings } = usePlatformSettings();

  const isAdmin = user?.email === 'rotimiopeye3@gmail.com';

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Sidebar: User Info */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center p-8 rounded-3xl bg-secondary/30 border border-secondary"
          >
            <div className="relative mb-4">
              <img 
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                alt={user.displayName || 'User'} 
                className="h-32 w-32 rounded-full object-cover border-4 border-background shadow-xl"
                referrerPolicy="no-referrer"
              />
              {isAdmin && (
                <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary border-4 border-background flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-background" />
                </div>
              )}
            </div>
            <h1 className="text-2xl font-black tracking-tight">{user.displayName}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            
            <Button 
              variant="outline" 
              className="mt-8 w-full rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </motion.div>

          <div className="space-y-2">
            {[
              { id: 'orders', icon: Package, label: 'My Orders', sub: 'Track & manage' },
              { id: 'settings', icon: Settings, label: 'Settings', sub: 'Address & Payments' },
              { id: 'sell', icon: Store, label: 'Sell', sub: 'List your items' },
              ...(isAdmin ? [{ id: 'admin', icon: ShieldCheck, label: 'Admin', sub: 'Manage Platform' }] : [])
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'admin') {
                    navigate('/admin');
                  } else {
                    setActiveTab(tab.id as any);
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group",
                  activeTab === tab.id ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]" : "hover:bg-secondary/50"
                )}
              >
                <tab.icon className="h-5 w-5" />
                <div className="flex-1">
                  <p className="text-sm font-bold">{tab.label}</p>
                  <p className={cn("text-xs", activeTab === tab.id ? "text-primary-foreground/70" : "text-muted-foreground")}>{tab.sub}</p>
                </div>
                <ChevronRight className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10 min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeTab === 'orders' && (
              <motion.section
                key="orders"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                exit="exit"
                className="space-y-6"
              >
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">My Orders</h2>
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-3xl text-muted-foreground">
                  <Package className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-sm font-medium">No orders yet.</p>
                  <Button variant="link" onClick={() => navigate('/products')}>Start Shopping</Button>
                </div>
              </motion.section>
            )}

            {activeTab === 'settings' && (
              <motion.section
                key="settings"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                exit="exit"
                className="space-y-10"
              >
                <div>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-6">Addresses</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="p-6 rounded-3xl border bg-card relative group">
                        <p className="text-sm font-bold mb-1">{addr.label || 'Address'}</p>
                        <p className="text-xs text-muted-foreground">{addr.street}<br />{addr.city}, {addr.state} {addr.zip}</p>
                        <button 
                          onClick={() => removeAddress(addr.id)}
                          className="absolute top-4 right-4 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <AddAddressModal onAdd={addAddress} />
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-6">Payments</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {payments.map((pay) => (
                      <div key={pay.id} className="p-6 rounded-3xl border bg-card flex items-center gap-4 group relative">
                        <div className="h-10 w-14 bg-secondary rounded-md flex items-center justify-center font-bold text-[10px]">{pay.brand}</div>
                        <div className="flex-1">
                          <p className="text-sm font-bold">•••• {pay.last4}</p>
                          <p className="text-xs text-muted-foreground">Exp: {pay.expiry}</p>
                        </div>
                        <button 
                          onClick={() => removePayment(pay.id)}
                          className="absolute top-4 right-4 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <AddPaymentModal onAdd={addPayment} />
                  </div>
                </div>
              </motion.section>
            )}

            {activeTab === 'sell' && (
              <motion.section
                key="sell"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                exit="exit"
                className="space-y-10"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter">Sell Items</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myProducts.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl">
                      <Store className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p className="text-sm text-muted-foreground">You haven't listed any items yet.</p>
                    </div>
                  ) : (
                    myProducts.map((product) => (
                      <div key={product.id} className="p-4 rounded-3xl border bg-card flex gap-4 group relative">
                        <img src={product.images[0]} className="h-24 w-24 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <p className="text-sm font-bold">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.category}</p>
                          </div>
                          <p className="text-sm font-black">${product.price}</p>
                        </div>
                        <button 
                          onClick={() => removeMyProduct(product.id)}
                          className="absolute top-2 right-2 p-2 text-red-500 md:opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 md:bg-transparent rounded-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.section>
            )}

            {activeTab === 'admin' && isAdmin && (
              <motion.section
                key="admin"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                exit="exit"
                className="space-y-10"
              >
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">Admin Dashboard</h2>
                <div className="space-y-4">
                  {allProducts.map((product) => (
                    <div key={product.id} className="p-4 rounded-3xl border bg-card flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <img src={product.images[0]} className="h-12 w-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <p className="text-sm font-bold">{product.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">Seller: {product.sellerName || 'System'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-sm font-black">${product.price}</p>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="rounded-full h-8 w-8 p-0"
                          onClick={() => adminRemoveProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

      </div>
      <SellItemModal onAdd={addProduct} fee={settings.sellerFeePercentage} />
    </div>
  );
}

function AddAddressModal({ onAdd }: { onAdd: (addr: any) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ label: '', street: '', city: '', state: '', zip: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setIsOpen(false);
    setFormData({ label: '', street: '', city: '', state: '', zip: '' });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-6 rounded-3xl border border-dashed flex flex-col items-center justify-center gap-2 hover:bg-secondary/30 transition-colors"
      >
        <Plus className="h-6 w-6 text-muted-foreground" />
        <p className="text-xs font-bold">Add New Address</p>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background p-8 rounded-[2rem] border shadow-2xl w-full max-w-md"
          >
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-6">New Address</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                placeholder="Label (e.g. Home, Office)" 
                className="w-full p-3 rounded-xl bg-secondary border-none outline-none text-sm"
                value={formData.label}
                onChange={e => setFormData({...formData, label: e.target.value})}
                required
              />
              <input 
                placeholder="Street Address" 
                className="w-full p-3 rounded-xl bg-secondary border-none outline-none text-sm"
                value={formData.street}
                onChange={e => setFormData({...formData, street: e.target.value})}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="City" 
                  className="w-full p-3 rounded-xl bg-secondary border-none outline-none text-sm"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  required
                />
                <input 
                  placeholder="Zip Code" 
                  className="w-full p-3 rounded-xl bg-secondary border-none outline-none text-sm"
                  value={formData.zip}
                  onChange={e => setFormData({...formData, zip: e.target.value})}
                  required
                />
              </div>
              <div className="flex gap-4 mt-6">
                <Button type="button" variant="ghost" className="flex-1 rounded-full" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 rounded-full">Save Address</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}

function AddPaymentModal({ onAdd }: { onAdd: (pay: any) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ last4: '', expiry: '', brand: 'VISA' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setIsOpen(false);
    setFormData({ last4: '', expiry: '', brand: 'VISA' });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-6 rounded-3xl border border-dashed flex flex-col items-center justify-center gap-2 hover:bg-secondary/30 transition-colors"
      >
        <Plus className="h-6 w-6 text-muted-foreground" />
        <p className="text-xs font-bold">Add New Card</p>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background p-8 rounded-[2rem] border shadow-2xl w-full max-w-md"
          >
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-6">New Payment</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                placeholder="Card Number (Last 4 digits)" 
                maxLength={4}
                className="w-full p-3 rounded-xl bg-secondary border-none outline-none text-sm"
                value={formData.last4}
                onChange={e => setFormData({...formData, last4: e.target.value})}
                required
              />
              <input 
                placeholder="Expiry (MM/YY)" 
                className="w-full p-3 rounded-xl bg-secondary border-none outline-none text-sm"
                value={formData.expiry}
                onChange={e => setFormData({...formData, expiry: e.target.value})}
                required
              />
              <select 
                className="w-full p-3 rounded-xl bg-secondary border-none outline-none text-sm appearance-none"
                value={formData.brand}
                onChange={e => setFormData({...formData, brand: e.target.value})}
              >
                <option value="VISA">VISA</option>
                <option value="MASTERCARD">MASTERCARD</option>
                <option value="AMEX">AMEX</option>
              </select>
              <div className="flex gap-4 mt-6">
                <Button type="button" variant="ghost" className="flex-1 rounded-full" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 rounded-full">Save Card</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}

function SellItemModal({ onAdd, fee }: { onAdd: (item: any) => void, fee: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    price: '', 
    category: 'Clothing', 
    targetAudience: 'Men',
    description: '',
    image: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      price: parseFloat(formData.price),
      images: [formData.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'],
      brand: 'User Listed'
    });
    setIsOpen(false);
    setFormData({ name: '', price: '', category: 'Clothing', targetAudience: 'Men', description: '', image: '' });
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50 lg:hidden">
        <Button onClick={() => setIsOpen(true)} className="rounded-full h-14 w-14 shadow-2xl">
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      <div className="hidden lg:block mb-6">
        <Button onClick={() => setIsOpen(true)} className="rounded-full">
          <Plus className="mr-2 h-4 w-4" /> List Item
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-background p-6 md:p-8 rounded-[2rem] border shadow-2xl w-full max-w-lg my-auto relative"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">List an Item</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-6">
                Platform fee: {fee}% per sale
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase ml-2 text-muted-foreground">Product Name</label>
                    <input 
                      placeholder="e.g. Vintage Singlet" 
                      className="w-full p-3 rounded-xl bg-secondary border-none outline-none text-sm"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase ml-2 text-muted-foreground">Price ($)</label>
                    <input 
                      type="number"
                      placeholder="25" 
                      className="w-full p-3 rounded-xl bg-secondary border-none outline-none text-sm"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase ml-2 text-muted-foreground">Category</label>
                    <select 
                      className="w-full p-3 rounded-xl bg-secondary border-none outline-none text-sm appearance-none"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="Clothing">Clothing</option>
                      <option value="Shoes">Shoes</option>
                      <option value="Watch">Watch</option>
                      <option value="Boxers">Boxers</option>
                      <option value="Singlet">Singlet</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase ml-2 text-muted-foreground">Target Audience</label>
                    <select 
                      className="w-full p-3 rounded-xl bg-secondary border-none outline-none text-sm appearance-none"
                      value={formData.targetAudience}
                      onChange={e => setFormData({...formData, targetAudience: e.target.value})}
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase ml-2 text-muted-foreground">Image URL</label>
                  <input 
                    placeholder="https://images.unsplash.com/..." 
                    className="w-full p-3 rounded-xl bg-secondary border-none outline-none text-sm"
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase ml-2 text-muted-foreground">Description</label>
                  <textarea 
                    placeholder="Tell us about the item..." 
                    className="w-full p-3 rounded-xl bg-secondary border-none outline-none text-sm min-h-[80px]"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>

                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <p className="text-[10px] font-bold uppercase text-primary mb-1">Earnings Summary</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Your Price:</span>
                    <span className="font-bold">${formData.price || '0'}</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-muted-foreground">Platform Fee ({fee}%):</span>
                    <span className="font-bold text-red-500">-${((parseFloat(formData.price) || 0) * (fee / 100)).toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-primary/10 my-2" />
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">You Receive:</span>
                    <span className="font-black text-primary">${((parseFloat(formData.price) || 0) * (1 - fee / 100)).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button type="button" variant="ghost" className="flex-1 rounded-full" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1 rounded-full">List Product</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
