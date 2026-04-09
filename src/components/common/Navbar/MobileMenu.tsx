'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NAV_LINKS } from '@/lib/constants';
import { Link } from 'react-router-dom';

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 md:hidden" aria-label="Open Menu">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px]">
        <SheetHeader>
          <SheetTitle className="text-left text-2xl font-black tracking-tighter">
            KICKS.
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-lg font-semibold hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
