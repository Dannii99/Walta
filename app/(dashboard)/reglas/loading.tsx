export default function ReglasLoading() {
  return (
    <div className="p-4 md:px-6 lg:px-10 pb-18 md:pb-6 pt-6 md:pt-8 max-w-360 mx-auto">
      <div className="space-y-6 md:space-y-8 max-w-3xl">
        <div className="space-y-2">
          <div className="h-3 w-16 rounded-md bg-[#e8e8e8] dark:bg-[#2a2a2e] animate-pulse" />
          <div className="h-9 w-72 max-w-full rounded-md bg-[#e8e8e8] dark:bg-[#2a2a2e] animate-pulse" />
          <div className="h-4 w-96 max-w-full rounded-md bg-[#e8e8e8] dark:bg-[#2a2a2e] animate-pulse" />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#f5f5f5]/80 dark:bg-white/5 w-full max-w-md">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-9 flex-1 rounded-lg bg-[#e8e8e8] dark:bg-[#2a2a2e] animate-pulse"
            />
          ))}
        </div>

        <div className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-5">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#e8e8e8] dark:bg-[#2a2a2e] animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-40 rounded-md bg-[#e8e8e8] dark:bg-[#2a2a2e] animate-pulse" />
              <div className="h-3 w-72 max-w-full rounded-md bg-[#e8e8e8] dark:bg-[#2a2a2e] animate-pulse" />
            </div>
          </div>
          <div className="rounded-xl border border-[#e8e8e8] dark:border-[#2a2a2e] bg-[#fafafa] dark:bg-[#1a1a1e] p-4 md:p-5 space-y-2">
            <div className="h-3 w-24 rounded-md bg-[#e8e8e8] dark:bg-[#2a2a2e] animate-pulse" />
            <div className="h-10 w-56 rounded-md bg-[#e8e8e8] dark:bg-[#2a2a2e] animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 rounded-md bg-[#e8e8e8] dark:bg-[#2a2a2e] animate-pulse" />
            <div className="h-10 w-full rounded-md bg-[#e8e8e8] dark:bg-[#2a2a2e] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
