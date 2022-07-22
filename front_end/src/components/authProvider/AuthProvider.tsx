import { createContext, useState, useEffect, FC, useContext } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { ConstructionOutlined } from "@mui/icons-material";

export type UserShape = {
  email: string;
  exp: number;
  iat: number;
  jti: string;
  token_type: string;
  user_id: number;
  username: string;
};
export type AuthTokensShape = { access?: string; refresh?: string };

export type AuthContextShape = {
  user: UserShape | null;
  authTokens: AuthTokensShape | null;
  registerUser: (username: string, password: string, password2: string) => void;
  loginUser: (username: string, password: string) => void;
  logoutUser: () => void;
  refreshToken: () => Promise<AuthTokensShape>;
};

const AuthContext = createContext<AuthContextShape>({} as AuthContextShape);

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const isTokenExpired = (user: UserShape | null) => {
  return user && dayjs.unix(user.exp).diff(dayjs()) < 1;
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
    } else if (response.status === 400) {
      // TODO(rics): instead return Promise.reject and use catch on the other side
      throw await response.json();
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

  const refreshToken = async () => {
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
    } else if (response.status === 401) {
      logoutUser();
      throw Error("Unable to refresh token: user unauthorized");
    } else {
      throw Error("Something went wrong");
    }
  };

  useEffect(() => {
    if (isTokenExpired(user)) {
      refreshToken();
    }
  }, []);

  const contextData = {
    user,
    authTokens,
    registerUser,
    loginUser,
    logoutUser,
    refreshToken
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
