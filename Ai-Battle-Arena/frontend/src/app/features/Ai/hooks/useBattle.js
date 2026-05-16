import { useState, useRef, useCallback } from 'react';
import { askAi } from '../services/Ai.Api';

export function useBattle() {
  const [status, setStatus] = useState('idle');
  const [model1Text, setModel1Text] = useState('');
  const [model2Text, setModel2Text] = useState('');
  const [model1Done, setModel1Done] = useState(false);
  const [model2Done, setModel2Done] = useState(false);
  const [judgeData, setJudgeData] = useState(null);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [error, setError] = useState(null);

  const handles = useRef([]);

  const clearAll = () => {
    handles.current.forEach(h => { clearTimeout(h); clearInterval(h); });
    handles.current = [];
  };

  const typeText = (fullText, setter, onDone) => {
    let index = 0;
    const chunk = Math.max(1, Math.ceil(fullText.length / 55));

    const id = setInterval(() => {
      index = Math.min(index + chunk, fullText.length);
      setter(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(id);
        onDone();
      }
    }, 22);

    handles.current.push(id);
  };

  const triggerBattle = useCallback(async (query) => {
    clearAll();
    setModel1Text('');
    setModel2Text('');
    setModel1Done(false);
    setModel2Done(false);
    setJudgeData(null);
    setCurrentResponse(null);
    setError(null);
    setStatus('loading');

    try {
      const res = await askAi(query);
      const { solution_1, solution_2, judge } = res.result;

      const model1 = { name: 'Gemini', provider: 'Google' };
      const model2 = { name: 'Mistral', provider: 'Mistral' };
      setCurrentResponse({ model1, model2 });

      const winner = judge.solution_1_score >= judge.solution_2_score ? 1 : 2;
      const mappedJudge = {
        winner,
        model1Score: judge.solution_1_score,
        model2Score: judge.solution_2_score,
        model1Reasoning: judge.solution_1_reasoning,
        model2Reasoning: judge.solution_2_reasoning,
      };

      setStatus('typing');

      let done1 = false;
      let done2 = false;

      const checkBoth = () => {
        if (done1 && done2) {
          const judgeId = setTimeout(() => {
            setJudgeData(mappedJudge);
            setStatus('complete');
          }, 500);
          handles.current.push(judgeId);
        }
      };

      typeText(solution_1, setModel1Text, () => {
        done1 = true;
        setModel1Done(true);
        checkBoth();
      });

      typeText(solution_2, setModel2Text, () => {
        done2 = true;
        setModel2Done(true);
        checkBoth();
      });
    } catch (err) {
      setError(err.message ?? 'Something went wrong');
      setStatus('idle');
    }
  }, []);

  const reset = useCallback(() => {
    clearAll();
    setStatus('idle');
    setModel1Text('');
    setModel2Text('');
    setModel1Done(false);
    setModel2Done(false);
    setJudgeData(null);
    setCurrentResponse(null);
    setError(null);
  }, []);

  return {
    status,
    model1Text,
    model2Text,
    model1Done,
    model2Done,
    judgeData,
    currentResponse,
    error,
    triggerBattle,
    reset,
  };
}
