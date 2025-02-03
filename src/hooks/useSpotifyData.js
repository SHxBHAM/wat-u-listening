import { useEffect, useState } from "react";
import { fetchTopTracks } from "../api/spotify";

const useSpotifyData = (token) => {
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    if (token) {
      fetchTopTracks(token)
        .then((tracks) => setTopTracks(tracks))
        .catch((err) => console.error(err));
    }
  }, [token]);

  return { topTracks };
};

export default useSpotifyData;
