import { useState, useRef, useEffect } from "react";
import {
  PaperAirplaneIcon,
  MicrophoneIcon,
  PlusCircleIcon,
  StopIcon,
} from "@heroicons/react/24/outline";

const MessageInput = ({ onSend, isLoading }) => {
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
    <div className="sticky bottom-0 w-full px-4 pb-4 pt-2 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/95 to-transparent">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-end gap-2 bg-[#1a1a2e]/80 border border-white/[0.08] rounded-2xl px-4 py-3 shadow-xl shadow-black/30 focus-within:border-white/20 transition-colors duration-200 backdrop-blur-sm">
          <button className="mb-0.5 p-1 text-[#8e8ea0] hover:text-white transition-colors duration-200 shrink-0">
            <PlusCircleIcon className="w-5 h-5" />
          </button>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-[#e5e5e5] placeholder-[#555570] text-sm leading-6 outline-none min-h-[24px] max-h-[200px] scrollbar-hide"
          />

          <button 
            onClick={toggleListening} 
            className={`mb-0.5 transition-colors duration-200 flex items-center justify-center shrink-0 w-8 h-8 rounded-full ${
              isListening ? 'bg-red-500/10 hover:bg-red-500/20' : 
              'text-[#8e8ea0] hover:text-white hover:bg-white/5'
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
            onClick={isLoading ? undefined : handleSend}
            disabled={!canSend && !isLoading}
            className={`
              mb-0.5 p-2 rounded-lg shrink-0 transition-all duration-200
              ${canSend || isLoading
                ? "bg-white text-black hover:bg-white/90 shadow-md"
                : "bg-white/[0.06] text-[#555570] cursor-not-allowed"
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

        <p className="text-center text-[10px] text-[#555570] mt-2">
          AI can make mistakes. Consider checking important info.
        </p>
      </div>
    </div>
  );
};

export default MessageInput;
