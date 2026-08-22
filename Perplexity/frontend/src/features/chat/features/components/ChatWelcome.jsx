const suggestionPrompts = [
  { text: "Summarize the latest AI trends", icon: "01" },
  { text: "Plan a focused study schedule", icon: "02" },
  { text: "Compare two backend frameworks", icon: "03" },
  { text: "Find sources for my research topic", icon: "04" },
];

const ChatWelcome = ({ user, onSend, isLoading }) => {
  const firstName = user?.username?.split(" ")[0] ?? "there";

  const submit = (text) => {
    const nextMessage = text.trim();
    if (!nextMessage || isLoading) return;
    onSend?.(nextMessage);
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 pt-24 pb-16 min-h-0 relative">
      {/* Ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/[0.03] blur-[120px] pointer-events-none" />

      <div className="w-full max-w-chat flex flex-col items-center gap-10 relative z-10">
        {/* Brand + greeting */}
        <div className="flex flex-col items-center gap-5 animate-fade-up" style={{ animationDelay: "100ms" }}>
          {/* Logo mark — double-bezel */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-[1.2rem] bg-gradient-to-br from-accent/20 to-transparent opacity-60 blur-sm group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative w-12 h-12 rounded-[0.9rem] bg-gradient-to-br from-accent/15 to-accent/[0.03] border border-accent/15 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
              <span className="text-xl font-bold text-accent tracking-tight font-display">P</span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-[-0.04em] text-fg-primary font-display leading-[1.15] text-balance">
              What do you want to know?
            </h1>
            <p className="text-base text-fg-secondary max-w-md mx-auto leading-relaxed">
              Good {getGreeting()}, {firstName}. Ask anything and explore with focused research.
            </p>
          </div>
        </div>

        {/* Suggestion pills */}
        <div className="flex w-full max-w-lg flex-wrap items-center justify-center gap-2.5 animate-fade-up" style={{ animationDelay: "250ms" }}>
          {suggestionPrompts.map((prompt, i) => (
            <button
              key={prompt.text}
              onClick={() => submit(prompt.text)}
              className="group flex items-center gap-2.5 rounded-full border border-border bg-surface-2/80 px-4 py-2.5 text-sm text-fg-secondary hover:text-fg-primary hover:bg-surface-3/80 hover:border-border-hover hover:shadow-[0_0_20px_rgba(20,184,166,0.04)] transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] focus-ring active:scale-[0.97]"
              style={{ animationDelay: `${300 + i * 60}ms` }}
            >
              <span className="text-[10px] font-mono font-medium text-accent/50 group-hover:text-accent transition-colors duration-300">
                {prompt.icon}
              </span>
              {prompt.text}
            </button>
          ))}
        </div>

        {/* Hint */}
        <p className="text-[11px] text-fg-muted animate-fade-in" style={{ animationDelay: "550ms" }}>
          Press <kbd className="px-1.5 py-0.5 rounded-md bg-surface-4/80 border border-border/80 text-fg-secondary text-[10px] font-mono">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 rounded-md bg-surface-4/80 border border-border/80 text-fg-secondary text-[10px] font-mono">Shift+Enter</kbd> for newline
        </p>
      </div>
    </div>
  );
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export default ChatWelcome;
