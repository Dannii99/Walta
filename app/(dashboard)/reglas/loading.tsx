export default function ReglasLoading() {
  return (
    <div className="p-4 md:px-6 lg:px-10 pb-24 md:pb-6 pt-6 md:pt-8 max-w-360 mx-auto">
      <div className="space-y-6 md:space-y-8 max-w-3xl">
        <div className="space-y-2">
          <div className="h-3 w-16 rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse" />
          <div className="h-9 w-72 max-w-full rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse" />
          <div className="h-4 w-96 max-w-full rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse" />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100/80 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800 w-full max-w-md">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-9 flex-1 rounded-lg bg-stone-200 dark:bg-stone-800 animate-pulse"
            />
          ))}
        </div>

        <div className="bg-white dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-5">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-stone-200 dark:bg-stone-800 animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-40 rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse" />
              <div className="h-3 w-72 max-w-full rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse" />
            </div>
          </div>
          <div className="rounded-xl border border-stone-200/60 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 p-4 md:p-5 space-y-2">
            <div className="h-3 w-24 rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse" />
            <div className="h-10 w-56 rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse" />
            <div className="h-10 w-full rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
