import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile, PatientData } from '../types';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Shield, LogOut, Activity, Calendar, Clock, FileText, User, MapPin, ArrowRight, Bell } from 'lucide-react';
import { cn } from '../lib/utils';
import { QRCodeSVG } from 'qrcode.react';
import Reminders from '../components/Reminders';

export default function PatientDashboard({ user }: { user: UserProfile }) {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      const path = `users/${user.uid}/patientDetails/basic`;
      try {
        const docRef = doc(db, path);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setPatientData(snap.data() as PatientData);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, path);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [user.uid]);

  const handleLogout = () => signOut(auth);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#e4e4e7] flex flex-col font-sans p-4 md:p-8">
      {/* Header Navigation */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white uppercase">MED<span className="text-blue-500">VAULT</span></span>
        </div>
        
        <div className="hidden md:flex bg-zinc-900/80 p-1 rounded-full border border-zinc-800">
          <button className="px-6 py-2 rounded-full bg-blue-600 text-white text-xs font-bold transition-all shadow-lg">Patient View</button>
          <button className="px-6 py-2 rounded-full text-zinc-400 text-xs font-bold hover:text-white transition-all">Console</button>
        </div>

        <div className="flex gap-4">
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-zinc-900 rounded-lg border border-zinc-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Secure Cloud Active</span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-red-500 transition-all hover:bg-red-500/5 hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Bento Grid Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-6 flex-grow max-w-7xl mx-auto w-full">
        
        {/* Welcome & Identity Card */}
        <div className="col-span-1 md:col-span-8 md:row-span-2 bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-all group-hover:bg-blue-600/20"></div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Welcome back, <span className="text-blue-400">{user.displayName?.split(' ')[0]}</span></h1>
            <p className="text-zinc-400 max-w-md text-xs md:text-sm font-medium leading-relaxed">Your health data is synchronized across the MedVault network. You have 2 encrypted records pending review.</p>
          </div>
          <div className="flex gap-4 md:gap-8 mt-6">
            <div className="flex flex-col">
              <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-zinc-500 mb-1 font-bold">Node Identity</span>
              <span className="font-mono text-white text-xs">MV-{user.uid.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-zinc-500 mb-1 font-bold">Protocol Status</span>
              <span className="font-mono text-emerald-500 text-xs flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                SYNCED
              </span>
            </div>
          </div>
        </div>

        {/* QR Access Vault Card */}
        <div className="col-span-1 md:col-span-4 md:row-span-3 bg-gradient-to-br from-zinc-900 to-blue-950/20 border border-zinc-800 rounded-[32px] p-8 flex flex-col items-center justify-center relative overflow-hidden group">
           <div className="absolute top-4 left-4">
              <span className="text-[9px] px-2 py-1 bg-white/5 text-zinc-400 rounded-md font-mono uppercase tracking-widest">Vault QR Root</span>
           </div>
           
           <div className="p-4 bg-white rounded-3xl shadow-[0_0_40px_rgba(37,99,235,0.2)] group-hover:shadow-[0_0_50px_rgba(37,99,235,0.3)] transition-all group-hover:scale-110">
              <QRCodeSVG 
                value={`medvault:user:${user.uid}`} 
                size={160}
                level="H"
                includeMargin={true}
              />
           </div>

           <div className="mt-8 text-center">
              <h4 className="text-white font-bold text-lg mb-2">Access Key Override</h4>
              <p className="text-zinc-500 text-xs max-w-[200px] leading-relaxed mx-auto">
                Present this code to your physician to instantly authorize medical file decryption.
              </p>
           </div>
           <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl transition-opacity opacity-0 group-hover:opacity-100"></div>
        </div>

        {/* Profile Details Card */}
        <div className="col-span-1 md:col-span-4 md:row-span-4 bg-zinc-900 border border-zinc-800 rounded-[32px] p-7 flex flex-col shadow-2xl relative overflow-hidden lg:order-none order-last md:order-none">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h3 className="font-bold text-white uppercase text-[10px] tracking-[0.2em] opacity-50">Vault Profile</h3>
            <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-bold uppercase tracking-wider">Verified</span>
          </div>
          
          <div className="space-y-4 relative z-10">
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/50">
              <div className="text-[9px] text-zinc-500 mb-1 uppercase font-bold tracking-widest">Legal Name</div>
              <div className="text-white font-medium">{user.displayName}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/50">
                <div className="text-[9px] text-zinc-500 mb-1 uppercase font-bold tracking-widest">Blood Type</div>
                <div className="text-rose-500 font-bold text-xl uppercase tracking-tighter">{patientData?.bloodGroup || '--'}</div>
              </div>
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/50">
                <div className="text-[9px] text-zinc-500 mb-1 uppercase font-bold tracking-widest">Age / Gender</div>
                <div className="text-white font-bold text-xl uppercase tracking-tighter">{patientData?.age || '0'} / {patientData?.gender?.charAt(0) || '-'}</div>
              </div>
            </div>

            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/50">
              <div className="text-[9px] text-zinc-500 mb-1 uppercase font-bold tracking-widest">Identity Root</div>
              <div className="text-zinc-400 font-mono text-[10px] truncate">{user.email}</div>
            </div>

            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/50">
              <div className="text-[9px] text-zinc-500 mb-1 uppercase font-bold tracking-widest">Physical Address</div>
              <div className="text-zinc-300 font-medium text-xs leading-relaxed truncate">{patientData?.address}</div>
            </div>
          </div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl"></div>
        </div>

        {/* Reminders Card */}
        <div className="col-span-1 md:col-span-4 md:row-span-3 bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 group">
           <Reminders />
        </div>

        {/* Vitality Metrics */}
        <div className="col-span-1 md:col-span-4 md:row-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-[32px] p-6 group">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-all">
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Vitality Scan</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white tracking-tighter">72 BPM</div>
              <div className="text-[10px] text-emerald-500 font-bold uppercase mt-2 tracking-widest flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                NOMINAL / SECURE
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Context */}
        <div className="col-span-1 md:col-span-4 md:row-span-2 bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
               <div className="p-2.5 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-all text-blue-500">
                 <User className="w-5 h-5" />
               </div>
               <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Next Consultation</span>
             </div>
             <Calendar className="w-4 h-4 text-zinc-600" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-xl shadow-blue-900/40 text-lg md:text-xl">
              AT
            </div>
            <div>
              <div className="text-white font-bold text-sm md:text-base">Dr. Aris Thorne</div>
              <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">Cardiology Specialist</div>
              <div className="flex items-center gap-2 mt-3 text-emerald-500">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] font-mono tracking-tighter">May 12 • 09:30 AM</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16"></div>
        </div>

      </div>

      {/* Grid Footer */}
      <footer className="mt-12 max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center text-zinc-600 text-[9px] font-mono tracking-[0.2em] uppercase gap-4 mb-8">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <span className="flex items-center gap-2">
            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
            Node: SF-WEST-01
          </span>
          <span className="flex items-center gap-2">
            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
            Auth: P-VERIFIED
          </span>
          <span className="flex items-center gap-2">
            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
            Latency: 24ms
          </span>
        </div>
        <div className="flex gap-6 text-zinc-500">
          <span className="hover:text-blue-500 cursor-pointer transition-colors">System Disclosure</span>
          <span className="text-blue-500 font-bold">Log Terminal</span>
        </div>
      </footer>
    </div>
  );
}
