import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  onAuthStateChanged,
  updateProfile,
  type User,
} from "firebase/auth";

import { auth } from "../firebase/firebase";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../firebase/auth";

import { AuthContext } from "./authContext";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      currentUser => {
        setUser(currentUser);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    const userCredential = await registerUser(
      email,
      password
    );

    await updateProfile(userCredential.user, {
      displayName: name,
    });

    setUser(userCredential.user);
  };

  const login = async (
    email: string,
    password: string
  ) => {
    await loginUser(email, password);
  };

  const logout = async () => {
    await logoutUser();
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