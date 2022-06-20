import { useRouter } from "next/router";
import { useAuthContext } from "../components/authProvider/AuthProvider";

export const useFetch = () => {
  const { authTokens } = useAuthContext();
  const router = useRouter();

  const fetchAuthenticated: typeof fetch = (input, init) => {
    return fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `JWT ${authTokens?.access}`
      }
    }).then((response) => {
      if (response.status === 401) {
        router.replace("/login");
      }
      return response;
    });
  };

  // axiosInstance.interceptors.request.use(async (req) => {
  //   const user = jwt_decode(authTokens.access);
  //   const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

  //   if (!isExpired) return req;

  //   const response = await axios.post(`${baseURL}/token/refresh/`, {
  //     refresh: authTokens.refresh
  //   });

  //   localStorage.setItem("authTokens", JSON.stringify(response.data));

  //   setAuthTokens(response.data);
  //   setUser(jwt_decode(response.data.access));

  //   req.headers.Authorization = `Bearer ${response.data.access}`;
  //   return req;
  // });

  return {
    fetchAuthenticated
  };
};
