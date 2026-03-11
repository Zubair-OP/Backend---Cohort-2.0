import { useEffect, useRef, useState, useCallback } from "react";
import { createFaceLandmarker } from "../services/faceLandmarker.service";
import { detectEmotion } from "../services/emotionDetector.service";

export function useFaceEmotion() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const landmarkerRef = useRef(null);
  const [emotion, setEmotion] = useState("Waiting for detection");
  const [isDetecting, setIsDetecting] = useState(false);

  const drawLandmarks = useCallback((ctx, faceLandmarks, width, height) => {
    faceLandmarks.forEach((landmarks) => {
      ctx.fillStyle = "#00ff00";
      landmarks.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x * width, point.y * height, 1.5, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  }, []);

  const detectCurrentEmotion = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !landmarkerRef.current) {
      setEmotion("Detector not ready");
      return null;
    }

    if (video.readyState < 2) {
      setEmotion("Camera is still loading");
      return null;
    }

    setIsDetecting(true);

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const results = landmarkerRef.current.detectForVideo(video, performance.now());

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.faceLandmarks) {
      drawLandmarks(ctx, results.faceLandmarks, canvas.width, canvas.height);
    }

    let detected = "No Face ❓";

    if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
      const blendshapes = results.faceBlendshapes[0].categories;
      detected = detectEmotion(blendshapes);
    }

    setEmotion(detected);
    setIsDetecting(false);
    return detected;
  }, [drawLandmarks]);

  const startCamera = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;

    const init = async () => {
      landmarkerRef.current = await createFaceLandmarker();
      await startCamera();
    };

    init();

    return () => {
      if (videoElement?.srcObject) {
        videoElement.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [startCamera]);

  return { videoRef, canvasRef, emotion, isDetecting, detectCurrentEmotion };
}
