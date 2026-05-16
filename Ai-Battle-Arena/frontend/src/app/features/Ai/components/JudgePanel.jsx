import { motion } from 'framer-motion';
import { Scale, Trophy } from 'lucide-react';

function ScoreBar({ label, score, isWinner }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-[12px] font-medium ${isWinner ? 'text-zinc-200' : 'text-zinc-400'}`}>
            {label}
          </span>
          {isWinner && (
            <span className="text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-full font-medium">
              Winner
            </span>
          )}
        </div>
        <span className={`text-[12px] font-semibold tabular-nums ${isWinner ? 'text-zinc-100' : 'text-zinc-500'}`}>
          {score.toFixed(1)}
          <span className="text-zinc-700 font-normal text-[11px]">/10</span>
        </span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(score / 10) * 100}%` }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full ${isWinner ? 'bg-zinc-200' : 'bg-zinc-600'}`}
        />
      </div>
    </div>
  );
}

function ModelReasoning({ name, reasoning, isWinner }) {
  return (
    <div className="space-y-2">
      <p className={`text-[11px] font-semibold uppercase tracking-wider ${isWinner ? 'text-zinc-400' : 'text-zinc-600'}`}>
        {name}
      </p>
      <p className="text-[12.5px] text-zinc-500 leading-relaxed">{reasoning}</p>
    </div>
  );
}

export function JudgePanel({ data, model1Name, model2Name }) {
  if (!data) return null;

  const winnerName = data.winner === 1 ? model1Name : model2Name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-zinc-900 border border-zinc-800/80 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0">
            <Scale size={14} className="text-zinc-300" />
          </div>
          <h3 className="text-[13px] font-semibold text-zinc-100">Judge Analysis</h3>
        </div>
        <div className="flex items-center gap-2 bg-amber-400/8 border border-amber-400/20 rounded-xl px-3 py-2">
          <Trophy size={12} className="text-amber-400 flex-shrink-0" />
          <span className="text-[12px] font-semibold text-zinc-100">{winnerName}</span>
          <span className="text-[11px] text-zinc-500">wins</span>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Score bars */}
        <div className="space-y-3.5">
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Score</p>
          <ScoreBar
            label={model1Name}
            score={data.model1Score}
            isWinner={data.winner === 1}
          />
          <ScoreBar
            label={model2Name}
            score={data.model2Score}
            isWinner={data.winner === 2}
          />
        </div>

        {/* Per-model reasoning */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1 border-t border-zinc-800/60">
          <ModelReasoning
            name={model1Name}
            reasoning={data.model1Reasoning}
            isWinner={data.winner === 1}
          />
          <ModelReasoning
            name={model2Name}
            reasoning={data.model2Reasoning}
            isWinner={data.winner === 2}
          />
        </div>
      </div>
    </motion.div>
  );
}
