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
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-16 min-h-0">
      <div className="w-full max-w-chat flex flex-col items-center gap-12">
        {/* Brand + greeting */}
        <div className="flex flex-col items-center gap-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
          {/* Logo mark */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 border border-accent/15 flex items-center justify-center">
              <span className="text-2xl font-bold text-accent tracking-tight">P</span>
            </div>
            <div className="absolute -inset-4 rounded-3xl bg-accent/5 blur-2xl pointer-events-none" />
          </div>

          {/* Title */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-fg-primary">
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
              className="group flex items-center gap-2.5 rounded-full border border-border bg-surface-2 px-4 py-2.5 text-sm text-fg-secondary hover:text-fg-primary hover:bg-surface-3 hover:border-border-hover transition-all duration-250 ease-out-expo focus-ring"
              style={{ animationDelay: `${300 + i * 50}ms` }}
            >
              <span className="text-[10px] font-mono font-medium text-accent/60 group-hover:text-accent transition-colors duration-200">
                {prompt.icon}
              </span>
              {prompt.text}
            </button>
          ))}
        </div>

        {/* Hint */}
        <p className="text-[11px] text-fg-muted animate-fade-in" style={{ animationDelay: "500ms" }}>
          Press <kbd className="px-1.5 py-0.5 rounded bg-surface-4 border border-border text-fg-secondary text-[10px] font-mono">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 rounded bg-surface-4 border border-border text-fg-secondary text-[10px] font-mono">Shift+Enter</kbd> for newline
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
