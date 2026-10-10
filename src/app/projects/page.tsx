'use client';

import { useEffect, useState } from 'react';
import { Search, FolderKanban } from 'lucide-react';
import Sidebar from '@/components/sidebar';

type ProjectStatus = 'In Progress' | 'In Review' | 'Completed';

type Project = {
  id: string;
  name: string;
  client: string;
  progress: number;
  status: ProjectStatus;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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

          // Load saved projects when this page first opens.
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

  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.trim().toLowerCase();

    return (
      project.name.toLowerCase().includes(query) || project.client.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="min-w-0 flex-1 px-5 py-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-slate-500">Workspace / Projects</p>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Projects</h1>
              <p className="mt-2 text-sm text-slate-500">View and track all your projects.</p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700">
              <FolderKanban size={18} />
              {projects.length} Projects
            </div>
          </div>

          <label className="mt-8 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <Search size={18} className="text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search projects or clients..."
              aria-label="Search projects or clients"
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </label>

          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-5">
              <h2 className="font-semibold text-slate-900">All Projects</h2>
              <p className="mt-1 text-sm text-slate-500">Your saved ClientFlow projects.</p>
            </div>

            {!loaded ? (
              <p className="p-8 text-sm text-slate-500">Loading projects...</p>
            ) : filteredProjects.length === 0 ? (
              <p className="p-8 text-sm text-slate-500">
                {projects.length === 0
                  ? 'No saved projects found. Create a project from the dashboard.'
                  : 'No projects match your search.'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-155 text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-medium">Project</th>
                      <th className="px-5 py-4 font-medium">Progress</th>
                      <th className="px-5 py-4 font-medium">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="border-t border-slate-100">
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-800">{project.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{project.client}</p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-violet-600"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500">{project.progress}%</span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                              project.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : project.status === 'In Review'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-violet-50 text-violet-700'
                            }`}
                          >
                            {project.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
