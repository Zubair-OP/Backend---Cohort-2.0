import "../style/PlaylistPanel.css";

export default function PlaylistPanel({ songs, onSelectSong, activeSongIndex }) {
  return (
    <div className="playlist-panel">
      <div className="playlist-panel__header">
        <span className="playlist-panel__icon">🎵</span>
        <h2 className="playlist-panel__title">AI Recommended Playlist</h2>
      </div>

      <div className="playlist-panel__list">
        {songs.length === 0 ? (
          <p className="playlist-panel__empty">
            Detect your mood to get personalized recommendations
          </p>
        ) : (
          songs.map((song, index) => (
            <div
              key={song._id || index}
              className={`playlist-panel__song ${
                index === activeSongIndex ? "playlist-panel__song--active" : ""
              }`}
              onClick={() => onSelectSong(index)}
            >
              <img
                className="playlist-panel__thumb"
                src={song.posterUrl || "/vite.svg"}
                alt={song.title || "Track"}
              />
              <div className="playlist-panel__song-info">
                <span className="playlist-panel__song-title">
                  {song.title || "Untitled"}
                </span>
                {song.artist && (
                  <span className="playlist-panel__song-artist">{song.artist}</span>
                )}
              </div>
              <span className="playlist-panel__play-icon">▶</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
