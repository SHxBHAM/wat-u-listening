import { useState, useEffect } from "react";
import { getAccessToken } from "../api/spotify";

const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem("spotify_token"));

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code && !token) {
      getAccessToken(code)
        .then((accessToken) => {
          setToken(accessToken);
          localStorage.setItem("spotify_token", accessToken);
          window.history.pushState({}, null, "/"); // Remove code from URL
        })
        .catch((err) => console.error(err));
    }
  }, [token]);

  return { token };
};

export default useAuth;
