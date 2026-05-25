import { useReducer, useRef, useCallback, useEffect } from "react";
import { streamChat } from "../services/chat.api";

const VISITOR_KEY = "snitch_visitor_id";
const SESSION_KEY = "snitch_session_id";

// A stable per-browser visitor id (created once, kept in localStorage).
function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

const WELCOME = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm the Snitch Assistant. Ask me about our products, sizing, orders, shipping or returns and I'll help you out.",
};

const initialState = {
  isOpen: false,
  messages: [WELCOME],
  isStreaming: false,
  sessionId: sessionStorage.getItem(SESSION_KEY) || null,
};

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_OPEN":
      return { ...state, isOpen: !state.isOpen };

    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.message] };

    // Append a streamed token to the last (assistant) message.
    case "APPEND_TOKEN": {
      const messages = state.messages.slice();
      const last = messages[messages.length - 1];
      messages[messages.length - 1] = {
        ...last,
        content: last.content + action.token,
      };
      return { ...state, messages };
    }

    case "SET_STREAMING":
      return { ...state, isStreaming: action.value };

    case "SET_SESSION":
      return { ...state, sessionId: action.sessionId };

    // On failure, drop the error into the open (empty) assistant bubble.
    case "SET_ERROR": {
      const messages = state.messages.slice();
      const last = messages[messages.length - 1];
      if (last && last.role === "assistant" && last.content === "") {
        messages[messages.length - 1] = { ...last, content: action.message };
      } else {
        messages.push({
          id: crypto.randomUUID(),
          role: "assistant",
          content: action.message,
        });
      }
      return { ...state, messages, isStreaming: false };
    }

    default:
      return state;
  }
}

export function useChat() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const visitorIdRef = useRef(getVisitorId());
  const abortRef = useRef(null);

  // Persist the session id so a page reload continues the same conversation.
  useEffect(() => {
    if (state.sessionId) sessionStorage.setItem(SESSION_KEY, state.sessionId);
  }, [state.sessionId]);

  // Cancel any in-flight stream when the widget unmounts.
  useEffect(() => () => abortRef.current?.abort(), []);

  const toggleOpen = useCallback(() => dispatch({ type: "TOGGLE_OPEN" }), []);

  const sendMessage = useCallback(
    (rawText) => {
      const text = rawText.trim();
      // Guard against empty input and overlapping sends (rapid clicking).
      if (!text || state.isStreaming) return;

      dispatch({
        type: "ADD_MESSAGE",
        message: { id: crypto.randomUUID(), role: "user", content: text },
      });

      // Placeholder assistant bubble that tokens stream into.
      dispatch({
        type: "ADD_MESSAGE",
        message: { id: crypto.randomUUID(), role: "assistant", content: "" },
      });
      dispatch({ type: "SET_STREAMING", value: true });

      const controller = new AbortController();
      abortRef.current = controller;

      streamChat({
        message: text,
        sessionId: state.sessionId,
        visitorId: visitorIdRef.current,
        signal: controller.signal,
        onSession: (sessionId) => dispatch({ type: "SET_SESSION", sessionId }),
        onToken: (token) => dispatch({ type: "APPEND_TOKEN", token }),
        onDone: () => dispatch({ type: "SET_STREAMING", value: false }),
        onError: (message) => dispatch({ type: "SET_ERROR", message }),
      });
    },
    [state.isStreaming, state.sessionId],
  );

  return {
    isOpen: state.isOpen,
    messages: state.messages,
    isStreaming: state.isStreaming,
    toggleOpen,
    sendMessage,
  };
}
