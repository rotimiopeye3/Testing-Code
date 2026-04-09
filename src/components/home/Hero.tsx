import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-[#F5F5F5] dark:bg-card">
      <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="z-10 max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-6xl font-black uppercase italic leading-tight tracking-tighter md:text-9xl text-black"
            >
              Step into the <br />
              <span className="text-primary">Future.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Experience unparalleled comfort and style with our latest performance footwear collection.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 flex gap-6 justify-center"
            >
              <Button size="lg" className="rounded-full px-10 h-16 text-lg" asChild>
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg text-black" asChild>
                <Link to="/products?category=Running">New Arrivals</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
