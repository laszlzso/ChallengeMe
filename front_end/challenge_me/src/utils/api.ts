import { ConstructionOutlined } from "@mui/icons-material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import {
  isTokenExpired,
  useAuthContext
} from "../components/authProvider/AuthProvider";

export const useFetch = () => {
  const { user, authTokens, refreshToken, logoutUser } = useAuthContext();
  const router = useRouter();

  const fetchAuthenticated: typeof fetch = async (input, init) => {
    let accessToken = authTokens?.access;

    if (isTokenExpired(user)) {
      const token = await refreshToken();
      accessToken = token?.access;
    }

    return fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `JWT ${accessToken}`
      }
    }).then((response) => {
      if (response.status === 401) {
        logoutUser();
      }
      return response;
    });
  };

  return {
    fetchAuthenticated
  };
};
