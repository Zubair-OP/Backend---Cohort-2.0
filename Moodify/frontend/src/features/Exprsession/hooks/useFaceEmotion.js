import { useEffect, useRef, useState, useCallback } from "react";
import { createFaceLandmarker } from "../services/faceLandmarker.service";
import { detectEmotion } from "../services/emotionDetector.service";

export function useFaceEmotion() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animFrameRef = useRef(null);
  const [emotion, setEmotion] = useState("Detecting...");

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

  const startDetectionLoop = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const processFrame = () => {
      if (!landmarkerRef.current) return;

      const results = landmarkerRef.current.detectForVideo(
        video,
        performance.now()
      );

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.faceLandmarks) {
        drawLandmarks(ctx, results.faceLandmarks, canvas.width, canvas.height);
      }

      if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
        const blendshapes = results.faceBlendshapes[0].categories;
        setEmotion(detectEmotion(blendshapes));
      } else {
        setEmotion("No Face ❓");
      }

      animFrameRef.current = requestAnimationFrame(processFrame);
    };

    processFrame();
  }, [drawLandmarks]);

  const startCamera = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.onloadeddata = () => startDetectionLoop();
  }, [startDetectionLoop]);

  useEffect(() => {
    const init = async () => {
      landmarkerRef.current = await createFaceLandmarker();
      await startCamera();
    };

    init();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [startCamera]);

  return { videoRef, canvasRef, emotion };
}
