import React, { useEffect, useState, ReactNode } from 'react';
import { Navigate, useNavigate, Outlet } from 'react-router-dom';
import { auth } from '@/config/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';

// Define the props for the AuthRoleRequire component
interface AuthRoleRequireProps {
  role: 'user' | 'admin' | 'doctor'; // Add 'doctor' role
}

const AuthRoleRequire: React.FC<AuthRoleRequireProps> = ({ role }) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          const authRole = idTokenResult.claims.role as string;

          // Role-based redirection logic
          if (role === 'user') {
            if (authRole === 'admin' || authRole === 'doctor') {
              toast('You dont have permission to access this page');
              navigate('/dashboard');
            } else if (authRole !== 'user') {
              await signOut(auth);
              toast('You need to login to access this page');
              navigate('/login');
            }
          } else if (role === 'admin') {
            if (authRole === 'user' || authRole === 'doctor') {
              toast('You dont have permission to access this page');
              navigate('/');
            } else if (authRole !== 'admin') {
              await signOut(auth);
              toast('You need to login as an admin to access this page');
              navigate('/login');
            }
          } else if (role === 'doctor') {
            if (authRole === 'user' || authRole === 'admin') {
              toast('You dont have permission to access this page');
              navigate('/');
            } else if (authRole !== 'doctor') {
              await signOut(auth);
              toast('You need to login as a doctor to access this page');
              navigate('/login');
            }
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        await signOut(auth);
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [role, navigate]);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-white dark:bg-slate-900 flex items-center justify-center z-50">
        <p className="text-center dark:text-white flex items-center justify-center">
          <LoaderCircle className="animate-spin h-8 w-8 text-gray-400 dark:text-white text-lg mx-2" />
          Loading...
        </p>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthRoleRequire;