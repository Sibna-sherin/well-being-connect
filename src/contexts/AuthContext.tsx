// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { db,auth } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  role: string | null;
  userData: any; // Replace 'any' with a proper interface for your user data
  handleSignOut: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  userData: null,
  handleSignOut: async () => {},
});

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null); // Replace 'any' with a proper interface for your user data
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch user data from your backend or Firestore
  const fetchUserData = async (uid: string) => {
    try {
      const userDocRef = doc(db, 'users', uid); // Reference to the user document
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data());
      } else {
        console.error('User document not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          const idTokenResult = await user.getIdTokenResult();
          setRole(idTokenResult.claims.role as string || ''); // Default to empty string if no role

          // Fetch additional user data using the user's UID
          await fetchUserData(user.uid);
        } catch (error) {
          console.error('Error getting user role:', error);
        }
      } else {
        setUser(null);
        setRole(null);
        setUserData(null); // Clear user data on sign-out
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-slate-900 flex items-center justify-center z-50">
        <p className="text-center text-white flex items-center justify-center">Loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, role, userData, handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);