import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-[#F5F5F5] dark:bg-card">
      <div className="container mx-auto flex h-full items-center px-4 sm:px-6 lg:px-8">
        <div className="z-10 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl font-black uppercase italic leading-tight tracking-tighter md:text-8xl text-black"
          >
            Step into the <br />
            <span className="text-primary">Future.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground"
          >
            Experience unparalleled comfort and style with our latest performance footwear collection.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex gap-4"
          >
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link to="/products">Shop Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 text-black" asChild>
              <Link to="/products?category=Running">New Arrivals</Link>
            </Button>
          </motion.div>
        </div>

        {/* Hero Image Overlay */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute right-[-10%] top-1/2 hidden h-[120%] w-[70%] -translate-y-1/2 lg:block"
        >
          <img 
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2000" 
            alt="Hero Shoe"
            className="h-full w-full object-contain drop-shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>
    </section>
  );
}
