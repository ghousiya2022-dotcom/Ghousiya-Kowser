import { motion } from 'motion/react';
import { Shield, Activity, Calendar, Lock, ArrowRight, UserPlus, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] font-sans text-[#e4e4e7] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Shield className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white uppercase">Med<span className="text-blue-500">Vault</span></span>
        </div>
        <div className="flex gap-4">
          <Link to="/auth" className="text-sm font-medium px-4 py-2 text-zinc-400 hover:text-white transition-colors">Login</Link>
          <Link to="/auth" className="text-sm font-medium bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            <Activity className="w-3 h-3" />
            Decentralized Encryption
          </div>
          <h1 className="text-5xl lg:text-8xl font-bold leading-[0.9] mb-8 tracking-tighter text-white">
            Future of <br />
            <span className="text-blue-600">Health Data.</span>
          </h1>
          <p className="text-lg text-zinc-400 mb-10 max-w-md leading-relaxed">
            A high-fidelity vault for your medical identity. Secure, encrypted, and instantly accessible to verified professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/auth" className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-zinc-200 transition-all group">
              Initialize Vault
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/auth" className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-white px-8 py-4 rounded-xl font-bold hover:border-zinc-700 transition-all">
              Doctor Console
            </Link>
          </div>
        </motion.div>

        <div className="relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 relative z-10"
          >
             {[
               { icon: Activity, label: "Neural Vitals", color: "text-emerald-500", bg: "bg-emerald-500/5" },
               { icon: Lock, label: "E2E Encrypted", color: "text-blue-500", bg: "bg-blue-500/5" },
               { icon: Calendar, label: "Node Sync", color: "text-orange-500", bg: "bg-orange-500/5" },
               { icon: UserPlus, label: "Quick Onboard", color: "text-purple-500", bg: "bg-purple-500/5" }
             ].map((item, i) => (
               <motion.div 
                 key={i}
                 whileHover={{ y: -5, borderColor: "rgba(59,130,246,0.3)" }}
                 className="bg-zinc-900/50 backdrop-blur-sm p-6 rounded-3xl border border-zinc-800 shadow-2xl flex flex-col gap-6"
               >
                 <div className={`${item.bg} ${item.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                   <item.icon className="w-6 h-6" />
                 </div>
                 <div className="space-y-1">
                    <span className="font-bold text-sm text-white">{item.label}</span>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Status: Optimal</p>
                 </div>
               </motion.div>
             ))}
          </motion.div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 p-12 rounded-[40px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl transition-all group-hover:bg-blue-600/10"></div>
              <UserPlus className="w-12 h-12 text-blue-500 mb-8" />
              <h3 className="text-3xl font-bold text-white mb-4">Patient Vault</h3>
              <p className="text-zinc-400 mb-8 leading-relaxed">Complete control over your records. Share temporary access tokens with specialists.</p>
              <div className="flex flex-wrap gap-3">
                 <span className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-500">BLOOD DATA</span>
                 <span className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-500">HISTORY</span>
                 <span className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-500">PRESCRIPTIONS</span>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-12 rounded-[40px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl transition-all group-hover:bg-emerald-500/10"></div>
              <Stethoscope className="w-12 h-12 text-emerald-500 mb-8" />
              <h3 className="text-3xl font-bold text-white mb-4">Medical Console</h3>
              <p className="text-zinc-400 mb-8 leading-relaxed">Next-generation dashboard for healthcare providers. Unified view of verified patient histories.</p>
              <div className="flex flex-wrap gap-3">
                 <span className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-500">SECURE LOGS</span>
                 <span className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-500">VERIFICATION</span>
                 <span className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-500">ANALYTICS</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
