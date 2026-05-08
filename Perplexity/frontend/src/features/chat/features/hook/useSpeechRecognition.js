import { useCallback, useEffect, useRef, useState } from "react";

const SpeechAPI =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [isMicrophoneAvailable, setIsMicrophoneAvailable] = useState(null);
  const [recognitionError, setRecognitionError] = useState(null);

  const shouldListenRef = useRef(false);
  const finalRef = useRef("");
  const optionsRef = useRef({ continuous: true, language: "en-US" });
  const bootRef = useRef(null);
  const recRef = useRef(null);
  const noSpeechCountRef = useRef(0);

  const browserSupportsSpeechRecognition = Boolean(SpeechAPI);

  const resetTranscript = useCallback(() => {
    finalRef.current = "";
    setTranscript("");
  }, []);

  // bootRef holds the latest boot fn so onend can call it without stale closures
  bootRef.current = () => {
    if (!SpeechAPI || !shouldListenRef.current) return;

    const rec = new SpeechAPI();
    recRef.current = rec;
    rec.continuous = optionsRef.current.continuous;
    rec.interimResults = true;
    rec.lang = optionsRef.current.language;

    rec.onstart = () => {
      setRecognitionError(null);
      setListening(true);
    };

    rec.onresult = (e) => {
      noSpeechCountRef.current = 0;
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalRef.current += e.results[i][0].transcript;
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      setTranscript((finalRef.current + interim).trim());
    };

    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "permission-denied") {
        setIsMicrophoneAvailable(false);
        shouldListenRef.current = false;
        setListening(false);
      } else if (e.error === "network") {
        shouldListenRef.current = false;
        setListening(false);
        setRecognitionError("network");
      } else if (e.error === "audio-capture") {
        shouldListenRef.current = false;
        setListening(false);
        setRecognitionError("audio-capture");
      } else if (e.error === "no-speech") {
        noSpeechCountRef.current += 1;
        if (noSpeechCountRef.current >= 3) {
          shouldListenRef.current = false;
          setListening(false);
          setRecognitionError("no-speech");
          noSpeechCountRef.current = 0;
        }
      }
    };

    // Chrome stops recognition after silence even with continuous:true — restart it
    rec.onend = () => {
      if (shouldListenRef.current) {
        setTimeout(() => bootRef.current?.(), 150);
      } else {
        setListening(false);
      }
    };

    try {
      rec.start();
    } catch (err) {
      console.error("SpeechRecognition start error:", err);
    }
  };

  const startListening = useCallback(
    ({ continuous = true, language = "en-US" } = {}) => {
      if (!browserSupportsSpeechRecognition) return;
      optionsRef.current = { continuous, language };
      shouldListenRef.current = true;
      noSpeechCountRef.current = 0;
      setRecognitionError(null);
      bootRef.current();
    },
    [browserSupportsSpeechRecognition]
  );

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    setListening(false);
    if (recRef.current) {
      recRef.current.abort();
      recRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      if (recRef.current) {
        recRef.current.abort();
        recRef.current = null;
      }
    };
  }, []);

  return {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    recognitionError,
    startListening,
    stopListening,
  };
}
