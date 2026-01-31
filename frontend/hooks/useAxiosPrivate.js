import { useEffect, useRef } from "react";
import useRefreshToken from "./useRefreshToken";
import { axiosPrivate } from "../services/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const isIntereceptorSet = useRef(false);

  useEffect(() => {
    if (isIntereceptorSet.current) return;
    isIntereceptorSet.current = true;

    const requestInterceptor = axiosPrivate.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem("accessToken");
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseIntercetpor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        if (
          error?.response?.status === 401 &&
          prevRequest &&
          !prevRequest?.sent
        ) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();

          await AsyncStorage.setItem("accessToken", newAccessToken);
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.response.eject(responseIntercetpor);
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      isIntereceptorSet.current = false;
    };
  }, []);

  return axiosPrivate;
};

export default useAxiosPrivate;
