import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, RotateCcw, Check, Timer } from 'lucide-react';

const MODEL_STYLES = {
  OpenAI: {
    dot: 'bg-emerald-400',
    badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  },
  Anthropic: {
    dot: 'bg-orange-400',
    badge: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  },
  Google: {
    dot: 'bg-blue-400',
    badge: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  },
  Mistral: {
    dot: 'bg-violet-400',
    badge: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  },
};

function SkeletonBlock() {
  return (
    <div className="p-5 space-y-3">
      {[100, 83, 91, null, 100, 76, 88, null, 85, 68].map((w, i) =>
        w === null ? (
          <div key={i} className="h-2" />
        ) : (
          <div
            key={i}
            className="h-3 bg-zinc-800 rounded-full animate-pulse"
            style={{ width: `${w}%` }}
          />
        )
      )}
    </div>
  );
}

export function ResponseCard({ model, text, isLoading, isTyping }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const styles = MODEL_STYLES[model?.provider] ?? {
    dot: 'bg-zinc-500',
    badge: 'text-zinc-400 bg-zinc-800 border-zinc-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col bg-zinc-900 border border-zinc-800/80 rounded-2xl overflow-hidden"
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800/60">
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${styles.dot}`} />
          <span className="text-[13px] font-semibold text-zinc-100">
            {model?.name ?? '—'}
          </span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full border ${styles.badge}`}>
            {model?.provider}
          </span>
        </div>
        {model?.latency && !isLoading && (
          <div className="flex items-center gap-1.5 text-zinc-600">
            <Timer size={11} />
            <span className="text-[11px] tabular-nums">{model.latency}</span>
          </div>
        )}
      </div>

      {/* Response body */}
      <div className="flex-1 min-h-[180px]">
        {isLoading ? (
          <SkeletonBlock />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="p-5 text-[13.5px] text-zinc-300 leading-[1.75] whitespace-pre-wrap"
          >
            {text}
            {isTyping && (
              <span className="inline-block w-[2px] h-[14px] bg-zinc-400 ml-0.5 align-middle animate-pulse" />
            )}
          </motion.div>
        )}
      </div>

      {/* Card footer */}
      {!isLoading && text && (
        <div className="flex items-center gap-1 px-4 py-2.5 border-t border-zinc-800/40">
          <button
            onClick={copy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all">
            <RotateCcw size={12} />
            <span>Retry</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}
