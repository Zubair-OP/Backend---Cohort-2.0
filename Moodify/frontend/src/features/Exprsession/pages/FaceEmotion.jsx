import { useState } from "react";
import { useFaceEmotion } from "../hooks/useFaceEmotion";
import VideoCanvas from "../components/VideoCanvas";
import EmotionBadge from "../components/EmotionBadge";
import Player from "../components/Player";
import { getEmotion } from "../services/Emotion.Api";
import "../style/FaceEmotion.css";

export default function FaceEmotion() {
  const { videoRef, canvasRef, emotion, isDetecting, detectCurrentEmotion } =
    useFaceEmotion();
  const [songs, setSongs] = useState([]);
  const [songsLoading, setSongsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPlayer, setShowPlayer] = useState(false);

  const handleDetectMood = async () => {
    setError("");
    setShowPlayer(false);

    const detectedEmotion = await detectCurrentEmotion();
    if (!detectedEmotion || detectedEmotion.includes("No Face")) {
      setSongs([]);
      return;
    }

    setSongsLoading(true);
    try {
      const response = await getEmotion(detectedEmotion);
      const moodSongs = Array.isArray(response?.songs) ? response.songs : [];
      setSongs(moodSongs);
      setShowPlayer(true);

      if (!moodSongs.length) {
        setError("Is mood ke liye songs nahi mile. Pehle backend me songs upload karo.");
      }
    } catch (apiError) {
      setSongs([]);
      setError(apiError?.response?.data?.message || "Songs fetch nahi ho paye.");
    } finally {
      setSongsLoading(false);
    }
  };

  return (
    <div className="face-emotion-page">
      <VideoCanvas videoRef={videoRef} canvasRef={canvasRef} />
      <EmotionBadge emotion={emotion} />

      <button
        type="button"
        className="detect-btn"
        onClick={handleDetectMood}
        disabled={isDetecting || songsLoading}
      >
        {isDetecting ? "Detecting..." : songsLoading ? "Loading songs..." : "Detect Mood"}
      </button>

      {error ? <p className="face-emotion-error">{error}</p> : null}

      {showPlayer ? (
        <div className="face-emotion-player">
          <Player songs={songs} />
        </div>
      ) : null}
    </div>
  );
}