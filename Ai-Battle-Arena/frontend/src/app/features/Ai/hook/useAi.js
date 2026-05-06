import { useDispatch } from "react-redux";
import { setResult, setLoading, setError } from "../state/Ai.slice";
import { askAi } from "../services/Ai.Api";

export function useAi() {
  const dispatch = useDispatch();

  const handleAiResponse = async (question) => {
    dispatch(setLoading(true));
    try {
      const res = await askAi(question);
      dispatch(setResult(res.data));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    handleAiResponse,
  };
}