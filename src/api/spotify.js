import axios from "axios";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const SCOPE = "user-top-read"
// exporting different functions to be used in the application.
// so this getSpotifyAuthUrl function is needed 
export const getSpotifyAuthUrl = async()=>{
    const generateRandomString = (length)=>{ // a function to generate a random string we need to do this because its required in spotify PKCE auth flow
        const Possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        return Array.from(crypto.getRandomValues(new Uint8Array(length))).map((x)=>{
            Possible[x%Possible.length]
        }).join("")
    }
    const codeVerifier = generateRandomString(64); //generates a random string using the above logic
    localStorage.setItem(codeVerifier)// sets the generated verifier in the browser's local memory
    // everything after this line is fucking difficult to understand so please bare with it. you've been warned. try not to touch the code below it might fucking break it.
    const hashed = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier)); //hashed the codeverifier using SHA256
    const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hashed))).replace(/\//g,"_").replace(/=+$/,""); //i somewhat know what the fuck this does but i couldnt've wrote it on my own yeah. it fucking takes our fucking hashed and then fucking
    //uses fucking btoa (a web api) to convert it into fucking b64 format and the fucking replace helps in making it url safe. this is the part of the fucking PKCE auth flow so gotta get this fucking done.
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPES}&code_challenge_method=S256&code_challenge=${codeChallenge}`;// puts the things in the thingy.
    return authUrl; //returns this final fucking abomination of the url it created.
}

// getAccessToken this function is required to get the access token of the user so we can use this token to get the info of the top tracks.
export const getAccessToken = async (code)=>{
    const codeVerifier = localStorage.getItem('code_verifier') // remember we stored the code_verifier in browser's  local storage guess what? we gon use it now.
    const response = await axios.post("https://accounts.spotify.com/api/token", new URLSearchParams({
        client_id: CLIENT_ID, //pretty self explanatory we have a client id in our spotify for dev dashboard makes spotify know whose app sending request.
        grant_type: "authorization_code",// yeah what we askin' for is the auth code.
        code,// i am not completely sure but i think this when the user logins, it has that auth code.
        redirect_uri: REDIRECT_URI, // redirects to our page
        code_verifier: codeVerifier,// to check if the request was from our client only and not some random ahh dev sending them request.
    }));
    return response.data.access_token; // accesses the response and particularly the access tokens there are other fields aswell.
};
// we tryna get the top tracks of the the user using the token we got.
export const fetchTopTracks = async (token) => {
    const response = await axios.get("https://api.spotify.com/v1/me/top/tracks?time_range=long_term", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.items;
  };