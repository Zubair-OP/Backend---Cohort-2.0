import { useState, useRef, useEffect } from "react";
import {
  PaperAirplaneIcon,
  MicrophoneIcon,
  PaperClipIcon,
  StopIcon,
} from "@heroicons/react/24/outline";

const MessageInput = ({ onSend, onStop, isLoading }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
      
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setMessage(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setMessage("");
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Recognition already started", e);
      }
    }
  };

  const handleInput = (e) => {
    setMessage(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
    }
  };

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    
    onSend?.(trimmed);
    setMessage("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = message.trim().length > 0 && !isLoading;

  return (
    <div className="sticky bottom-0 w-full px-4 md:px-6 pb-4 pt-3 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f] to-transparent">
      <div className="max-w-[760px] mx-auto">
        <div className="flex items-center gap-2 rounded-[12px] border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-3 focus-within:border-[#20b2aa]">
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-[#888888] hover:bg-[#1f1f1f] hover:text-white shrink-0">
            <PaperClipIcon className="w-5 h-5" />
          </button>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            className="flex-1 resize-none bg-transparent py-2 text-white placeholder-[#555555] text-sm leading-6 outline-none min-h-[40px] max-h-[200px] scrollbar-hide"
          />

          <button 
            onClick={toggleListening} 
            className={`transition-colors duration-150 flex items-center justify-center shrink-0 w-9 h-9 rounded-full ${
              isListening ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' : 
              'text-[#888888] hover:text-white hover:bg-[#1f1f1f]'
            }`}
            title={isListening ? "Stop listening" : "Start Voice Input"}
          >
            {isListening ? (
              <div className="flex items-center gap-[2px] h-4 justify-center">
                <style>{`
                  @keyframes soundWave {
                    0%, 100% { height: 4px; }
                    50% { height: 16px; }
                  }
                  .bar-1 { animation: soundWave 1s ease-in-out infinite; animation-delay: 0s; }
                  .bar-2 { animation: soundWave 1s ease-in-out infinite; animation-delay: 0.2s; }
                  .bar-3 { animation: soundWave 1s ease-in-out infinite; animation-delay: 0.4s; }
                  .bar-4 { animation: soundWave 1s ease-in-out infinite; animation-delay: 0.1s; }
                  .bar-5 { animation: soundWave 1s ease-in-out infinite; animation-delay: 0.3s; }
                `}</style>
                <div className="w-[2.5px] bg-red-500 rounded-full bar-1"></div>
                <div className="w-[2.5px] bg-red-500 rounded-full bar-2"></div>
                <div className="w-[2.5px] bg-red-500 rounded-full bar-3"></div>
                <div className="w-[2.5px] bg-red-500 rounded-full bar-4"></div>
                <div className="w-[2.5px] bg-red-500 rounded-full bar-5"></div>
              </div>
            ) : (
              <MicrophoneIcon className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={isLoading ? onStop : handleSend}
            disabled={!canSend && !isLoading}
            title={isLoading ? "Stop generating" : "Send message"}
            className={`
              w-10 h-10 flex items-center justify-center rounded-full shrink-0 transition-all duration-150
              ${canSend || isLoading
                ? "bg-[#20b2aa] text-white hover:opacity-90"
                : "bg-[#202020] text-[#666666] cursor-not-allowed"
              }
            `}
          >
            {isLoading ? (
              <StopIcon className="w-4 h-4" />
            ) : (
              <PaperAirplaneIcon className="w-4 h-4" />
            )}
          </button>
        </div>

        <p className="text-center text-[10px] text-[#666666] mt-2">
          AI can make mistakes. Consider checking important info.
        </p>
      </div>
    </div>
  );
};

export default MessageInput;
