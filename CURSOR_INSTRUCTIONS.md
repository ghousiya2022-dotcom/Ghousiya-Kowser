# MedVault Cursor Instructions

## Application Overview
MedVault is a secure healthcare application designed to connect patients and doctors with specialized dashboards and high-security standards.

## Key Features
- **Role-Based Onboarding**: 
  - **Patients**: Gather blood group, gender, age, and address.
  - **Doctors**: Gather professional degree and physical address.
- **Dynamic Dashboards**:
  - **Patient Dashboard**: View health status, next visits, medical profile, and recent reports.
  - **Doctor Dashboard**: Manage patient consultations, view professional status, and appointment management.
- **Security**: 
  - Firebase Authentication with Google Login.
  - Hardened Firestore Security Rules (Identity isolation).
  - Clean, modern UI with "Clinic" design language (Recipe 8 / Minimalist Utility).

## Technical Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS 4.
- **Animations**: Framer Motion.
- **Icons**: Lucide React.
- **Backend**: Firebase (Auth, Firestore).
- **Routing**: React Router DOM.

## Project Structure
- `/src/lib/firebase.ts`: Firebase initialization.
- `/src/pages/`: Contains Landing, Auth, Onboarding, Patient, and Doctor pages.
- `/src/types.ts`: Shared TypeScript interfaces.
- `/firestore.rules`: Security logic.
- `/firebase-blueprint.json`: Data model definitions.

## Mobile-First Strategy
- All UI elements are built using Tailwind responsive classes (`md:`, `lg:`).
- Touch-friendly buttons (min 44px height).
- Adaptive layouts (Grid to Single Column on mobile).

## Instructions for Iteration
- Always maintain the distinction between `patient` and `doctor` roles.
- Ensure all Firestore writes are validated against the `UserProfile` and specific details schemas.
- Use `cn()` utility for complex Tailwind class merging.
