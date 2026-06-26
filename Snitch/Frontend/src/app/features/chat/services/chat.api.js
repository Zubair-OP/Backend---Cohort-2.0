import { API_BASE_URL } from '../../../config/apiBaseUrl.js';

// Base URL comes from an env var in production and localhost in development.
const STREAM_URL = `${API_BASE_URL}/api/chat/stream`;

/**
 * Send a message and consume the bot reply as a Server-Sent Events stream.
 *
 * Uses fetch + ReadableStream (rather than EventSource) because the request
 * needs to POST a body and send credentials.
 *
 * @param {Object}   params
 * @param {string}   params.message    user message text
 * @param {string}   params.sessionId  current chat session id (may be null)
 * @param {string}   params.visitorId  persistent visitor id
 * @param {AbortSignal} params.signal   to cancel an in-flight request
 * @param {Function} params.onToken    (token: string) => void, per streamed token
 * @param {Function} params.onSession  (sessionId: string) => void, once known
 * @param {Function} params.onDone     () => void, when the stream completes
 * @param {Function} params.onError    (message: string) => void, on failure
 */
export async function streamChat({
  message,
  sessionId,
  visitorId,
  signal,
  onToken,
  onSession,
  onDone,
  onError,
}) {
  try {
    const response = await fetch(STREAM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // send the visitorId cookie if present
      body: JSON.stringify({ message, sessionId, visitorId }),
      signal,
    });

    if (!response.ok || !response.body) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    // Read the stream chunk by chunk and split into SSE frames ("data: ...\n\n").
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const frames = buffer.split("\n\n");
      // Keep the last (possibly partial) frame in the buffer.
      buffer = frames.pop() || "";

      for (const frame of frames) {
        const line = frame.trim();
        if (!line.startsWith("data:")) continue;

        const json = line.slice(5).trim();
        if (!json) continue;

        let payload;
        try {
          payload = JSON.parse(json);
        } catch {
          continue; // ignore malformed frames
        }

        if (payload.sessionId) onSession?.(payload.sessionId);
        if (payload.token) onToken?.(payload.token);
        if (payload.error) {
          onError?.(payload.error);
          return;
        }
        if (payload.done) {
          onDone?.();
          return;
        }
      }
    }

    // Stream ended without an explicit "done" frame — treat as complete.
    onDone?.();
  } catch (error) {
    // Aborts are expected (user closed/sent again) and should stay silent.
    if (error.name === "AbortError") return;
    console.error("streamChat failed:", error);
    onError?.("I'm having trouble right now. Please try again in a moment.");
  }
}
