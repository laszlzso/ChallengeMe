import { createContext, useState, useEffect, FC, useContext } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";

const AuthContext = createContext({
  user: {},
  setUser: () => {},
  authTokens: {},
  setAuthTokens: () => {},
  registerUser: () => {},
  loginUser: () => {},
  logoutUser: () => {}
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

type Props = {
  children: JSX.Element;
};

const AuthProvider: FC<Props> = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens") || "")
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens") || "")
      : null
  );

  const router = useRouter();

  const loginUser = async (username: string, password: string) => {
    const response = await fetch("/api/auth/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });
    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      router.push("/challenges");
    } else {
      alert("Something went wrong!");
    }
  };

  const registerUser = async (
    username: string,
    password: string,
    password2: string
  ) => {
    const response = await fetch("/api/auth/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password,
        password2
      })
    });
    if (response.status === 201) {
      router.push("/login");
    } else {
      alert("Something went wrong!");
    }
  };

  const logoutUser = () => {
    setAuthTokens(undefined);
    setUser(undefined);
    localStorage.removeItem("authTokens");
    router.push("/login");
  };

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode(authTokens.access));
    }
  }, [authTokens]);

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
