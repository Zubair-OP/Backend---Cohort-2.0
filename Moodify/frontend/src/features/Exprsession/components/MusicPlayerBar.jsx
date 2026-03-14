import { formatTime } from "../services/player.utils";
import "../style/MusicPlayerBar.css";

export default function MusicPlayerBar({ player }) {
  const {
    audioRef,
    isPlaying,
    activeSong,
    currentTime,
    duration,
    playPause,
    handleNext,
    handlePrev,
    onSeek,
    onTimeUpdate,
    onLoadedMetadata,
  } = player;

  const progress = duration ? (currentTime / duration) * 100 : 0;

  if (!activeSong) return null;

  return (
    <div className="music-bar">
      <audio
        ref={audioRef}
        src={activeSong.url}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleNext}
      />

      <div className="music-bar__left">
        <img
          className="music-bar__thumb"
          src={activeSong.posterUrl || "/vite.svg"}
          alt={activeSong.title || "Track"}
        />
        <div className="music-bar__info">
          <span className="music-bar__title">{activeSong.title || "Untitled"}</span>
          {activeSong.artist && (
            <span className="music-bar__artist">{activeSong.artist}</span>
          )}
        </div>
      </div>

      <div className="music-bar__center">
        <div className="music-bar__controls">
          <button type="button" className="music-bar__btn" onClick={handlePrev}>
            ⏮
          </button>
          <button
            type="button"
            className="music-bar__btn music-bar__btn--play"
            onClick={playPause}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button type="button" className="music-bar__btn" onClick={handleNext}>
            ⏭
          </button>
        </div>
        <div className="music-bar__progress">
          <span className="music-bar__time">{formatTime(currentTime)}</span>
          <div className="music-bar__track">
            <div
              className="music-bar__fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
            <input
              className="music-bar__range"
              type="range"
              min="0"
              max={duration || 0}
              value={Math.min(currentTime, duration || 0)}
              onChange={onSeek}
              step="0.1"
              aria-label="Seek"
            />
          </div>
          <span className="music-bar__time">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
