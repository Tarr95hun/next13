"use client";
import { useContext } from "react";
import Link from "next/link";
import LoginModal from "../AuthModal";
import { AuthenticationContext } from "../../context/AuthContext";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const { data, loading } = useContext(AuthenticationContext);
  const { signout } = useAuth();

  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="" className="font-bold text-gray-700 text-2xl">
        OpenTable
      </Link>
      <div>
        {loading ? null : (
          <div className="flex">
            {data ? (
              <button
                className="border p-1 px-4 rounded mr-3 bg-blue-400 text-white"
                onClick={() => signout()}
              >
                Sign out
              </button>
            ) : (
              <>
                <LoginModal isSignin />
                <LoginModal isSignin={false} />
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
