'use client';

import { useState } from 'react';
import { useAuthStore } from '@/core/auth-store';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import apiClient from '@/core/api-client';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', { username, password });
      const { user, token } = response.data;
      
      setAuth(user, token);
      
      // Delay ເລັກໜ້ອຍເພື່ອໃຫ້ Browser ຈັດການ Cookies ທີ່ MSW ສົ່ງມາ
      setTimeout(() => {
        router.replace('/pos');
      }, 100);
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0d] flex items-center justify-center p-6 bg-gradient-to-br from-[#0f1115] to-[#090a0d]">
      <div className="max-w-md w-full bg-[#12141a] border border-white/5 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/40 mb-4 animate-bounce-slow">
            <span className="text-3xl font-bold italic text-white leading-none">Y99</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin or staff"
              className="w-full bg-[#1a1d26] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-slate-600"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1a1d26] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-slate-600"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={20} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-10 grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Admin Demo</p>
            <p className="text-xs text-white">admin / 1234</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Staff Demo</p>
            <p className="text-xs text-white">staff / 1234</p>
          </div>
        </div>
      </div>
    </div>
  );
}
