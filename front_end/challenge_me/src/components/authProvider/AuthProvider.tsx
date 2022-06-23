import { createContext, useState, useEffect, FC, useContext } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";

export type UserShape = { exp: number };
export type AuthTokensShape = { access?: string; refresh?: string };

export type AuthContextShape = {
  user: UserShape | null;
  setUser: (user: UserShape) => void;
  authTokens: AuthTokensShape | null;
  setAuthTokens: (authTokens: AuthTokensShape) => void;
  registerUser: (username: string, password: string, password2: string) => void;
  loginUser: (username: string, password: string) => void;
  logoutUser: () => void;
  refreshUser: () => Promise<AuthTokensShape>;
};

const AuthContext = createContext<AuthContextShape>({} as AuthContextShape);

export const useAuthContext = () => {
  return useContext(AuthContext);
};

type Props = {
  children: React.ReactNode;
};

const AuthProvider: FC<Props> = ({ children }) => {
  const [authTokens, setAuthTokens] = useState<AuthTokensShape | null>(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens") || "")
      : null
  );
  const [user, setUser] = useState<UserShape | null>(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode<UserShape>(localStorage.getItem("authTokens") || "")
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
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    router.push("/login");
  };

  const refreshUser = async () => {
    const response = await fetch("/api/auth/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        refresh: authTokens?.refresh
      })
    });
    const data = await response.json();

    if (response.status === 200) {
      localStorage.setItem("authTokens", JSON.stringify(data));
      setAuthTokens(data);
      setUser(jwt_decode(data.access));

      return data as AuthTokensShape;
    } else {
      throw Error("Something went wrong");
    }
  };

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser,
    refreshUser
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode(authTokens?.access || ""));
    }
  }, [authTokens]);

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
