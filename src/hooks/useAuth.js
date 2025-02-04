import { useState, useEffect } from "react";
import { getAccessToken } from "../api/spotify";
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem("spotify_token"));

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
  
    // If there's a code and no token is set yet, proceed with token fetching
    if (code && !token) {
      getAccessToken(CLIENT_ID, code)
        .then((accessToken) => {
          console.log("Access token received:", accessToken); // Log the token for debugging
          setToken(accessToken);
          localStorage.setItem("spotify_token", accessToken);
          window.history.pushState({}, null, "/"); // Remove code from URL
        })
        .catch((err) => console.error("Error fetching token:", err));
    } else if (!code && !token) {
      console.log("No code found and no token in localStorage");
    } else {
      // Token is already set (either from URL or localStorage)
      console.log("Token already available:", token);
    }
  }, [token]); // Trigger the effect only when `token` changes
  
  
  
  

  return { token };
};

export default useAuth;
