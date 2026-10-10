'use client';

import {
  CheckSquare,
  ChevronDown,
  CircleHelp,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Overview', href: '/', icon: LayoutDashboard },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'My Tasks', href: '/my-tasks', icon: CheckSquare },
  { label: 'Clients', href: '/clients', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-5 py-6">
      <Link href="/" className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
          <Sparkles size={21} />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">ClientFlow</span>
      </Link>

      <button className="mb-8 flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-sm font-bold text-violet-700">
          CF
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800">Creative Studio</p>
          <p className="text-xs text-slate-500">Free workspace</p>
        </div>
        <ChevronDown size={16} className="text-slate-400" />
      </button>

      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Workspace
      </p>

      <nav className="space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                active ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={19} />
              {label}
            </Link>
          );
        })}
      </nav>

      <p className="mb-3 mt-9 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Preferences
      </p>

      <nav className="space-y-1">
        <Link
          href="/settings"
          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
            pathname === '/settings'
              ? 'bg-violet-50 text-violet-700'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Settings size={19} />
          Settings
        </Link>
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50">
          <CircleHelp size={19} />
          Help & Support
        </button>
      </nav>

      <div className="mt-auto rounded-2xl bg-slate-50 p-4">
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
          <Sparkles size={18} />
        </div>
        <p className="text-sm font-semibold text-slate-800">Keep work flowing</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Bring projects, tasks, and your team together in one place.
        </p>
      </div>

      <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 font-semibold text-amber-800">
          S
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800">Sample User</p>
          <p className="truncate text-xs text-slate-500">Demo account</p>
        </div>
      </div>
    </aside>
  );
}
