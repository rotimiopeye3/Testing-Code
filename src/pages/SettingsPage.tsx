import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Moon, 
  HelpCircle,
  LogOut,
  ChevronRight,
  Camera,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  Smartphone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { logout, db, auth } from '@/lib/firebase';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { cn, compressImage } from '@/lib/utils';
import { useProfileData } from '@/hooks/useProfileData';
import { usePreferences } from '@/hooks/usePreferences';
import { Plus, Trash2, CreditCard as CardIcon, Check, Languages } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { payments, addPayment, removePayment } = useProfileData();
  const { preferences, updatePreferences } = usePreferences();

  // Form states
  const [displayName, setDisplayName] = React.useState(user?.displayName || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [photoURL, setPhotoURL] = React.useState(user?.photoURL || '');
  const [newPassword, setNewPassword] = React.useState('');

  // Payment form state
  const [newCard, setNewCard] = React.useState({ last4: '', expiry: '', brand: 'VISA' });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setIsUpdating(true);
    setMessage(null);

    try {
      // Update Firebase Auth
      await updateProfile(auth.currentUser, { displayName, photoURL });
      
      // Update Firestore
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, { 
        displayName, 
        photoURL,
        updatedAt: new Date().toISOString()
      });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setIsUpdating(true);
    setMessage(null);

    try {
      if (email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, email);
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { email });
      }
      if (newPassword) {
        await updatePassword(auth.currentUser, newPassword);
      }
      setMessage({ type: 'success', text: 'Security settings updated!' });
      setNewPassword('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsUpdating(false);
    }
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

  const settingsSections = [
    {
      id: "profile",
      title: "Account",
      items: [
        { icon: User, label: "Profile Information", description: "Name, email, and profile photo", action: () => setActiveSection('profile') },
        { icon: Shield, label: "Security", description: "Password and authentication", action: () => setActiveSection('security') },
        { icon: CreditCard, label: "Payment Methods", description: "Manage your cards and billing", action: () => setActiveSection('payments') }
      ]
    },
    {
      title: "Preferences",
      items: [
        { icon: Bell, label: "Notifications", description: "Email and push alerts", action: () => setActiveSection('notifications') },
        { icon: Globe, label: "Language", description: preferences.language, action: () => setActiveSection('language') },
        { icon: Moon, label: "Appearance", description: preferences.appearance.charAt(0).toUpperCase() + preferences.appearance.slice(1), action: () => setActiveSection('appearance') }
      ]
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help Center", description: "FAQs and customer support", path: "#" },
        { icon: Shield, label: "Privacy Policy", description: "How we handle your data", path: "#" }
      ]
    }
  ];

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">Login Required</h1>
        <Button onClick={() => navigate('/login')}>Login Now</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter">Settings</h1>
        </div>

        {/* Profile Quick View */}
        <div className="bg-card border rounded-[2.5rem] p-8 mb-10 flex items-center gap-6">
          <div className="relative group">
            <img 
              src={user.photoURL || 'https://picsum.photos/seed/user/200/200'} 
              alt={user.displayName}
              className="h-20 w-20 rounded-full object-cover border-4 border-background shadow-xl"
              referrerPolicy="no-referrer"
            />
            <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-3 w-3" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black tracking-tighter">{user.displayName}</h2>
            <p className="text-muted-foreground font-medium">{user.email}</p>
          </div>
          <Button variant="secondary" className="rounded-full h-10 px-6" onClick={() => navigate('/profile')}>
            Edit
          </Button>
        </div>

        {/* Settings List */}
        <div className="space-y-10">
          {settingsSections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground ml-4">
                {section.title}
              </h3>
              <div className="bg-card border rounded-[2.5rem] overflow-hidden">
                {section.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={() => item.action ? item.action() : (item.path !== '#' && navigate(item.path))}
                    className={`w-full flex items-center gap-4 p-6 hover:bg-secondary/50 transition-colors text-left ${
                      itemIdx !== section.items.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div className="bg-secondary h-12 w-12 rounded-2xl flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm uppercase tracking-widest">{item.label}</div>
                      <div className="text-xs text-muted-foreground font-medium">{item.description}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          <Button 
            variant="destructive" 
            className="w-full h-16 rounded-[2rem] text-lg font-bold uppercase tracking-widest gap-2"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            <LogOut className="h-5 w-5" /> Sign Out
          </Button>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {activeSection === 'profile' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card w-full max-w-md rounded-[2.5rem] p-8 border shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Edit Profile</h3>
                <button onClick={() => setActiveSection(null)} className="p-2 hover:bg-secondary rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </div>

              {message && (
                <div className={cn(
                  "p-4 rounded-2xl flex items-center gap-3 text-sm font-bold",
                  message.type === 'success' ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
                )}>
                  {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <img 
                      src={photoURL || 'https://picsum.photos/seed/user/200/200'} 
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover border-4 border-background shadow-xl"
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="h-6 w-6 text-white" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Click to change photo</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Display Name</label>
                    <input 
                      className="w-full h-14 bg-secondary border rounded-2xl px-6 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                    />
                  </div>
                </div>

                <Button disabled={isUpdating} className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest">
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </motion.div>
          </div>
        )}

        {activeSection === 'security' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card w-full max-w-md rounded-[2.5rem] p-8 border shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Security</h3>
                <button onClick={() => setActiveSection(null)} className="p-2 hover:bg-secondary rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </div>

              {message && (
                <div className={cn(
                  "p-4 rounded-2xl flex items-center gap-3 text-sm font-bold",
                  message.type === 'success' ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
                )}>
                  {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleUpdateSecurity} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="email"
                        className="w-full h-14 bg-secondary border rounded-2xl pl-14 pr-6 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="password"
                        placeholder="Leave blank to keep current"
                        className="w-full h-14 bg-secondary border rounded-2xl pl-14 pr-6 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Button disabled={isUpdating} className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest">
                  {isUpdating ? 'Updating...' : 'Update Security'}
                </Button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Payments Modal */}
        {activeSection === 'payments' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card w-full max-w-md rounded-[2.5rem] p-8 border shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Payment Methods</h3>
                <button onClick={() => setActiveSection(null)} className="p-2 hover:bg-secondary rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {payments.map((card) => (
                  <div key={card.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-xl">
                        <CardIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{card.brand} •••• {card.last4}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Expires {card.expiry}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removePayment(card.id)}
                      className="p-2 hover:bg-destructive/10 text-destructive rounded-full transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                <div className="pt-4 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Add New Card</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      placeholder="Last 4 Digits"
                      maxLength={4}
                      className="h-12 bg-secondary border rounded-xl px-4 text-sm font-bold outline-none"
                      value={newCard.last4}
                      onChange={e => setNewCard({...newCard, last4: e.target.value})}
                    />
                    <input 
                      placeholder="MM/YY"
                      className="h-12 bg-secondary border rounded-xl px-4 text-sm font-bold outline-none"
                      value={newCard.expiry}
                      onChange={e => setNewCard({...newCard, expiry: e.target.value})}
                    />
                  </div>
                  <select 
                    className="w-full h-12 bg-secondary border rounded-xl px-4 text-sm font-bold outline-none appearance-none"
                    value={newCard.brand}
                    onChange={e => setNewCard({...newCard, brand: e.target.value})}
                  >
                    <option value="VISA">VISA</option>
                    <option value="MASTERCARD">MASTERCARD</option>
                    <option value="AMEX">AMEX</option>
                  </select>
                  <Button 
                    className="w-full h-12 rounded-xl font-bold uppercase tracking-widest gap-2"
                    onClick={() => {
                      if (newCard.last4 && newCard.expiry) {
                        addPayment(newCard);
                        setNewCard({ last4: '', expiry: '', brand: 'VISA' });
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" /> Add Card
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Notifications Modal */}
        {activeSection === 'notifications' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card w-full max-w-md rounded-[2.5rem] p-8 border shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Notifications</h3>
                <button onClick={() => setActiveSection(null)} className="p-2 hover:bg-secondary rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                  { key: 'push', label: 'Push Notifications', desc: 'Receive alerts on your device' },
                  { key: 'orders', label: 'Order Updates', desc: 'Real-time tracking alerts' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border">
                    <div>
                      <p className="font-bold text-sm">{item.label}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => updatePreferences({ 
                        notifications: { 
                          ...preferences.notifications, 
                          [item.key]: !preferences.notifications[item.key as keyof typeof preferences.notifications] 
                        } 
                      })}
                      className={cn(
                        "w-12 h-6 rounded-full transition-colors relative",
                        preferences.notifications[item.key as keyof typeof preferences.notifications] ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <motion.div 
                        animate={{ x: preferences.notifications[item.key as keyof typeof preferences.notifications] ? 24 : 4 }}
                        className="absolute top-1 left-0 h-4 w-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Language Modal */}
        {activeSection === 'language' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card w-full max-w-md rounded-[2.5rem] p-8 border shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-black">Select Language</h3>
                <button onClick={() => setActiveSection(null)} className="p-2 hover:bg-secondary rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                {['English (US)', 'French', 'Spanish', 'German', 'Chinese'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      updatePreferences({ language: lang });
                      setActiveSection(null);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl transition-colors",
                      preferences.language === lang ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Languages className="h-4 w-4" />
                      <span className="font-bold text-sm">{lang}</span>
                    </div>
                    {preferences.language === lang && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Appearance Modal */}
        {activeSection === 'appearance' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card w-full max-w-md rounded-[2.5rem] p-8 border shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-black">Appearance</h3>
                <button onClick={() => setActiveSection(null)} className="p-2 hover:bg-secondary rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'light', icon: Moon, label: 'Light' },
                  { id: 'dark', icon: Moon, label: 'Dark' },
                  { id: 'system', icon: Globe, label: 'System' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => updatePreferences({ appearance: mode.id as any })}
                    className={cn(
                      "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all",
                      preferences.appearance === mode.id 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "border-transparent bg-secondary/50 hover:bg-secondary"
                    )}
                  >
                    <mode.icon className="h-6 w-6" />
                    <span className="text-xs font-bold uppercase tracking-widest">{mode.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
