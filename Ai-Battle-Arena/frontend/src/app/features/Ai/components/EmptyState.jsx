import { motion } from 'framer-motion';
import { Swords } from 'lucide-react';
import { SAMPLE_QUERIES } from '../data/mockData';

export function EmptyState({ onQuery }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 min-h-full px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md text-center"
      >
        {/* Icon */}
        <div className="w-14 h-14 bg-zinc-800/80 border border-zinc-700/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Swords size={22} className="text-zinc-300" />
        </div>

        {/* Title */}
        <h1 className="text-[22px] font-semibold text-zinc-100 tracking-tight mb-2">
          AI Battle Arena
        </h1>
        <p className="text-[14px] text-zinc-500 leading-relaxed mb-10 max-w-sm mx-auto">
          Ask any question and watch two AI models compete.
          A judge evaluates both responses and picks the winner.
        </p>

        {/* Sample queries */}
        <div className="space-y-2 text-left">
          <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider text-center mb-3">
            Try one of these
          </p>
          {SAMPLE_QUERIES.map((q, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.08 + i * 0.07 }}
              onClick={() => onQuery(q)}
              className="w-full text-left px-4 py-3.5 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-zinc-700/60 rounded-xl text-[13px] text-zinc-400 hover:text-zinc-300 transition-all duration-150"
            >
              {q}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
