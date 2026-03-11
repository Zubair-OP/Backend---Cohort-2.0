import { usePlayer } from "../hooks/usePlayer";
import { formatTime } from "../services/player.utils";
import "../style/Player.css";

export default function Player({ songs }) {
  const {
    audioRef,
    isPlaying,
    activeSong,
    currentTime,
    duration,
    playbackRate,
    playPause,
    handleNext,
    seekBy,
    changeSpeed,
    onSeek,
    onTimeUpdate,
    onLoadedMetadata,
  } = usePlayer(songs);

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  const remainingTime = Math.max((duration || 0) - (currentTime || 0), 0);

  if (!activeSong) {
    return (
      <section className="player" aria-label="Audio player">
        <div className="player__meta">
          <p className="player__eyebrow">Now Playing</p>
          <h3 className="player__title">No songs available</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="player" aria-label="Audio player">
      <audio
        ref={audioRef}
        src={activeSong.url}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleNext}
      />

      <div className="player__meta">
        <img
          className="player__poster"
          src={activeSong.posterUrl || "https://via.placeholder.com/120x120?text=No+Art"}
          alt={`${activeSong.title || "Track"} poster`}
        />
        <div className="player__meta-text">
          <p className="player__eyebrow">Now Playing</p>
          <h3 className="player__title">{activeSong.title || "Untitled Track"}</h3>
          {activeSong.artist ? <p className="player__artist">{activeSong.artist}</p> : null}
        </div>
      </div>

      <div className="player__timeline">
        <div className="player__progress-track" aria-hidden="true">
          <span
            className="player__progress-fill"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        <input
          className="player__range"
          type="range"
          min="0"
          max={duration || 0}
          value={Math.min(currentTime, duration || 0)}
          onChange={onSeek}
          step="0.1"
          aria-label="Seek track"
        />
        <div className="player__time-row">
          <span className="u-muted">{formatTime(currentTime)}</span>
          <span className="u-muted">{formatTime(duration)}</span>
          <span className="u-muted">-{formatTime(remainingTime)}</span>
        </div>
      </div>

      <div className="player__controls">
        <button type="button" className="player__btn" onClick={() => seekBy(-5)}>
          -5s
        </button>
        <button
          type="button"
          className="player__btn player__btn--primary"
          onClick={playPause}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button type="button" className="player__btn" onClick={() => seekBy(5)}>
          +5s
        </button>
        <button type="button" className="player__btn" onClick={changeSpeed}>
          {playbackRate}x
        </button>
      </div>
    </section>
  );
}