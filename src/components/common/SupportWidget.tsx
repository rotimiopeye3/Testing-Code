import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Hi! How can we help you today?' }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newChat = [...chat, { role: 'user' as const, text: message }];
    setChat(newChat);
    setMessage('');

    // Simple bot response simulation
    setTimeout(() => {
      setChat([...newChat, { 
        role: 'bot' as const, 
        text: "I've received your message! You can also email me directly at rotimiopeye3@gmail.com for a faster response." 
      }]);
    }, 1000);
  };

  const handleEmailDirect = () => {
    const subject = encodeURIComponent("Support Request from KICKS Store");
    const body = encodeURIComponent(chat.filter(m => m.role === 'user').map(m => m.text).join('\n\n'));
    window.location.href = `mailto:rotimiopeye3@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-80 sm:w-96 bg-card border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary p-6 text-primary-foreground">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Live Support</h3>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">We usually reply in minutes</p>
              <Button 
                variant="secondary" 
                size="sm" 
                className="mt-4 w-full rounded-xl text-[10px] font-black uppercase tracking-widest"
                onClick={handleEmailDirect}
              >
                Email Me Directly
              </Button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 h-96 overflow-y-auto p-6 space-y-4 bg-secondary/10">
              {chat.map((msg, idx) => (
                <div key={idx} className={cn(
                  "flex items-end gap-2",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                    msg.role === 'user' ? "bg-primary" : "bg-secondary border"
                  )}>
                    {msg.role === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-primary" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm font-medium",
                    msg.role === 'user' ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card border rounded-bl-none"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-card border-t flex gap-2">
              <input 
                placeholder="Type a message..."
                className="flex-1 bg-secondary border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button type="submit" size="icon" className="rounded-xl h-10 w-10">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-16 w-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95",
          isOpen ? "bg-card border text-primary" : "bg-primary text-primary-foreground"
        )}
      >
        {isOpen ? <X className="h-8 w-8" /> : <MessageCircle className="h-8 w-8" />}
      </button>
    </div>
  );
}
