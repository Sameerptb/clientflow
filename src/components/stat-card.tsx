import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: string;
};

export default function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">{value}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {trend && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
            <ArrowUpRight size={14} />
            {trend}
          </span>
        )}
        <span className="text-xs text-slate-500">{description}</span>
      </div>
    </article>
  );
}
