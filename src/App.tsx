import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { UserProfile } from './types';

// Pages - to be created
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import HealthuChatbot from './components/HealthuChatbot';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          const path = `users/${fbUser.uid}`;
          const docRef = doc(db, path);
          let docSnap;
          try {
            docSnap = await getDoc(docRef);
          } catch (err) {
            handleFirestoreError(err, OperationType.GET, path);
            return;
          }
          
          if (docSnap.exists()) {
            setUser(docSnap.data() as UserProfile);
          } else {
            // User exists in Auth but not in Firestore yet (onboarding start)
            setUser({
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || '',
              role: 'patient', // default temporary
              onboarded: false,
              createdAt: Date.now()
            });
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('App Load Error:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
           <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">Initializing Vault...</span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/auth" 
          element={user?.onboarded ? <Navigate to="/dashboard" /> : <AuthPage />} 
        />
        
        <Route 
          path="/onboarding" 
          element={
            user ? (
              user.onboarded ? <Navigate to="/dashboard" /> : <OnboardingPage user={user} setUser={setUser} />
            ) : <Navigate to="/auth" />
          } 
        />

        <Route 
          path="/dashboard" 
          element={
            user ? (
              !user.onboarded ? <Navigate to="/onboarding" /> : (
                user.role === 'doctor' ? <DoctorDashboard user={user} /> : <PatientDashboard user={user} />
              )
            ) : <Navigate to="/auth" />
          } 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {user && user.onboarded && <HealthuChatbot />}
    </BrowserRouter>
  );
}
