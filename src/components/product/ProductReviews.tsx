import React, { useState } from 'react';
import { Star, Send, User } from 'lucide-react';
import { useReviews } from '@/hooks/useReviews';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductReviews({ productId }: { productId: string }) {
  const { reviews, addReview, loading } = useReviews(productId);
  const { user } = useAuthStore();
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to leave a review');
      return;
    }
    if (!newComment.trim()) return;

    await addReview({
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      rating,
      comment: newComment
    });
    setNewComment('');
    setRating(5);
  };

  return (
    <div className="mt-24">
      <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-10">Customer Reviews</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Review Form */}
        <div className="lg:col-span-1">
          <div className="bg-secondary/30 p-8 rounded-[2rem] border sticky top-24">
            <h3 className="text-xl font-bold mb-6">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star className={`h-6 w-6 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Thoughts</label>
                <textarea
                  required
                  placeholder="What did you think about this product?"
                  className="w-full bg-background rounded-2xl p-4 min-h-[120px] outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full h-14 rounded-full font-bold uppercase tracking-widest" disabled={!user}>
                {user ? <><Send className="mr-2 h-4 w-4" /> Post Review</> : 'Login to Review'}
              </Button>
            </form>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 bg-secondary/10 rounded-[2rem] border border-dashed">
              <p className="text-muted-foreground font-medium">No reviews yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card p-8 rounded-[2rem] border shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{review.userName}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {review.createdAt?.toDate().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`h-3 w-3 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
