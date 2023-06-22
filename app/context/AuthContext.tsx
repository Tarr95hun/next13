"use client";
import {
  ReactNode,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

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

  const fetchUser = async () => {
    setAuthState({
      data: null,
      loading: true,
      error: null,
    });
    try {
      const jwt = getCookie("jwt");

      if (!jwt) {
        setAuthState({
          data: null,
          loading: false,
          error: null,
        });
      }

      const response = await axios.get("http://localhost:3000/api/auth/me", {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

      setAuthState({
        data: response.data,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState({
        data: null,
        loading: false,
        error: error?.response?.data?.errorMessage,
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
