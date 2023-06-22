"use client";
import {
  ReactNode,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
}

interface State {
  loading: boolean;
  data: User | null;
  error: string | null;
}

interface AuthState extends State {
  setAuthState: Dispatch<
    SetStateAction<{
      loading: boolean;
      data: null;
      error: null;
    }>
  >;
}

const initialState: AuthState = {
  loading: false,
  data: null,
  error: null,
  setAuthState: () => {},
};

export const AuthenticationContext = createContext<AuthState>({
  ...initialState,
});

export default function AuthContext({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState({
    loading: false,
    data: null,
    error: null,
  });

  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
