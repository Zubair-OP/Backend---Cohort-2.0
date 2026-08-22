import { useCallback, useEffect, useRef, useState } from "react";
import { useVoiceRecorder } from "../hook/useVoiceRecorder.js";
import {
  PaperAirplaneIcon,
  MicrophoneIcon,
  PaperClipIcon,
  StopIcon,
} from "@heroicons/react/24/outline";

const VoiceWaves = () => (
  <div className="flex items-center gap-[2px] h-4 justify-center">
    {[0, 1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="w-[2.5px] bg-state-error rounded-full"
        style={{
          height: "4px",
          animation: `soundWave 1s ease-in-out infinite`,
          animationDelay: `${i * 0.15}s`,
        }}
      />
    ))}
    <style>{`
      @keyframes soundWave {
        0%, 100% { height: 4px; }
        50% { height: 14px; }
      }
    `}</style>
  </div>
);

const MessageInput = ({ onSend, onStop, isLoading }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const handleTranscript = useCallback((text) => {
    if (!text) return;
    setMessage((prev) => {
      const base = prev.trim();
      return base ? `${base} ${text}` : text;
    });
  }, []);

  const { recording, transcribing, error, toggle } = useVoiceRecorder({
    onTranscript: handleTranscript,
  });

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [message]);

  const handleInput = (event) => {
    setMessage(event.target.value);
  };

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;
    onSend?.(trimmed);
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const canSend = message.trim().length > 0 && !isLoading;

  const statusText =
    error === "permission-denied"
      ? "Microphone access blocked. Allow permission and try again."
      : error === "not-supported"
      ? "Voice recording is not supported in this browser."
      : error === "transcription-failed"
      ? "Transcription failed. Please try again."
      : error === "mic-error"
      ? "Could not access microphone. Check your device."
      : transcribing
      ? "Transcribing your voice..."
      : recording
      ? "Recording... click mic again to stop."
      : "AI can make mistakes. Consider checking important info.";

  const isError = Boolean(error);
  const isStatus = !error && (recording || transcribing);

  return (
    <div className="sticky bottom-0 w-full px-4 md:px-6 pb-5 pt-4 bg-gradient-to-t from-surface-0 via-surface-0/95 to-transparent">
      <div className="max-w-chat mx-auto">
        {/* Double-bezel outer shell */}
        <div className="rounded-[1.25rem] bg-surface-2/60 border border-border/60 p-[3px] shadow-elevated focus-within:border-accent/20 focus-within:shadow-glow transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
          {/* Inner core */}
          <div className="rounded-[1rem] bg-surface-2/80 border border-white/[0.03] shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]">
            <div className="flex items-end gap-1 p-2">
              <button
                type="button"
                className="flex items-center justify-center w-9 h-9 rounded-xl text-fg-muted hover:text-fg-secondary hover:bg-white/[0.04] transition-all duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 mb-0.5 focus-ring active:scale-95"
                aria-label="Attach file"
              >
                <PaperClipIcon className="w-[18px] h-[18px]" />
              </button>

              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                rows={1}
                className="flex-1 resize-none bg-transparent py-2.5 px-1 text-fg-primary placeholder-fg-muted text-sm leading-6 outline-none min-h-[40px] max-h-[200px] scrollbar-hide"
                aria-label="Message input"
              />

              <button
                type="button"
                onClick={toggle}
                disabled={transcribing}
                className={`flex items-center justify-center shrink-0 w-9 h-9 rounded-xl transition-all duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] mb-0.5 focus-ring active:scale-95 ${
                  recording
                    ? "bg-state-error/10 hover:bg-state-error/15 text-state-error animate-pulse-soft"
                    : transcribing
                    ? "text-fg-muted cursor-not-allowed"
                    : "text-fg-muted hover:text-fg-secondary hover:bg-white/[0.04]"
                }`}
                title={
                  recording
                    ? "Stop recording"
                    : transcribing
                    ? "Transcribing..."
                    : "Start voice input"
                }
                aria-label={recording ? "Stop recording" : "Start voice input"}
              >
                {recording ? (
                  <VoiceWaves />
                ) : transcribing ? (
                  <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MicrophoneIcon className="w-[18px] h-[18px]" />
                )}
              </button>

              {/* Send / Stop — pill button with inner icon wrapper */}
              <button
                type="button"
                onClick={isLoading ? onStop : handleSend}
                disabled={!canSend && !isLoading}
                title={isLoading ? "Stop generating" : "Send message"}
                aria-label={isLoading ? "Stop generating" : "Send message"}
                className={`
                  group flex items-center justify-center shrink-0 w-9 h-9 rounded-xl mb-0.5 focus-ring active:scale-95
                  transition-all duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                  ${
                    canSend || isLoading
                      ? "bg-accent text-surface-0 hover:bg-accent-hover shadow-[0_0_16px_rgba(20,184,166,0.2)]"
                      : "bg-white/[0.04] text-fg-muted cursor-not-allowed"
                  }
                `}
              >
                {isLoading ? (
                  <StopIcon className="w-4 h-4 transition-transform duration-200" />
                ) : (
                  <PaperAirplaneIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <p
          className={`text-center text-[10px] mt-2.5 transition-colors duration-300 ${
            isError
              ? "text-state-error"
              : isStatus
              ? "text-accent"
              : "text-fg-muted"
          }`}
          role={isError ? "alert" : undefined}
        >
          {statusText}
        </p>
      </div>
    </div>
  );
};

export default MessageInput;
