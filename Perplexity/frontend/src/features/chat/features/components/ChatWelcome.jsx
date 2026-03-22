const ChatWelcome = ({ user }) => {
  const firstName = user?.username?.split(" ")[0] ?? "there";

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-12 gap-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
          Good {getGreeting()},{" "}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent capitalize">
            {firstName}
          </span>
        </h1>
        <p className="text-[#8e8ea0] text-base md:text-lg">
          Ready when you are.
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
