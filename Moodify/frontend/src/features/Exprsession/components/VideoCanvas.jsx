import "../style/VideoCanvas.css";

export default function VideoCanvas({ videoRef, canvasRef }) {
  return (
    <div className="video-canvas-wrapper">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="video-canvas-video"
      />
      <canvas
        ref={canvasRef}
        className="video-canvas-overlay"
      />
    </div>
  );
}
