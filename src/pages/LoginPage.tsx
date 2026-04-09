import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { signInWithGoogle } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-20">
      <div className="w-full max-w-md space-y-8 rounded-3xl border bg-card p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">KICKS.</h1>
          <h2 className="mt-4 text-2xl font-bold">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account to access exclusive drops and your orders.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Button 
            onClick={handleLogin}
            className="w-full h-12 rounded-full font-bold uppercase tracking-wider"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full h-12 rounded-full font-bold uppercase tracking-wider" disabled>
            Email & Password (Coming Soon)
          </Button>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
