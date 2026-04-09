import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { FOOTER_LINKS } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t mt-auto">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand & Newsletter */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="text-2xl font-black tracking-tighter">
              KICKS.
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Premium products designed for the modern lifestyle. Join our newsletter for early access to drops.
            </p>
            <div className="flex gap-2 max-w-sm">
              <Input placeholder="Email address" className="rounded-full bg-background" />
              <Button className="rounded-full">Join</Button>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
                {category}
              </h4>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t pt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} KICKS Inc. All rights reserved. Built for performance.
          </p>
          
          <div className="flex items-center gap-6">
            <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Youtube className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
