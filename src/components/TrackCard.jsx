const TrackCard = ({ track }) => {
    return (
      <div className="track-card">
        <img src={track.album.images[0].url} alt={track.name} width="100" />
        <p>{track.name} - {track.artists.map((a) => a.name).join(", ")}</p>
      </div>
    );
  };
  
  export default TrackCard;
  