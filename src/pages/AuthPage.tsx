import { useState } from 'react';
import { motion } from 'motion/react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-[32px] p-10 relative z-10 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-600 p-3 rounded-2xl mb-6 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Access Vault</h1>
          <p className="text-zinc-500 text-center mt-2 font-medium">Verify your identity to proceed</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs mb-6 font-mono uppercase tracking-wider text-center">
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition-all disabled:opacity-50 group"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          {loading ? 'Initializing...' : 'Continue with Google'}
          {!loading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
        </button>

        <div className="mt-10 pt-10 border-t border-zinc-800 flex flex-col items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1 bg-zinc-950 rounded-full border border-zinc-800">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
             <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">End-to-End Encryption Active</span>
           </div>
           <p className="text-center text-[10px] text-zinc-600 font-mono uppercase tracking-[0.2em] leading-relaxed max-w-[240px]">
             Authorized personnel only. All access attempts are logged.
           </p>
        </div>
      </motion.div>
    </div>
  );
}
