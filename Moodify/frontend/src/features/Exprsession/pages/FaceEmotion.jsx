import { useNavigate } from "react-router";
import { useAuth } from "../../Auth/hooks/useAuth";
import { useMoodDashboard } from "../hooks/useMoodDashboard";
import { usePlayer } from "../hooks/usePlayer";
import ExpressionCapture from "../components/ExpressionCapture";
import MoodAnalysis from "../components/MoodAnalysis";
import MoodHistory from "../components/MoodHistory";
import PlaylistPanel from "../components/PlaylistPanel";
import CameraFeed from "../components/CameraFeed";
import MusicPlayerBar from "../components/MusicPlayerBar";
import "../style/FaceEmotion.css";

export default function FaceEmotion() {
  const { HandleLogout } = useAuth();
  const navigate = useNavigate();
  const {
    videoRef, canvasRef, emotion, confidence, isDetecting,
    songs, songsLoading, error, showPlayer,
    handleDetectMood,
    history, activeTab, setActiveTab, historyLoading,
  } = useMoodDashboard();

  const player = usePlayer(songs);

  const onLogout = async () => {
    await HandleLogout();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1 className="dashboard__logo">
          <span className="dashboard__logo-accent">Mood</span>ify
        </h1>
        <button className="dashboard__logout-btn" onClick={onLogout}>Log Out</button>
      </header>

      <div className="dashboard__columns">
        <div className="dashboard__col dashboard__col--left">
          <ExpressionCapture
            emotion={emotion}
            isDetecting={isDetecting}
            songsLoading={songsLoading}
            onDetect={handleDetectMood}
          />
        </div>

        <div className="dashboard__col dashboard__col--center">
          <MoodAnalysis emotion={emotion} confidence={confidence} />
          <MoodHistory
            history={history}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            loading={historyLoading}
          />
        </div>

        <div className="dashboard__col dashboard__col--right">
          <PlaylistPanel
            songs={songs}
            onSelectSong={player.selectSong}
            activeSongIndex={player.currentSongIndex}
          />
          <CameraFeed videoRef={videoRef} canvasRef={canvasRef} />
        </div>
      </div>

      {error && <p className="dashboard__error">{error}</p>}
      {showPlayer && <MusicPlayerBar player={player} />}
    </div>
  );
}