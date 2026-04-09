import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Upload, 
  DollarSign, 
  Tag, 
  Users, 
  Type, 
  FileText,
  CheckCircle2,
  AlertCircle,
  Package,
  Plus,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserProducts } from '@/hooks/useProducts';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';
import { Button } from '@/components/ui/button';
import { compressImage } from '@/lib/utils';

export default function ListProductPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { addProduct } = useUserProducts();
  const { settings } = usePlatformSettings();

  const [formData, setFormData] = useState({ 
    name: '', 
    price: '', 
    category: 'Clothing', 
    targetAudience: 'Men',
    description: '',
    images: [] as string[],
    stock: '1'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!user) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="h-16 w-16 text-primary" />
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">Access Denied</h1>
        <p className="text-muted-foreground">Please login to list products.</p>
        <Button onClick={() => navigate('/login')}>Login Now</Button>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      filesArray.forEach((file: File) => {
        if (formData.images.length >= 4) return;
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          const compressed = await compressImage(base64);
          setFormData(prev => ({ 
            ...prev, 
            images: [...prev.images, compressed].slice(0, 4) 
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addProduct({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'],
        brand: 'User Listed',
        sizes: [7, 8, 9, 10, 11, 12] // Default sizes for footwear/clothing
      });
      setIsSuccess(true);
      setTimeout(() => navigate('/sell'), 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 text-center bg-background">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="h-24 w-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/40"
        >
          <CheckCircle2 className="h-12 w-12" />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">Product Listed!</h2>
          <p className="text-muted-foreground">Your item is now live on the marketplace.</p>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary animate-pulse">Redirecting to dashboard...</p>
      </div>
    );
  }

  const fee = settings.sellerFeePercentage;
  const price = parseFloat(formData.price) || 0;
  const platformFee = price * (fee / 100);
  const earnings = price - platformFee;

  return (
    <div className="min-h-screen bg-background pb-20 pt-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <button 
          onClick={() => navigate('/sell')}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-widest text-sm">Back to Hub</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-2">
              <h1 className="text-5xl font-black uppercase italic tracking-tighter">List Your Item</h1>
              <p className="text-muted-foreground font-medium">Fill in the details below to reach potential buyers.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">
                    <Type className="h-3 w-3" /> Product Name
                  </label>
                  <input 
                    required
                    placeholder="e.g. Vintage Leather Jacket"
                    className="w-full h-14 bg-card border rounded-2xl px-6 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">
                      <DollarSign className="h-3 w-3" /> Price ($)
                    </label>
                    <input 
                      required
                      type="number"
                      min="1"
                      placeholder="99.99"
                      className="w-full h-14 bg-card border rounded-2xl px-6 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">
                      <Tag className="h-3 w-3" /> Category
                    </label>
                    <select 
                      className="w-full h-14 bg-card border rounded-2xl px-6 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold appearance-none"
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
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">
                      <Package className="h-3 w-3" /> Stock Quantity
                    </label>
                    <input 
                      required
                      type="number"
                      min="1"
                      placeholder="10"
                      className="w-full h-14 bg-card border rounded-2xl px-6 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">
                      <Users className="h-3 w-3" /> Target Audience
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Men', 'Women', 'Kids'].map(target => (
                        <button
                          key={target}
                          type="button"
                          onClick={() => setFormData({...formData, targetAudience: target})}
                          className={`h-12 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${
                            formData.targetAudience === target 
                              ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' 
                              : 'bg-card hover:bg-secondary'
                          }`}
                        >
                          {target}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">
                      <Upload className="h-3 w-3" /> Product Images (Max 4)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border bg-secondary group">
                          <img src={img} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <button 
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {formData.images.length < 4 && (
                        <label className="aspect-square flex flex-col items-center justify-center border border-dashed rounded-xl cursor-pointer hover:bg-secondary/50 transition-all">
                          <Plus className="h-5 w-5 text-muted-foreground" />
                          <input 
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">
                    <FileText className="h-3 w-3" /> Description
                  </label>
                  <textarea 
                    required
                    placeholder="Describe your item's condition, size, and features..."
                    className="w-full min-h-[150px] bg-card border rounded-2xl p-6 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-16 rounded-2xl text-xl font-black uppercase italic tracking-tighter shadow-2xl shadow-primary/20"
              >
                {isSubmitting ? 'Listing Item...' : 'List Product Now'}
              </Button>
            </form>
          </div>

          {/* Right Column: Preview & Earnings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Earnings Card */}
              <div className="bg-primary text-primary-foreground p-8 rounded-[2.5rem] shadow-2xl shadow-primary/30 space-y-6">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Earnings Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center opacity-80">
                    <span className="text-sm font-bold uppercase tracking-widest">Listing Price</span>
                    <span className="text-xl font-black">${price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-red-300">
                    <span className="text-sm font-bold uppercase tracking-widest">Platform Fee ({fee}%)</span>
                    <span className="text-xl font-black">-${platformFee.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-primary-foreground/20 my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold uppercase tracking-widest">You Receive</span>
                    <span className="text-4xl font-black tracking-tighter">${earnings.toFixed(2)}</span>
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                  Fees are automatically deducted from the final sale price. Payouts are processed within 24-48 hours of delivery.
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="bg-card border rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="aspect-square bg-secondary relative overflow-hidden">
                  {formData.images.length > 0 ? (
                    <img 
                      src={formData.images[0]} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-12 w-12 opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Live Preview
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h4 className="font-bold text-lg truncate">{formData.name || 'Product Name'}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{formData.category}</span>
                    <span className="text-xl font-black tracking-tighter">${formData.price || '0'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
  );
}
