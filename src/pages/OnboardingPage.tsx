import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, UserRole } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { ArrowRight, User, Stethoscope, ChevronRight, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface OnboardingPageProps {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
}

export default function OnboardingPage({ user, setUser }: OnboardingPageProps) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!role) return;
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const updatedProfile: UserProfile = {
        ...user,
        role,
        onboarded: true,
        displayName: formData.name || user.displayName
      };

      try {
        await setDoc(userDocRef, updatedProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      }

      // Create details collection
      const detailsPath = `users/${user.uid}/${role === 'patient' ? 'patientDetails' : 'doctorDetails'}/basic`;
      const detailsRef = doc(db, detailsPath);
      
      const payload = role === 'patient' ? {
        bloodGroup: formData.bloodGroup,
        gender: formData.gender,
        age: parseInt(formData.age),
        address: formData.address
      } : {
        degree: formData.degree,
        address: formData.address,
        verified: false
      };

      try {
        await setDoc(detailsRef, payload);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, detailsPath);
      }

      setUser(updatedProfile);
    } catch (err) {
      console.error(err);
      alert('Failed to save data. Please check your permissions or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#e4e4e7] flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full">
        {/* Progress bar */}
        <div className="flex gap-3 mb-16">
           {[1, 2].map((s) => (
             <div 
               key={s} 
               className={cn(
                 "h-1 flex-1 rounded-full transition-all duration-700",
                 step >= s ? "bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" : "bg-zinc-800"
               )}
             />
           ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="bg-zinc-900 rounded-[40px] p-10 border border-zinc-800 shadow-3xl"
            >
              <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold mb-3 tracking-tight">Identity Setup</h1>
                <p className="text-zinc-500 font-medium">Select your primary role in the MedVault network</p>
              </div>
              
              <div className="grid gap-4">
                <button 
                  onClick={() => handleRoleSelect('patient')}
                  className="flex items-center gap-6 p-8 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-blue-600/50 hover:bg-blue-600/5 transition-all text-left group overflow-hidden relative"
                >
                  <div className="bg-blue-600/10 text-blue-500 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all z-10">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="flex-1 z-10">
                    <h3 className="text-xl font-bold text-white">Patient Record</h3>
                    <p className="text-zinc-500 text-sm font-medium mt-1">Manage private health history</p>
                  </div>
                  <ChevronRight className="text-zinc-700 w-6 h-6 group-hover:text-blue-500 group-hover:translate-x-1 transition-all z-10" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-all"></div>
                </button>

                <button 
                  onClick={() => handleRoleSelect('doctor')}
                  className="flex items-center gap-6 p-8 rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-emerald-600/50 hover:bg-emerald-600/5 transition-all text-left group overflow-hidden relative"
                >
                  <div className="bg-emerald-600/10 text-emerald-500 p-4 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all z-10">
                    <Stethoscope className="w-8 h-8" />
                  </div>
                  <div className="flex-1 z-10">
                    <h3 className="text-xl font-bold text-white">Doctor Console</h3>
                    <p className="text-zinc-500 text-sm font-medium mt-1">Verified clinician dashboard</p>
                  </div>
                  <ChevronRight className="text-zinc-700 w-6 h-6 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all z-10" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-emerald-600/10 transition-all"></div>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="bg-zinc-900 rounded-[40px] p-10 border border-zinc-800 shadow-3xl"
            >
              <div className="mb-10">
                <h2 className="text-3xl font-bold mb-3 tracking-tight">Vitals Synchronization</h2>
                <p className="text-zinc-500 font-medium tracking-tight">
                  {role === 'patient' ? "Establish your baseline medical profile" : "Register your clinical credentials"}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold mb-3 uppercase tracking-[0.2em] text-zinc-500">Legal Full Name</label>
                  <input 
                    name="name"
                    onChange={handleInputChange}
                    defaultValue={user.displayName}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-blue-600/50 focus:border-blue-600/50 outline-none transition-all font-medium text-white placeholder:text-zinc-700"
                    placeholder="Sarah Michelle Jenkins" 
                  />
                </div>

                {role === 'patient' ? (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold mb-3 uppercase tracking-[0.2em] text-zinc-500">Blood Group</label>
                        <select 
                          name="bloodGroup"
                          onChange={handleInputChange}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-blue-600/50 focus:border-blue-600/50 outline-none transition-all font-medium text-white appearance-none cursor-pointer"
                        >
                          <option value="">Select Type</option>
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold mb-3 uppercase tracking-[0.2em] text-zinc-500">Gender Identity</label>
                        <select 
                          name="gender"
                          onChange={handleInputChange}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-blue-600/50 focus:border-blue-600/50 outline-none transition-all font-medium text-white appearance-none cursor-pointer"
                        >
                          <option value="">Select Option</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold mb-3 uppercase tracking-[0.2em] text-zinc-500">Age Factor</label>
                      <input 
                        name="age"
                        type="number"
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-blue-600/50 focus:border-blue-600/50 outline-none transition-all font-medium text-white placeholder:text-zinc-700"
                        placeholder="28" 
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-[10px] font-bold mb-3 uppercase tracking-[0.2em] text-zinc-500">Board Certification / Degree</label>
                    <input 
                      name="degree"
                      onChange={handleInputChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-blue-600/50 focus:border-blue-600/50 outline-none transition-all font-medium text-white placeholder:text-zinc-700"
                      placeholder="MD, Cardiology (FACC)" 
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold mb-3 uppercase tracking-[0.2em] text-zinc-500">Facility / Resident Address</label>
                  <input 
                    name="address"
                    onChange={handleInputChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-blue-600/50 focus:border-blue-600/50 outline-none transition-all font-medium text-white placeholder:text-zinc-700"
                    placeholder="422 Oakwood Drive, Ste 12" 
                  />
                </div>

                <div className="pt-8 flex gap-4">
                   <button 
                    onClick={() => setStep(1)}
                    className="flex-1 bg-zinc-950 border border-zinc-800 py-4 rounded-xl font-bold hover:bg-zinc-900 transition-all text-sm tracking-tight"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-[2] bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-3 group text-sm tracking-tight shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50"
                  >
                    {loading ? "Decrypting..." : (
                      <>
                        Initialize Vault
                        <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
