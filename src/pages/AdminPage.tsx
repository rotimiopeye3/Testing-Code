import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Megaphone, 
  Tag, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  X,
  ChevronRight,
  ArrowLeft,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminProducts } from '@/hooks/useProducts';
import { useAdminData } from '@/hooks/useAdminData';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';
import { Button } from '@/components/ui/button';

const ADMIN_EMAIL = 'rotimiopeye3@gmail.com';

export default function AdminPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { products, removeProduct } = useAdminProducts();
  const { 
    announcements, 
    discounts, 
    addAnnouncement, 
    deleteAnnouncement, 
    addDiscount, 
    toggleDiscount, 
    deleteDiscount 
  } = useAdminData({ includeDiscounts: true });
  const { settings, updateSettings } = usePlatformSettings();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'announcements' | 'discounts' | 'settings'>('overview');
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
  const [isAddDiscountOpen, setIsAddDiscountOpen] = useState(false);

  const [newAnnouncement, setNewAnnouncement] = useState({ content: '', type: 'info' as const });
  const [newDiscount, setNewDiscount] = useState({ code: '', percentage: 0, usageLimit: 0 });

  // Security Check
  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-16 w-16 text-destructive" />
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAnnouncement(newAnnouncement.content, newAnnouncement.type);
    setNewAnnouncement({ content: '', type: 'info' });
    setIsAddAnnouncementOpen(false);
  };

  const handleAddDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDiscount(newDiscount.code, newDiscount.percentage, newDiscount.usageLimit);
    setNewDiscount({ code: '', percentage: 0, usageLimit: 0 });
    setIsAddDiscountOpen(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Admin Control</h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">System Active</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar Nav */}
          <div className="lg:col-span-1 space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'products', label: 'Manage Products', icon: ShoppingBag },
              { id: 'announcements', label: 'Announcements', icon: Megaphone },
              { id: 'discounts', label: 'Discount Codes', icon: Tag },
              { id: 'settings', label: 'Platform Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02]' 
                    : 'hover:bg-secondary text-muted-foreground'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-bold uppercase tracking-widest text-sm">{tab.label}</span>
                {activeTab === tab.id && <ChevronRight className="ml-auto h-4 w-4" />}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <div className="bg-card p-8 rounded-[2rem] border shadow-sm">
                    <ShoppingBag className="h-8 w-8 text-primary mb-4" />
                    <div className="text-4xl font-black tracking-tighter">{products.length}</div>
                    <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Total Products</div>
                  </div>
                  <div className="bg-card p-8 rounded-[2rem] border shadow-sm">
                    <Megaphone className="h-8 w-8 text-primary mb-4" />
                    <div className="text-4xl font-black tracking-tighter">{announcements.length}</div>
                    <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Active Announcements</div>
                  </div>
                  <div className="bg-card p-8 rounded-[2rem] border shadow-sm">
                    <Tag className="h-8 w-8 text-primary mb-4" />
                    <div className="text-4xl font-black tracking-tighter">{discounts.length}</div>
                    <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Active Coupons</div>
                  </div>
                  <div className="bg-card p-8 rounded-[2rem] border shadow-sm">
                    <Settings className="h-8 w-8 text-primary mb-4" />
                    <div className="text-4xl font-black tracking-tighter">{settings.sellerFeePercentage}%</div>
                    <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Seller Fee</div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'products' && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">All Listed Products</h2>
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {products.length} Items Total
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((product) => (
                      <div key={product.id} className="bg-card p-4 rounded-3xl border flex items-center gap-4 group">
                        <img 
                          src={product.images?.[0] || 'https://picsum.photos/seed/product/200/200'} 
                          alt={product.name} 
                          className="h-20 w-20 rounded-2xl object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold truncate">{product.name}</h3>
                          <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">${product.price}</p>
                          <p className="text-xs text-muted-foreground truncate">Listed by: {product.sellerEmail || 'System'}</p>
                        </div>
                        <button 
                          onClick={() => removeProduct(product.id)}
                          className="p-3 text-destructive hover:bg-destructive/10 rounded-2xl transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'announcements' && (
                <motion.div
                  key="announcements"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Platform Announcements</h2>
                    <Button onClick={() => setIsAddAnnouncementOpen(true)} className="rounded-full">
                      <Plus className="h-4 w-4 mr-2" /> New Announcement
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="bg-card p-6 rounded-3xl border flex items-start gap-4">
                        <div className={`p-2 rounded-xl ${
                          ann.type === 'warning' ? 'bg-orange-500/10 text-orange-500' :
                          ann.type === 'success' ? 'bg-green-500/10 text-green-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          <Megaphone className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{ann.content}</p>
                          <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest font-bold">
                            {ann.createdAt?.toDate().toLocaleDateString()}
                          </p>
                        </div>
                        <button 
                          onClick={() => deleteAnnouncement(ann.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'discounts' && (
                <motion.div
                  key="discounts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Discount Codes</h2>
                    <Button onClick={() => setIsAddDiscountOpen(true)} className="rounded-full">
                      <Plus className="h-4 w-4 mr-2" /> Create Code
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {discounts.map((discount) => (
                      <div key={discount.id} className="bg-card p-6 rounded-3xl border flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black tracking-tighter">{discount.code}</span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              discount.active ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'
                            }`}>
                              {discount.active ? 'Active' : 'Paused'}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-primary mt-1">{discount.percentage}% OFF</p>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">
                            {discount.usageLimit ? `${discount.usedCount || 0}/${discount.usageLimit} Used` : 'Unlimited'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => toggleDiscount(discount.id, !discount.active)}
                            className="p-2 hover:bg-secondary rounded-xl transition-colors"
                          >
                            {discount.active ? <X className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          </button>
                          <button 
                            onClick={() => deleteDiscount(discount.id)}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter">Platform Settings</h2>
                  <div className="bg-card p-8 rounded-[2rem] border shadow-sm max-w-md">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Seller Fee Percentage (%)</label>
                        <div className="flex gap-4">
                          <input 
                            type="number"
                            min="0"
                            max="100"
                            className="flex-1 h-14 bg-secondary rounded-2xl px-6 outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                            value={settings.sellerFeePercentage}
                            onChange={(e) => updateSettings({ ...settings, sellerFeePercentage: parseInt(e.target.value) || 0 })}
                          />
                          <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center font-black text-primary">
                            %
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2">
                          This percentage will be displayed to sellers when they list an item.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isAddAnnouncementOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card w-full max-w-md rounded-[2.5rem] p-8 border shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">New Announcement</h3>
                <button onClick={() => setIsAddAnnouncementOpen(false)} className="p-2 hover:bg-secondary rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddAnnouncement} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Content</label>
                  <textarea 
                    required
                    className="w-full bg-secondary rounded-2xl p-4 min-h-[100px] outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Type your announcement here..."
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['info', 'warning', 'success'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewAnnouncement({ ...newAnnouncement, type: type as any })}
                        className={`py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${
                          newAnnouncement.type === type ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold uppercase tracking-widest">
                  Post Announcement
                </Button>
              </form>
            </motion.div>
          </div>
        )}

        {isAddDiscountOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card w-full max-w-md rounded-[2.5rem] p-8 border shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Create Coupon</h3>
                <button onClick={() => setIsAddDiscountOpen(false)} className="p-2 hover:bg-secondary rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddDiscount} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Coupon Code</label>
                  <input 
                    required
                    type="text"
                    className="w-full h-14 bg-secondary rounded-2xl px-6 outline-none focus:ring-2 focus:ring-primary/20 font-black tracking-widest uppercase"
                    placeholder="SUMMER25"
                    value={newDiscount.code}
                    onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Percentage Off</label>
                  <input 
                    required
                    type="number"
                    min="1"
                    max="100"
                    className="w-full h-14 bg-secondary rounded-2xl px-6 outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                    placeholder="25"
                    value={newDiscount.percentage || ''}
                    onChange={(e) => setNewDiscount({ ...newDiscount, percentage: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Usage Limit (0 for unlimited)</label>
                  <input 
                    type="number"
                    min="0"
                    className="w-full h-14 bg-secondary rounded-2xl px-6 outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                    placeholder="100"
                    value={newDiscount.usageLimit || ''}
                    onChange={(e) => setNewDiscount({ ...newDiscount, usageLimit: parseInt(e.target.value) })}
                  />
                </div>
                <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold uppercase tracking-widest">
                  Generate Code
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
