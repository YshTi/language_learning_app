import { createContext } from "react";

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AuthContextType {
  user: AppUser | null;
  loading: boolean;

  register: (name: string, email: string, password: string) => Promise<void>;

  login: (email: string, password: string) => Promise<void>;

  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
