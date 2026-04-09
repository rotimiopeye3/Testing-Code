import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NAV_LINKS } from '@/lib/constants';
import { CartButton } from './CartButton';
import { MobileMenu } from './MobileMenu';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useSearchStore } from '@/store/useSearchStore';
import { useAdminData } from '@/hooks/useAdminData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Moon, Sun, Search, User, X, Megaphone, ShieldCheck } from 'lucide-react';

export function Navbar() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { query, setQuery } = useSearchStore();
  const { announcements } = useAdminData();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const activeAnnouncement = announcements[0];

  return (
    <div className="flex flex-col w-full sticky top-0 z-50">
      {activeAnnouncement && (
        <div className={cn(
          "w-full py-2 px-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2",
          activeAnnouncement.type === 'warning' ? "bg-orange-500 text-white" :
          activeAnnouncement.type === 'success' ? "bg-green-500 text-white" :
          "bg-primary text-primary-foreground"
        )}>
          <Megaphone className="h-3 w-3" />
          {activeAnnouncement.content}
        </div>
      )}
      <header className="w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Logo & Desktop Nav */}
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-black tracking-tighter transition-opacity hover:opacity-80">
            KICKS.
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.label} 
                to={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center bg-secondary rounded-full px-3 py-1 animate-in fade-in slide-in-from-right-4 duration-300">
                <Search className="h-4 w-4 text-muted-foreground mr-2" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search products..." 
                  className="bg-transparent border-none outline-none text-sm w-32 sm:w-48"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (window.location.pathname !== '/products') {
                      navigate('/products');
                    }
                  }}
                />
                <button onClick={() => { setIsSearchOpen(false); setQuery(''); }}>
                  <X className="h-4 w-4 text-muted-foreground ml-2" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-secondary rounded-full transition-colors" 
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
          </div>

          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          
          {user ? (
            <div className="flex items-center gap-2">
              {user.email === 'rotimiopeye3@gmail.com' && (
                <button 
                  onClick={() => navigate('/admin')}
                  className="p-2 hover:bg-secondary rounded-full transition-colors text-primary"
                  title="Admin Dashboard"
                >
                  <ShieldCheck className="h-5 w-5" />
                </button>
              )}
              <button 
                onClick={() => navigate('/profile')}
                className="overflow-hidden rounded-full border-2 border-transparent hover:border-primary transition-all"
                title="Profile"
              >
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                  alt="Profile" 
                  className="h-8 w-8 object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            </div>
          ) : (
            <Link to="/login" className="p-2 hover:bg-secondary rounded-full transition-colors" aria-label="Account">
              <User className="h-5 w-5" />
            </Link>
          )}
          
          <CartButton />
          
          <MobileMenu />
        </div>
      </div>
    </header>
  </div>
  );
}
