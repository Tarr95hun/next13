import * as React from "react";
import Link from "next/link";
import LoginModal from "../AuthModal";

const Navbar = () => (
  <nav className="bg-white p-2 flex justify-between">
    <Link href="" className="font-bold text-gray-700 text-2xl">
      OpenTable
    </Link>
    <div>
      <div className="flex">
        <LoginModal isSignin />
        <LoginModal isSignin={false} />
      </div>
    </div>
  </nav>
);

export default Navbar;
