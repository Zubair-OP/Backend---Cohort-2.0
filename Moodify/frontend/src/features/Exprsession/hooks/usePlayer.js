import { useEffect, useMemo, useRef, useState } from "react";
import { PLAYBACK_SPEEDS } from "../services/player.utils";

export function usePlayer(songs) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const playlist = useMemo(
    () =>
      Array.isArray(songs)
        ? songs.filter((song) => song && typeof song.url === "string" && song.url.trim())
        : [],
    [songs]
  );

  const activeSong = playlist[currentSongIndex] ?? playlist[0] ?? null;

  // Keep index in bounds when playlist changes
  useEffect(() => {
    setCurrentSongIndex((prev) => Math.min(prev, playlist.length - 1));
  }, [playlist.length]);

  // Reset playback state when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  }, [currentSongIndex]);

  const playPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  };

  const handleNext = () => {
    if (!playlist.length) return;
    setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
  };

  const seekBy = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextTime = Math.max(0, Math.min((audio.currentTime || 0) + seconds, duration || 0));
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const changeSpeed = () => {
    const nextRate =
      PLAYBACK_SPEEDS[(PLAYBACK_SPEEDS.indexOf(playbackRate) + 1) % PLAYBACK_SPEEDS.length];
    if (audioRef.current) audioRef.current.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const onSeek = (event) => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextTime = Number(event.target.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const onTimeUpdate = (event) => setCurrentTime(event.currentTarget.currentTime);
  const onLoadedMetadata = (event) => setDuration(event.currentTarget.duration || 0);

  return {
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
  };
}
