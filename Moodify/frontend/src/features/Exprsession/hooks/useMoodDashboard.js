import { useState, useCallback } from "react";
import { useFaceEmotion } from "./useFaceEmotion";
import { useMoodHistory } from "./useMoodHistory";
import { getEmotion } from "../services/Emotion.Api";

export function useMoodDashboard() {
  const { videoRef, canvasRef, emotion, confidence, isDetecting, detectCurrentEmotion } =
    useFaceEmotion();
  const { history, addEntry, activeTab, setActiveTab, loading: historyLoading } = useMoodHistory();

  const [songs, setSongs] = useState([]);
  const [songsLoading, setSongsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPlayer, setShowPlayer] = useState(false);

  const handleDetectMood = useCallback(async () => {
    setError("");
    const detectedEmotion = await detectCurrentEmotion();

    if (!detectedEmotion || detectedEmotion.includes("No Face")) {
      setSongs([]);
      setShowPlayer(false);
      return;
    }

    setSongsLoading(true);

    try {
      const response = await getEmotion(detectedEmotion);
      const moodSongs = Array.isArray(response?.songs) ? response.songs : [];
      setSongs(moodSongs);
      setShowPlayer(moodSongs.length > 0);
      addEntry(detectedEmotion, moodSongs.length);

      if (!moodSongs.length) {
        setError("No songs found for this mood. Upload songs for this mood first.");
      }
    } catch (apiError) {
      setSongs([]);
      setShowPlayer(false);
      addEntry(detectedEmotion, 0);
      setError(apiError?.response?.data?.message || "Could not fetch songs.");
    } finally {
      setSongsLoading(false);
    }
  }, [detectCurrentEmotion, addEntry]);

  return {
    videoRef, canvasRef, emotion, confidence, isDetecting,
    songs, songsLoading, error, showPlayer,
    handleDetectMood,
    history, activeTab, setActiveTab, historyLoading,
  };
}
