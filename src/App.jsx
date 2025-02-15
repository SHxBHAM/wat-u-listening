import { useState } from "react";
import useAuth from "./hooks/useAuth";
import useSpotifyData from "./hooks/useSpotifyData";
import { redirectToAuthCodeFlow } from "./api/spotify";
import TrackCard from "./components/TrackCard";

const Home = () => {
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const SCOPE = "user-read-private user-read-email user-top-read"
  const { token } = useAuth();
  const { topTracks } = useSpotifyData(token);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await redirectToAuthCodeFlow(CLIENT_ID);
  };

  return (
    <div>
      <h1>Spotify Top Tracks</h1>
      {!token ? (
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Redirecting..." : "Login with Spotify"}
        </button>
      ) : (
        <div>
          <h2>Your Top Tracks</h2>
          <div className = "bg-gray-200 opacity-30 grid grid-cols-6 grid-rows-6 gap-4">
            {topTracks.map((topTracks) => (
              <TrackCard  key={topTracks.id} track={topTracks} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
