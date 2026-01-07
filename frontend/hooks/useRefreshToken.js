import React from 'react'
import axios from '../services/axios'

const useRefreshToken = () => {
  const refresh = async() => {
    const response = await axios.get('/auth/refresh', {
        withCredentials: true
    });

    const accessToken = response.data.token;
    return accessToken;
  }

  return refresh;
}

export default useRefreshToken