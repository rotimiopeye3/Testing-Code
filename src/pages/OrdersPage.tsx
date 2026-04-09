import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  ShoppingBag,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { orders, loading } = useOrders();

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">Login Required</h1>
        <Button onClick={() => navigate('/login')}>Login Now</Button>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'awaiting': return Clock;
      case 'confirmed': return CheckCircle2;
      case 'with_rider': return Truck;
      case 'delivered': return Package;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'awaiting': return 'text-orange-500 bg-orange-500/10';
      case 'confirmed': return 'text-blue-500 bg-blue-500/10';
      case 'with_rider': return 'text-purple-500 bg-purple-500/10';
      case 'delivered': return 'text-green-500 bg-green-500/10';
      default: return 'text-muted-foreground bg-secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter">My Orders</h1>
          </div>
          <div className="bg-secondary px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
            {orders.length} Orders
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-secondary animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border rounded-[2.5rem] overflow-hidden hover:shadow-xl transition-all duration-500"
              >
                <div className="p-8">
                  <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Order ID</div>
                      <div className="font-mono text-sm font-bold">#{order.id.slice(0, 8).toUpperCase()}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Placed On</div>
                      <div className="font-bold">{order.createdAt?.toDate().toLocaleDateString()}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Total Amount</div>
                      <div className="text-2xl font-black tracking-tighter">${order.total.toFixed(2)}</div>
                    </div>
                    <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 h-fit ${getStatusColor(order.status)}`}>
                      <span className="text-xs font-black uppercase tracking-widest">{order.status.replace('_', ' ')}</span>
                    </div>
                  </div>

                  {/* Items and Progress */}
                  <div className="space-y-8">
                    {order.items.map((item: any, idx: number) => {
                      const StatusIcon = getStatusIcon(item.status || 'awaiting');
                      return (
                        <div key={idx} className="bg-secondary/30 rounded-[2rem] p-6">
                          <div className="flex items-center gap-6 mb-6">
                            <div className="h-16 w-16 bg-background rounded-2xl flex items-center justify-center overflow-hidden border">
                              <ShoppingBag className="h-8 w-8 text-muted-foreground opacity-20" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold uppercase tracking-tight">{item.name}</h4>
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Qty: {item.quantity} • ${item.price}</p>
                            </div>
                            <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${getStatusColor(item.status || 'awaiting')}`}>
                              <StatusIcon className="h-3 w-3" />
                              <span className="text-[10px] font-black uppercase tracking-widest">{item.status?.replace('_', ' ') || 'Awaiting'}</span>
                            </div>
                          </div>

                          {/* Progress Tracker */}
                          <div className="relative pt-4 pb-2 px-4">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 rounded-full" />
                            <div className="relative flex justify-between">
                              {['awaiting', 'confirmed', 'with_rider', 'delivered'].map((step, sIdx) => {
                                const steps = ['awaiting', 'confirmed', 'with_rider', 'delivered'];
                                const currentIdx = steps.indexOf(item.status || 'awaiting');
                                const isCompleted = sIdx <= currentIdx;
                                const isCurrent = sIdx === currentIdx;

                                return (
                                  <div key={step} className="flex flex-col items-center gap-3 relative z-10">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-4 border-background transition-all duration-500 ${
                                      isCompleted ? 'bg-primary text-primary-foreground scale-110' : 'bg-border text-muted-foreground'
                                    }`}>
                                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-current" />}
                                    </div>
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${
                                      isCurrent ? 'text-primary' : 'text-muted-foreground'
                                    }`}>
                                      {step.replace('_', ' ')}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-card border-2 border-dashed rounded-[3rem] p-20 text-center space-y-6">
            <div className="bg-secondary h-20 w-20 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">No orders yet</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">You haven't placed any orders yet. Start shopping to see them here!</p>
            </div>
            <Button onClick={() => navigate('/')} className="rounded-full h-12 px-8">
              Start Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
