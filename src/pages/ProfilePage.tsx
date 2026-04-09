import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Package, Settings, CreditCard, MapPin, LogOut, 
  ChevronRight, RefreshCcw, Truck, ShoppingCart, Plus, Trash2, 
  ShieldCheck, Store, Tag, Image as ImageIcon, X, ShoppingBag, Camera
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { logout, auth } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { cn, compressImage } from '@/lib/utils';
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
  const [isUpdating, setIsUpdating] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isEditing, setIsEditing] = useState(false);
  
  const { addresses, payments, addAddress, removeAddress, addPayment, removePayment } = useProfileData();
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const compressed = await compressImage(base64);
        setPhotoURL(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;
    setIsUpdating(true);
    try {
      await updateProfile(auth.currentUser, { 
        displayName: displayName.trim(), 
        photoURL: photoURL 
      });
      
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, { 
        displayName: displayName.trim(), 
        photoURL: photoURL,
        updatedAt: new Date().toISOString()
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsUpdating(false);
    }
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
            <div className="relative mb-4 group">
              <img 
                src={photoURL || user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                alt={user.displayName || 'User'} 
                className="h-32 w-32 rounded-full object-cover border-4 border-background shadow-xl"
                referrerPolicy="no-referrer"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-6 w-6 text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
              {isAdmin && (
                <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary border-4 border-background flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-background" />
                </div>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-3 w-full">
                <input 
                  className="w-full h-10 bg-background border rounded-xl px-4 text-center font-bold outline-none focus:ring-2 focus:ring-primary/20"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Display Name"
                />
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 rounded-full" onClick={handleUpdateProfile} disabled={isUpdating}>
                    {isUpdating ? '...' : 'Save'}
                  </Button>
                  <Button size="sm" variant="ghost" className="flex-1 rounded-full" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight">{user.displayName}</h1>
                  <button onClick={() => setIsEditing(true)} className="p-1 hover:bg-secondary rounded-full">
                    <Settings className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </>
            )}
            
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
                { id: 'orders', icon: Package, label: 'My Orders', sub: 'Track & manage', path: '/orders' },
                { id: 'settings', icon: Settings, label: 'Settings', sub: 'Address & Payments', path: '/settings' },
                { id: 'sell', icon: Store, label: 'Seller Hub', sub: 'Manage your shop', path: '/sell' },
                ...(isAdmin ? [{ id: 'admin', icon: ShieldCheck, label: 'Admin', sub: 'Manage Platform', path: '/admin' }] : [])
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group hover:bg-secondary/50"
                >
                  <tab.icon className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{tab.label}</p>
                    <p className="text-xs text-muted-foreground">{tab.sub}</p>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ))}
            </div>
        </div>

        {/* Main Content: Dashboard */}
        <div className="lg:col-span-2 space-y-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-primary text-primary-foreground p-10 rounded-[3rem] shadow-2xl shadow-primary/20 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
                  Welcome back, <br /> {user.displayName || 'Friend'}!
                </h2>
                <p className="text-primary-foreground/80 font-medium max-w-md">
                  Manage your orders, track your shipments, and update your preferences all in one place.
                </p>
                <div className="mt-8 flex gap-4">
                  <Button variant="secondary" className="rounded-full px-8" onClick={() => navigate('/products')}>
                    Start Shopping
                  </Button>
                </div>
              </div>
              <ShoppingBag className="absolute right-[-20px] bottom-[-20px] h-64 w-64 opacity-10 rotate-12" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card p-8 rounded-[2.5rem] border shadow-sm group hover:shadow-md transition-shadow">
                <Package className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">My Orders</h3>
                <p className="text-sm text-muted-foreground mb-6">View your order history and track active shipments.</p>
                <Button variant="outline" className="w-full rounded-full" onClick={() => navigate('/orders')}>
                  View Orders
                </Button>
              </div>
              <div className="bg-card p-8 rounded-[2.5rem] border shadow-sm group hover:shadow-md transition-shadow">
                <Store className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">Seller Hub</h3>
                <p className="text-sm text-muted-foreground mb-6">List your own products and manage your store.</p>
                <Button variant="outline" className="w-full rounded-full" onClick={() => navigate('/sell')}>
                  Go to Hub
                </Button>
              </div>
            </div>

            <div className="bg-secondary/20 p-8 rounded-[2.5rem] border border-dashed">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Recent Activity</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Updated just now</span>
              </div>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-background flex items-center justify-center mb-4">
                  <RefreshCcw className="h-6 w-6 text-muted-foreground opacity-20" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No recent activity to show.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
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
