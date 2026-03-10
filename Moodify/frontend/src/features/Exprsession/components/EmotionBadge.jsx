import "../style/EmotionBadge.css";

export default function EmotionBadge({ emotion }) {
  return (
    <div className="emotion-badge">
      {emotion}
    </div>
  );
}
