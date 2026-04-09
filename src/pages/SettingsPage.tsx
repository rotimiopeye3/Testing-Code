import React from 'react';
import { motion } from 'framer-motion';
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
  Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { logout } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const settingsSections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Profile Information", description: "Name, email, and profile photo", path: "/profile" },
        { icon: Shield, label: "Security", description: "Password and authentication", path: "#" },
        { icon: CreditCard, label: "Payment Methods", description: "Manage your cards and billing", path: "#" }
      ]
    },
    {
      title: "Preferences",
      items: [
        { icon: Bell, label: "Notifications", description: "Email and push alerts", path: "#" },
        { icon: Globe, label: "Language", description: "English (US)", path: "#" },
        { icon: Moon, label: "Appearance", description: "Light Mode", path: "#" }
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
                    onClick={() => item.path !== '#' && navigate(item.path)}
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
    </div>
  );
}
