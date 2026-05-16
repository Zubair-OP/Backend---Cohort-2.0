import { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ChatInput({ onSubmit, disabled }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const onKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="bg-zinc-950 border-t border-zinc-800/70 px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <div
          className={`flex items-end gap-3 bg-zinc-900 border rounded-2xl px-4 py-3 transition-colors duration-150 ${
            canSend ? 'border-zinc-700' : 'border-zinc-800'
          }`}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={disabled}
            placeholder="Ask a question to compare AI responses..."
            rows={1}
            className="flex-1 bg-transparent text-[14px] text-zinc-100 placeholder-zinc-600 resize-none focus:outline-none leading-relaxed min-h-[24px] disabled:opacity-40"
            style={{ scrollbarWidth: 'none' }}
          />
          <button
            onClick={submit}
            disabled={!canSend}
            className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 ${
              canSend
                ? 'bg-zinc-100 hover:bg-white text-zinc-900 cursor-pointer'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <ArrowUp size={14} strokeWidth={2.5} />
          </button>
        </div>
        <p className="text-center text-[11px] text-zinc-700 mt-2">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
