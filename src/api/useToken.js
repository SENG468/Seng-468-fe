import { useState } from 'react';

export function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('access_token');
    const userToken = JSON.parse(tokenString);
    return userToken?.access_token
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    sessionStorage.setItem('access_token', JSON.stringify(userToken));
    setToken(userToken.access_token);
    window.location.reload();
  };

  return {
    setToken: saveToken,
    token
  }
}
