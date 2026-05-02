import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile, DoctorData } from '../types';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Shield, LogOut, Users, Search, Stethoscope, Award, MapPin, Plus, CheckCircle2, Activity, Clock, Calendar, QrCode } from 'lucide-react';
import QRScannerWindow from '../components/QRScannerWindow';

export default function DoctorDashboard({ user }: { user: UserProfile }) {
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const path = `users/${user.uid}/doctorDetails/basic`;
      try {
        const docRef = doc(db, path);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setDoctorData(snap.data() as DoctorData);
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

  const handleScanSuccess = (decodedText: string) => {
    setScannedResult(decodedText);
    setShowScanner(false);
    // In a real app, we would search for the patient by the UID in the QR
    alert(`Decrypted Patient Vault: ${decodedText}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#e4e4e7] flex flex-col font-sans p-4 md:p-8">
      {/* Header Navigation */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white uppercase">MED<span className="text-emerald-500">VAULT</span></span>
        </div>
        
        <div className="hidden md:flex bg-zinc-900/80 p-1 rounded-full border border-zinc-800">
          <button className="px-6 py-2 rounded-full text-zinc-400 text-xs font-bold hover:text-white transition-all">Patient View</button>
          <button className="px-6 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold transition-all shadow-lg">Console</button>
        </div>

        <div className="flex gap-4">
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-zinc-900 rounded-lg border border-zinc-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Master Auth Active</span>
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
        
        {/* Welcome & Stats Card */}
        <div className="col-span-1 md:col-span-8 md:row-span-2 bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-all group-hover:bg-emerald-600/20"></div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-tight">Active Terminal: <span className="text-emerald-400">Dr. {user.displayName?.split(' ').pop()}</span></h1>
            <p className="text-zinc-500 max-w-md text-xs md:text-sm font-medium leading-relaxed">Medical credentials verified. Your portal is now synchronized with SF-CENTRAL health nodes.</p>
          </div>
          <div className="flex flex-wrap gap-6 md:gap-10 mt-6">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1 font-bold">Protocol</span>
              <span className="font-mono text-white text-[10px] md:text-xs">DOC-PROTO-X</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1 font-bold">Network Load</span>
              <span className="font-mono text-blue-500 text-[10px] md:text-xs tracking-tighter">OPTIMAL 14MS</span>
            </div>
             <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1 font-bold">Access Level</span>
              <span className="font-mono text-purple-500 text-[10px] md:text-xs">LEVEL 4 CLEARANCE</span>
            </div>
          </div>
        </div>

        {/* Scan & Initialize Card */}
        <div className="col-span-1 md:col-span-4 md:row-span-3 bg-gradient-to-br from-emerald-600/20 to-zinc-950 border border-emerald-500/20 rounded-[32px] p-8 flex flex-col items-center justify-center relative group overflow-hidden">
           <div className="absolute inset-0 bg-emerald-500/[0.02] group-hover:bg-emerald-500/[0.05] transition-colors"></div>
           <button 
             onClick={() => setShowScanner(true)}
             className="w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all mb-6 relative z-10"
           >
              <QrCode className="w-10 h-10" />
           </button>
           <div className="text-center relative z-10">
              <h3 className="text-white font-bold text-lg mb-2">Initialize Session</h3>
              <p className="text-zinc-500 text-xs max-w-[180px] mx-auto leading-relaxed">
                Scan patient's Vault QR code to automatically decrypt and sync their health profile.
              </p>
           </div>
           
           <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Professional Details Card */}
        <div className="col-span-1 md:col-span-4 md:row-span-4 bg-zinc-900 border border-zinc-800 rounded-[32px] p-7 flex flex-col relative overflow-hidden group order-last md:order-none">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h3 className="font-bold text-white uppercase text-[10px] tracking-[0.2em] opacity-50">Credentials</h3>
            <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold uppercase tracking-wider">Verified Expert</span>
          </div>
          
          <div className="space-y-4 relative z-10">
            <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800/50">
              <div className="text-[9px] text-zinc-600 mb-1 uppercase font-bold tracking-widest">Medical Degree</div>
              <div className="text-white font-bold text-base md:text-lg tracking-tight">{doctorData?.degree || "--"}</div>
            </div>
            
            <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800/50">
              <div className="text-[9px] text-zinc-600 mb-1 uppercase font-bold tracking-widest">Primary Facility</div>
              <div className="text-zinc-300 font-medium text-xs leading-relaxed">{doctorData?.address}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800/50 flex flex-col items-center">
                 <Users className="w-5 h-5 text-emerald-500 mb-2" />
                 <span className="text-xl md:text-2xl font-bold text-white tracking-tighter">24</span>
                 <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">Patients</span>
              </div>
              <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800/50 flex flex-col items-center">
                 <Award className="w-5 h-5 text-emerald-500 mb-2" />
                 <span className="text-xl md:text-2xl font-bold text-white tracking-tighter">4.9</span>
                 <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">Rating</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-600/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Appointments Grid */}
        <div className="col-span-1 md:col-span-8 md:row-span-4 bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 md:p-8 flex flex-col group overflow-hidden">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
             <div className="flex items-center gap-3">
               <div className="p-2.5 bg-white/5 rounded-xl text-white">
                 <Users className="w-5 h-5" />
               </div>
               <h3 className="font-bold text-white uppercase text-[10px] tracking-[0.2em] opacity-50">Today's Queue</h3>
             </div>
             <div className="relative w-full lg:w-auto">
               <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
               <input 
                 className="bg-zinc-950 border border-zinc-800 py-2.5 pl-10 pr-6 rounded-xl text-[10px] md:text-xs outline-none focus:ring-1 focus:ring-emerald-500/30 text-white w-full font-mono placeholder:text-zinc-700"
                 placeholder="SEARCH_PATIENT_DB..."
               />
             </div>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[300px] md:max-h-[400px] pr-2 custom-scrollbar">
            {[
              { name: "Sarah Johnson", time: "09:30 AM", type: "Follow up", id: "P-4422" },
              { name: "Michael Chen", time: "10:15 AM", type: "Initial Checkup", id: "P-8819" },
              { name: "Anna Smith", time: "11:00 AM", type: "Prescription", id: "P-9021" }
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-4 md:p-5 bg-zinc-950/50 border border-zinc-800/50 rounded-2xl hover:bg-zinc-950 hover:border-emerald-500/30 transition-all cursor-pointer group/item relative overflow-hidden">
                <div className="flex items-center gap-3 md:gap-4 relative z-10 w-2/3">
                   <div className="w-8 h-8 md:w-10 md:h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-600 font-bold text-xs ring-1 ring-zinc-800 shrink-0">
                     {p.name.charAt(0)}
                   </div>
                   <div className="truncate">
                     <p className="font-bold text-white text-xs md:text-sm tracking-tight truncate">{p.name}</p>
                     <p className="text-[8px] md:text-[9px] text-zinc-500 font-mono tracking-widest uppercase mt-0.5 truncate">{p.id} • {p.type}</p>
                   </div>
                </div>
                <div className="text-right relative z-10">
                   <p className="text-[10px] md:text-xs font-mono text-zinc-300 font-bold">{p.time}</p>
                   <p className="text-[8px] md:text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-1 group-hover/item:underline underline-offset-4">Sync</p>
                </div>
                <div className="absolute inset-0 bg-emerald-500/0 group-hover/item:bg-emerald-500/[0.02] transition-colors"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Logs Card */}
        <div className="col-span-1 md:col-span-4 md:row-span-1 bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 flex flex-col relative overflow-hidden justify-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg"><Activity className="w-4 h-4 text-emerald-500" /></div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Audit Active</span>
          </div>
        </div>
      </div>

      {/* Grid Footer */}
      <footer className="mt-12 max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center text-zinc-600 text-[9px] font-mono tracking-[0.2em] uppercase gap-4 mb-8">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <span className="flex items-center gap-2 text-zinc-400">
             TERMINAL: MV-DOC-{user.uid.slice(0,4).toUpperCase()}
          </span>
          <span className="text-emerald-500 font-bold">STATUS: VERIFIED</span>
          <span className="text-blue-500">AES-256 ACTIVE</span>
        </div>
        <div className="flex gap-6 text-zinc-600">
          <span className="hover:text-emerald-500 cursor-pointer transition-colors">Protocol Help</span>
        </div>
      </footer>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScannerWindow 
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
