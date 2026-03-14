import "../style/ExpressionCapture.css";

const MOOD_EMOJIS = {
  Happy: "😊",
  Sad: "😢",
  Angry: "😠",
  Neutral: "😐",
};

function extractMoodName(emotion) {
  return emotion.replace(/[^\w\s]/g, "").trim() || "Neutral";
}

export default function ExpressionCapture({ emotion, isDetecting, songsLoading, onDetect }) {
  const moodName = extractMoodName(emotion);
  const moodEmoji = MOOD_EMOJIS[moodName] || "😐";

  return (
    <div className="expression-capture">
      <div className="expression-capture__header">
        <span className="expression-capture__icon">🎭</span>
        <h2 className="expression-capture__title">Expression Capture</h2>
      </div>

      <div className="expression-capture__mood-display">
        <span className="expression-capture__emoji">{moodEmoji}</span>
        <div className="expression-capture__mood-text">
          <span className="expression-capture__label">Detected Mood</span>
          <span className="expression-capture__mood">{moodName}</span>
        </div>
      </div>

      <div className="expression-capture__status">
        <span className="expression-capture__status-dot" />
        <span className="expression-capture__status-text">
          {isDetecting ? "Analyzing..." : "Ready to detect"}
        </span>
      </div>

      <button
        type="button"
        className="expression-capture__detect-btn"
        onClick={onDetect}
        disabled={isDetecting || songsLoading}
      >
        <span className="expression-capture__btn-glow" />
        {isDetecting ? "Detecting..." : songsLoading ? "Loading..." : "Detect Again"}
      </button>
    </div>
  );
}
