'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useTheme } from './contexts/ThemeContext';

export default function Home() {
  const router = useRouter();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const supabase = createClientComponentClient();
    
    if (isSignup) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setError('Check your email for confirmation link!');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push('/Dashboard');
      }
    }
    
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-theme px-4">
      <div className="w-full max-w-md bg-card shadow-lg rounded-lg p-8 border border-theme">
        <h2 className="text-2xl font-bold mb-6 text-center text-card">
          {isSignup ? 'Sign Up' : 'Login'} to HRMS
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-muted">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-theme rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-input text-foreground transition-colors"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-muted">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-theme rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-input text-foreground transition-colors"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold py-2 rounded transition duration-200"
          >
            {loading ? 'Loading...' : (isSignup ? 'Sign Up' : 'Login')}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
            className="text-primary hover:text-primary/80 text-sm transition-colors"
          >
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
          </button>
        </div>
        <p className="text-xs text-muted mt-4 text-center">
          {isSignup 
            ? 'After signing up, check your email for confirmation.'
            : 'Tip: create a user in Supabase Auth with email/password to sign in.'
          }
        </p>
      </div>
    </div>
  );
}
