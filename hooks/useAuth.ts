import axios from "axios";
import { useContext } from "react";
import { AuthenticationContext } from "../app/context/AuthContext";

const useAuth = () => {
  const { data, error, loading, setAuthState } = useContext(
    AuthenticationContext
  );

  const signin = async (
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    handleClose: () => void
  ) => {
    setAuthState({
      data: null,
      loading: true,
      error: null,
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signin",
        { email, password }
      );

      setAuthState({
        data: response.data,
        loading: false,
        error: null,
      });

      handleClose();
    } catch (error: any) {
      setAuthState({
        data: null,
        loading: false,
        error: error?.response?.data?.errorMessage,
      });
    }
  };
  
  const signup = async (
    {
      email,
      password,
      firstName,
      lastName,
      city,
      phone,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      city: string;
      phone: string;
    },
    handleClose: () => void
  ) => {
    setAuthState({
      data: null,
      loading: true,
      error: null,
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        { email, password, firstName, lastName, city, phone }
      );

      setAuthState({
        data: response.data,
        loading: false,
        error: null,
      });

      handleClose();
    } catch (error: any) {
      setAuthState({
        data: null,
        loading: false,
        error: error?.response?.data?.errorMessage,
      });
    }
  };

  return {
    signin,
    signup,
  };
};

export default useAuth;
