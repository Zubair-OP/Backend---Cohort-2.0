import { useState, useRef, useCallback, useEffect } from 'react';
import { socket } from '../services/chat.socket';

export function useBattle() {
  const [status, setStatus] = useState('idle');
  const [model1Text, setModel1Text] = useState('');
  const [model2Text, setModel2Text] = useState('');
  const [model1Done, setModel1Done] = useState(false);
  const [model2Done, setModel2Done] = useState(false);
  const [judgeData, setJudgeData] = useState(null);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [error, setError] = useState(null);

  // Track whether both models have finished streaming before showing judge
  const model1DoneRef = useRef(false);
  const model2DoneRef = useRef(false);
  const pendingJudge = useRef(null);

  const checkBothDone = useCallback(() => {
    if (model1DoneRef.current && model2DoneRef.current && pendingJudge.current) {
      setJudgeData(pendingJudge.current);
      setStatus('complete');
    }
  }, []);

  useEffect(() => {
    socket.on('ai_start', () => {
      setStatus('typing');
      setCurrentResponse({
        model1: { name: 'Gemini', provider: 'Google' },
        model2: { name: 'Mistral', provider: 'Mistral' },
      });
    });

    socket.on('gemini_token', ({ token }) => {
      setModel1Text(prev => prev + token);
    });

    socket.on('mistral_token', ({ token }) => {
      setModel2Text(prev => prev + token);
    });

    socket.on('judge_start', () => {
      // Both models are done streaming by the time judge starts
      model1DoneRef.current = true;
      model2DoneRef.current = true;
      setModel1Done(true);
      setModel2Done(true);
      setStatus('judging');
    });

    socket.on('judge_complete', ({ result }) => {
      const winner = result.solution_1_score >= result.solution_2_score ? 1 : 2;
      pendingJudge.current = {
        winner,
        model1Score: result.solution_1_score,
        model2Score: result.solution_2_score,
        model1Reasoning: result.solution_1_reasoning,
        model2Reasoning: result.solution_2_reasoning,
      };
    });

    socket.on('ai_complete', () => {
      if (pendingJudge.current) {
        setJudgeData(pendingJudge.current);
      }
      setStatus('complete');
    });

    socket.on('error_message', ({ message }) => {
      setError(message ?? 'Something went wrong');
      setStatus('idle');
    });

    return () => {
      socket.off('ai_start');
      socket.off('gemini_token');
      socket.off('mistral_token');
      socket.off('judge_start');
      socket.off('judge_complete');
      socket.off('ai_complete');
      socket.off('error_message');
    };
  }, [checkBothDone]);

  const triggerBattle = useCallback((query) => {
    setModel1Text('');
    setModel2Text('');
    setModel1Done(false);
    setModel2Done(false);
    setJudgeData(null);
    setCurrentResponse(null);
    setError(null);
    setStatus('loading');
    model1DoneRef.current = false;
    model2DoneRef.current = false;
    pendingJudge.current = null;

    socket.emit('ask_ai', query);
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setModel1Text('');
    setModel2Text('');
    setModel1Done(false);
    setModel2Done(false);
    setJudgeData(null);
    setCurrentResponse(null);
    setError(null);
    model1DoneRef.current = false;
    model2DoneRef.current = false;
    pendingJudge.current = null;
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
