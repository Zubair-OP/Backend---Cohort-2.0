import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-cohort-2-0-hftg.onrender.com",
  withCredentials: true,
});

export const saveMoodEntry = async (emotion, songCount) => {
  const response = await api.post("/api/mood-history", { emotion, songCount });
  return response.data;
};

export const fetchMoodHistory = async (filter = "today") => {
  const response = await api.get("/api/mood-history", { params: { filter } });
  return response.data;
};
