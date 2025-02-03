import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useSpotifyData from "../hooks/useSpotifyData";
import { getSpotifyAuthUrl } from "../api/spotify";
import TrackCard from "../components/TrackCard";

const Home = () => {
  const { token } = useAuth();
  const { topTracks } = useSpotifyData(token);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const authUrl = await getSpotifyAuthUrl();
    window.location.href = authUrl;
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
          <div className="track-list">
            {topTracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
