import axios from "axios";

const CLIENT_ID = "YOUR_SPOTIFY_CLIENT_ID";
const REDIRECT_URI = "http://localhost:5173/callback";
const SCOPES = "user-top-read";

export const getSpotifyAuthUrl = async () => {
  const generateRandomString = (length) => {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
      .map((x) => possible[x % possible.length])
      .join("");
  };

  const codeVerifier = generateRandomString(64);
  localStorage.setItem("code_verifier", codeVerifier);

  const hashed = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));
  const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hashed)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPES}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

  return authUrl;
};

export const getAccessToken = async (code) => {
  const codeVerifier = localStorage.getItem("code_verifier");

  const response = await axios.post("https://accounts.spotify.com/api/token", new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  }));

  return response.data.access_token;
};

export const fetchTopTracks = async (token) => {
  const response = await axios.get("https://api.spotify.com/v1/me/top/tracks?time_range=long_term", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.items;
};
