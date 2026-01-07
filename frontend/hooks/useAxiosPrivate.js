import { useEffect } from 'react'
import useRefreshToken from './useRefreshToken'
import useAuth from './useAuth'
import { axiosPrivate } from '../services/axios'

const useAxiosPrivate = () => {

    const refresh = useRefreshToken()
    const { accessToken, setAccessToken } = useAuth()
  
    useEffect(() => {
        const requestInterceptor = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`
                }
                return config
            },
            (error) => {
                Promise.reject(error)
            }
        )

        const responseIntercetpor = axiosPrivate.interceptors.response.use(
            response => response,
            async(error) => {
                const prevRequest = error?.config

                if (error?.response?.status === 401 && prevRequest && !prevRequest?.sent) {
                    prevRequest.sent = true 
                    const newAccessToken = await refresh()

                    setAccessToken(newAccessToken)
                    prevRequest.headers['Authorization'] = `Bearer ${accessToken}`
                    return axiosPrivate(prevRequest)
                }
                return Promise.reject(error);
            }
        )

        return (() => {
            axiosPrivate.interceptors.response.eject(responseIntercetpor);
            axiosPrivate.interceptors.request.eject(requestInterceptor);
        })
    }, [accessToken, refresh])

    return axiosPrivate;
}

export default useAxiosPrivate