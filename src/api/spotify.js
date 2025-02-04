import axios from "axios";
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
// exporting different functions to be used in the application.
// so this getSpotifyAuthUrl function is needed for auth flow redirection 
export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", `${REDIRECT_URI}`);
    params.append("scope", "user-read-private user-read-email user-top-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}


// getAccessToken this function is required to get the access token of the user so we can use this token to get the info of the top tracks.
export async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");
  
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", `${REDIRECT_URI}`);
    params.append("code_verifier", verifier);
  
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    });
  
    const { access_token } = await result.json();
    console.log("Access token received:", access_token);  // Debugging line
  
    if (access_token) {
      return access_token;
    } else {
      throw new Error("Failed to get access token");
    }
  }
  
// we tryna get the top tracks of the the user using the token we got.
export const fetchTopTracks = async (token) => {
    try {
      console.log("karrha fetch"+token)
      const result = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10&offset=0", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    const data = await result.json();
    console.log(data.items);
      return data.items;
    } catch (err) {
      console.error("Error fetching top tracks:", err);
      throw err;
    }
  }; 