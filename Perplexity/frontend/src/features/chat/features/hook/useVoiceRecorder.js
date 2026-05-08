import { useCallback, useRef, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function useVoiceRecorder({ onTranscript } = {}) {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("not-supported");
      return;
    }

    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      const mr = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];

        if (blob.size === 0) return;

        setTranscribing(true);
        try {
          const ext = mimeType.includes("webm") ? "webm" : "mp4";
          const form = new FormData();
          form.append("audio", blob, `recording.${ext}`);

          const res = await fetch(`${BASE_URL}/api/transcribe`, {
            method: "POST",
            body: form,
            credentials: "include",
          });

          if (!res.ok) throw new Error("failed");
          const { transcript } = await res.json();
          onTranscript?.(transcript?.trim() || "");
        } catch {
          setError("transcription-failed");
        } finally {
          setTranscribing(false);
        }
      };

      mr.start();
      setRecording(true);
    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("permission-denied");
      } else {
        setError("mic-error");
      }
    }
  }, [onTranscript]);

  const stopRecording = useCallback(() => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") {
      mr.stop();
      setRecording(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [recording, startRecording, stopRecording]);

  return { recording, transcribing, error, toggle };
}
