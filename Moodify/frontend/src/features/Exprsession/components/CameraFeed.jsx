import "../style/CameraFeed.css";

export default function CameraFeed({ videoRef, canvasRef }) {
  return (
    <div className="camera-feed">
      <div className="camera-feed__header">
        <span className="camera-feed__live-dot" />
        <span className="camera-feed__label">Live Camera</span>
      </div>
      <div className="camera-feed__viewport">
        <video ref={videoRef} autoPlay playsInline className="camera-feed__video" />
        <canvas ref={canvasRef} className="camera-feed__canvas" />
      </div>
    </div>
  );
}
