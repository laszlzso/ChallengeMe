import { ConstructionOutlined } from "@mui/icons-material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useAuthContext } from "../components/authProvider/AuthProvider";

export const useFetch = () => {
  const { user, authTokens, refreshUser } = useAuthContext();
  const router = useRouter();

  const fetchAuthenticated: typeof fetch = async (input, init) => {
    let accessToken = authTokens?.access;
    const isExpired = user && dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (isExpired) {
      const token = await refreshUser();
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
        router.replace("/login");
      }
      return response;
    });
  };

  return {
    fetchAuthenticated
  };
};
