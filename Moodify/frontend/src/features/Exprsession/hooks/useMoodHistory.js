import { useState, useCallback, useEffect } from "react";
import { saveMoodEntry, fetchMoodHistory } from "../services/MoodHistory.Api";

export function useMoodHistory() {
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("today");
  const [loading, setLoading] = useState(false);

  const loadHistory = useCallback(async (filter) => {
    setLoading(true);
    try {
      const data = await fetchMoodHistory(filter);
      setHistory(Array.isArray(data.entries) ? data.entries : []);
    } catch (err) {
      console.error("Failed to load mood history:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory(activeTab);
  }, [activeTab, loadHistory]);

  const addEntry = useCallback(async (emotionLabel, songCount) => {
    try {
      await saveMoodEntry(emotionLabel, songCount);
      await loadHistory(activeTab);
    } catch (err) {
      console.error("Failed to save mood entry:", err);
    }
  }, [activeTab, loadHistory]);

  const changeTab = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  return { history, addEntry, activeTab, setActiveTab: changeTab, loading };
}
