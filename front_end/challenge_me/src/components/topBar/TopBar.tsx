import Link from "next/link";
import React from "react";
import { useAuthContext } from "../authProvider/AuthProvider";

const TopBar = () => {
  const { user, logoutUser } = useAuthContext();
  return (
    <nav>
      <div>
        <div>
          {user ? (
            <>
              <Link href="/challenges">Challenges</Link>
              <button onClick={logoutUser}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
