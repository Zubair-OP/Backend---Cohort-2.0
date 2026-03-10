import { useFaceEmotion } from "../hooks/useFaceEmotion";
import VideoCanvas from "../components/VideoCanvas";
import EmotionBadge from "../components/EmotionBadge";
import "../style/FaceEmotion.css";

export default function FaceEmotion() {
  const { videoRef, canvasRef, emotion } = useFaceEmotion();

  return (
    <div className="face-emotion-page">
      <VideoCanvas videoRef={videoRef} canvasRef={canvasRef} />
      <EmotionBadge emotion={emotion} />
    </div>
  );
}