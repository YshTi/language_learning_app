import { useEffect, useState, type ReactNode } from "react";

import { onAuthStateChanged, updateProfile } from "firebase/auth";

import { auth } from "../firebase/firebase";

import { loginUser, logoutUser, registerUser } from "../firebase/auth";

import { AuthContext, type AppUser } from "./authContext";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (name: string, email: string, password: string) => {
    const userCredential = await registerUser(email, password);

    await updateProfile(userCredential.user, {
      displayName: name,
    });

    setUser({
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: name,
    });
  };

  const login = async (email: string, password: string) => {
    const userCredential = await loginUser(email, password);

    setUser({
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
    });
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
