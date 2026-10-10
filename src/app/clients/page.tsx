'use client';

import { useEffect, useState } from 'react';
import { Building2, Search, FolderKanban, Users } from 'lucide-react';
import Sidebar from '@/components/sidebar';

type ProjectStatus = 'In Progress' | 'In Review' | 'Completed';

type Project = {
  id: string;
  name: string;
  client: string;
  progress: number;
  status: ProjectStatus;
};

export default function ClientsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('clientflow-projects');

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          const validProjects: Project[] = parsed.filter(
            (item): item is Project =>
              item !== null &&
              typeof item === 'object' &&
              typeof item.id === 'string' &&
              typeof item.name === 'string' &&
              typeof item.client === 'string' &&
              typeof item.progress === 'number' &&
              (item.status === 'In Progress' ||
                item.status === 'In Review' ||
                item.status === 'Completed'),
          );

          // Load saved projects when the page first opens.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setProjects(validProjects);
        }
      }
    } catch {
      console.error('Could not load ClientFlow projects.');
    } finally {
      setLoaded(true);
    }
  }, []);

  const clients = Array.from(
    projects.reduce((map, project) => {
      const name = project.client.trim();

      if (!name) return map;

      const key = name.toLowerCase();
      const existing = map.get(key);

      map.set(key, {
        name: existing?.name ?? name,
        projects: (existing?.projects ?? 0) + 1,
        completed: (existing?.completed ?? 0) + (project.status === 'Completed' ? 1 : 0),
      });

      return map;
    }, new Map<string, { name: string; projects: number; completed: number }>()),
  ).map(([key, client]) => ({ key, ...client }));

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="min-w-0 flex-1 px-5 py-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-slate-500">Workspace / Clients</p>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clients</h1>
              <p className="mt-2 text-sm text-slate-500">
                View clients and the projects associated with them.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700">
              <Users size={18} />
              {clients.length} Clients
            </div>
          </div>

          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Total Clients</p>
                <Building2 size={20} className="text-violet-600" />
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{clients.length}</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Total Projects</p>
                <FolderKanban size={20} className="text-violet-600" />
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{projects.length}</p>
            </article>
          </section>

          <label className="mt-8 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <Search size={18} className="text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search clients..."
              aria-label="Search clients"
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </label>

          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-5">
              <h2 className="font-semibold text-slate-900">All Clients</h2>
              <p className="mt-1 text-sm text-slate-500">
                Client information is derived from your saved projects.
              </p>
            </div>

            {!loaded ? (
              <p className="p-8 text-sm text-slate-500">Loading clients...</p>
            ) : filteredClients.length === 0 ? (
              <p className="p-8 text-sm text-slate-500">
                {clients.length === 0
                  ? 'No clients found. Add a client when creating a project.'
                  : 'No clients match your search.'}
              </p>
            ) : (
              <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredClients.map((client) => (
                  <article
                    key={client.key}
                    className="rounded-xl border border-slate-200 p-5 transition hover:border-violet-200 hover:shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                        <Building2 size={21} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="break-words font-semibold text-slate-900">{client.name}</h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {client.projects} {client.projects === 1 ? 'project' : 'projects'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs text-slate-500">Completed projects</span>
                      <span className="text-sm font-semibold text-emerald-600">
                        {client.completed}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
