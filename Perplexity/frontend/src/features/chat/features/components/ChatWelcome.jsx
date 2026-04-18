const suggestionPrompts = [
  "Summarize the latest AI trends",
  "Plan a focused study schedule",
  "Compare two backend frameworks",
  "Find sources for my research topic",
];

const ChatWelcome = ({ user, onSend, isLoading }) => {
  const firstName = user?.username?.split(" ")[0] ?? "there";

  const submit = (text) => {
    const nextMessage = text.trim();
    if (!nextMessage || isLoading) return;
    onSend?.(nextMessage);
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-12">
      <div className="w-full max-w-[760px] flex flex-col items-center gap-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-[#2a2a2a] bg-[#161616] text-2xl font-semibold">
            P
          </div>
          <div>
            <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white">
              perplexity
            </h1>
            <p className="mt-3 text-sm md:text-base text-[#888888]">
              Good {getGreeting()}, {firstName}. Ask anything and explore with calm focus.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center justify-center gap-3">
          {suggestionPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => submit(prompt)}
              className="rounded-full border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#d6d6d6] hover:bg-[#1f1f1f]"
            >
              {prompt}
            </button>
          ))}
        </div>
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
