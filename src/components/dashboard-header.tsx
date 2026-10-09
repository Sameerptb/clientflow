import { Bell, Plus, Search } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <header className="mb-8">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Workspace / Overview</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Good morning!</h1>
          <p className="mt-2 text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            aria-label="Notifications"
            className="relative rounded-xl border border-slate-200 bg-white p-3 text-slate-600 hover:bg-slate-50"
          >
            <Bell size={19} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-600" />
          </button>

          <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700">
            <Plus size={18} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:border-violet-400">
        <Search size={18} className="shrink-0 text-slate-400" />
        <input
          type="search"
          placeholder="Search projects, tasks, clients..."
          aria-label="Search ClientFlow"
          className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
        <kbd className="hidden rounded border border-slate-200 px-2 py-1 text-xs text-slate-400 sm:block">
          ⌘ K
        </kbd>
      </label>
    </header>
  );
}
