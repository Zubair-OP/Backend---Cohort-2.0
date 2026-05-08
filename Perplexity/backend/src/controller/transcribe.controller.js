import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No audio file provided" });
    }

    const mimeType = req.file.mimetype || "audio/webm";
    const ext = mimeType.includes("mp4") ? "mp4" : "webm";

    const file = new File([req.file.buffer], `audio.${ext}`, { type: mimeType });

    const transcription = await groq.audio.transcriptions.create({
      file,
      model: "whisper-large-v3",
      response_format: "json",
    });

    res.json({ transcript: transcription.text });
  } catch (error) {
    console.error("Transcription error:", error);
    res.status(500).json({ message: "Transcription failed" });
  }
};
