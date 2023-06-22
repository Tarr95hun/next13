"use client";

import { ChangeEvent, useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AuthInputs from "./components/AuthInputs";
import useAuth from "../../../hooks/useAuth";
import { AuthenticationContext } from "../../context/AuthContext";
import { Alert, CircularProgress } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const LoginModal = ({ isSignin }: { isSignin: boolean }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { signin, signup } = useAuth();
  const { error, loading, data } = useContext(AuthenticationContext);

  const renderContentByIsSignin = (
    signinContent: string,
    signupContent: string
  ) => {
    return isSignin ? signinContent : signupContent;
  };

  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const { firstName, lastName, email, password, city, phone } = inputs;

    if (isSignin) {
      if (password && email) {
        return setDisabled(false);
      }
    } else {
      if (firstName && lastName && email && password && city && phone) {
        return setDisabled(false);
      }
    }

    setDisabled(true);
  }, [inputs]);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = () => {
    const { email, password } = inputs;

    if (isSignin) {
      signin({ email, password }, handleClose);
    } else {
      signup({ ...inputs }, handleClose);
    }
  };

  const renderContent = () => (
    <div className="p-2 h-[600px]">
      {error ? (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      ) : null}

      <div className="uppercase font-bold text-center pb-2 border-b mb-2">
        <p className="text-sm">
          {renderContentByIsSignin("Sign in", "Create Account")}
        </p>
      </div>

      <div className="m-auto">
        <h2 className="text-2xl font-light text-center">
          {renderContentByIsSignin(
            "Log Into Your Account",
            "Create Your Open Table Account"
          )}
        </h2>

        <AuthInputs
          inputs={inputs}
          onChange={handleChangeInput}
          isSignin={isSignin}
        />

        <button
          className="uppercase bg-red-600 w-full text-white p-3 rounden text-sm mb-10 disabled:bg-gray-400"
          onClick={handleClick}
          disabled={disabled}
        >
          {renderContentByIsSignin("Sign in", "Create Account")}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        className={`${renderContentByIsSignin(
          "bg-blue-400 text-white",
          ""
        )} border p-1 px-4 rounded mr-3`}
        onClick={handleOpen}
      >
        {renderContentByIsSignin("Sign in", "Sign up")}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {loading ? (
            <div className="py-24 px-2 h-[600px] flex justify-center align-center">
              <CircularProgress />
            </div>
          ) : (
            renderContent()
          )}
        </Box>
      </Modal>
    </>
  );
};

export default LoginModal;
