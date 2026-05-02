export type UserRole = 'patient' | 'doctor';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  onboarded: boolean;
  createdAt: number;
}

export interface PatientData {
  bloodGroup: string;
  gender: string;
  age: number;
  address: string;
}

export interface DoctorData {
  degree: string;
  address: string;
  verified?: boolean;
}
