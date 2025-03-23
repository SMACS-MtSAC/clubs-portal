import React from "react";
import { LoginCredentials, RegisterCredentials, User } from "../types/auth";

export const AuthContext = React.createContext<{
  user?: User;
  isLoading: boolean;
  isLoggedIn: boolean;
  error?: string;
  login: (creds: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (creds: RegisterCredentials) => Promise<void>;
}>({
  isLoading: true,
  isLoggedIn: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});
