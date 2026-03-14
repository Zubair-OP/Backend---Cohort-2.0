import "../style/MoodHistory.css";

function formatTimestamp(iso) {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (isToday) return time;
  return `${date.toLocaleDateString([], { month: "short", day: "numeric" })} ${time}`;
}

function extractEmoji(emotion) {
  const match = emotion.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu);
  return match ? match[0] : "😐";
}

function extractMoodName(emotion) {
  return emotion.replace(/[^\w\s]/g, "").trim() || "Neutral";
}

export default function MoodHistory({ history, activeTab, onTabChange, loading }) {
  return (
    <div className="mood-history">
      <div className="mood-history__header">
        <span className="mood-history__icon">📅</span>
        <h2 className="mood-history__title">Mood History Timeline</h2>
      </div>

      <div className="mood-history__tabs">
        <button
          type="button"
          className={`mood-history__tab ${activeTab === "today" ? "mood-history__tab--active" : ""}`}
          onClick={() => onTabChange("today")}
        >
          Today
        </button>
        <button
          type="button"
          className={`mood-history__tab ${activeTab === "week" ? "mood-history__tab--active" : ""}`}
          onClick={() => onTabChange("week")}
        >
          7 Days
        </button>
      </div>

      <div className="mood-history__list">
        {loading ? (
          <p className="mood-history__empty">Loading...</p>
        ) : history.length === 0 ? (
          <p className="mood-history__empty">
            No mood entries yet. Detect your mood to start tracking!
          </p>
        ) : (
          history.map((entry) => (
            <div key={entry._id} className="mood-history__entry">
              <div className="mood-history__timeline-dot" />
              <span className="mood-history__entry-emoji">
                {extractEmoji(entry.emotion)}
              </span>
              <div className="mood-history__entry-info">
                <span className="mood-history__entry-mood">
                  {extractMoodName(entry.emotion)}
                </span>
                <span className="mood-history__entry-time">
                  {formatTimestamp(entry.createdAt)}
                  {entry.songCount > 0 && (
                    <span className="mood-history__entry-songs">
                      {" · "}{entry.songCount} song{entry.songCount > 1 ? "s" : ""}
                    </span>
                  )}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
