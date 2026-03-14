import "../style/MoodAnalysis.css";

const MOOD_EMOJIS = {
  Happy: "😊",
  Sad: "😢",
  Angry: "😠",
  Neutral: "😐",
};

function extractMoodName(emotion) {
  return emotion.replace(/[^\w\s]/g, "").trim() || "Neutral";
}

export default function MoodAnalysis({ emotion, confidence }) {
  const moodName = extractMoodName(emotion);
  const emoji = MOOD_EMOJIS[moodName] || "😐";
  const percentage = Math.round(confidence * 100);

  return (
    <div className="mood-analysis">
      <div className="mood-analysis__header">
        <span className="mood-analysis__icon">📊</span>
        <h2 className="mood-analysis__title">Current Mood Analysis</h2>
      </div>

      <div className="mood-analysis__content">
        <div className="mood-analysis__emoji-large">{emoji}</div>

        <div className="mood-analysis__details">
          <div className="mood-analysis__mood-label">{moodName}</div>
          <div className="mood-analysis__bar-container">
            <div className="mood-analysis__bar-label">
              <span>Match Confidence</span>
              <span className="mood-analysis__percentage">{percentage}%</span>
            </div>
            <div className="mood-analysis__bar-track">
              <div
                className="mood-analysis__bar-fill"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
