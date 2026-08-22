import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SUPPORTED_FORMATS = {
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/mp4": "mp4",
  "audio/x-m4a": "m4a",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
};

export const transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No audio file provided" });
    }

    const mimeType = req.file.mimetype;
    const ext = SUPPORTED_FORMATS[mimeType] || "webm";

    const file = new File([req.file.buffer], `audio.${ext}`, { type: mimeType });

    const transcription = await groq.audio.transcriptions.create({
      file,
      model: "whisper-large-v3",
      response_format: "json",
    });

    res.json({ success: true, transcript: transcription.text });
  } catch (error) {
    console.error("Transcription error:", error?.message || error);
    res.status(500).json({ success: false, message: "Transcription failed" });
  }
};
