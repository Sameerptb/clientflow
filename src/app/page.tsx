'use client';

import {
  Activity,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListTodo,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react';

import Link from 'next/link';

import { useEffect, useState } from 'react';

type ProjectStatus = 'In Progress' | 'In Review' | 'Completed';

type Project = {
  id: string;
  name: string;
  client: string;
  progress: number;
  status: ProjectStatus;
};

const stats = [
  {
    title: 'Total Projects',

    value: '12',

    description: 'Across all clients',

    icon: FolderKanban,
  },

  {
    title: 'Active Tasks',

    value: '28',

    description: 'Tasks in progress',

    icon: ListTodo,
  },

  {
    title: 'Completed Tasks',

    value: '46',

    description: 'Tasks completed',

    icon: CheckCircle2,
  },

  {
    title: 'Team Members',

    value: '08',

    description: 'In your workspace',

    icon: Users,
  },
];

const projects = [
  {
    id: 'project-1',
    name: 'Website Redesign',

    client: 'Acme Studio',

    progress: 75,

    status: 'In Progress',
  },

  {
    id: 'project-2',
    name: 'Mobile Application',

    client: 'Nova Digital',

    progress: 45,

    status: 'In Progress',
  },

  {
    id: 'project-3',
    name: 'Marketing Website',

    client: 'Bright Agency',

    progress: 100,

    status: 'Completed',
  },

  {
    id: 'project-4',
    name: 'Customer Portal',

    client: 'Orbit Systems',

    progress: 60,

    status: 'In Review',
  },
];

const upcomingTasks = [
  {
    title: 'Finalize homepage design',

    project: 'Website Redesign',

    date: 'Today',
  },

  {
    title: 'Review mobile wireframes',

    project: 'Mobile Application',

    date: 'Tomorrow',
  },

  {
    title: 'Prepare launch checklist',

    project: 'Marketing Website',

    date: 'Oct 14',
  },
];

export default function DashboardPage() {
  const [projectList, setProjectList] = useState(projects);

  const [isLoaded, setIsLoaded] = useState(false);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [projectName, setProjectName] = useState('');

  const [clientName, setClientName] = useState('');

  const [projectStatus, setProjectStatus] = useState('In Progress');

  const [searchQuery, setSearchQuery] = useState('');

  const [editingProject, setEditingProject] = useState<string | null>(null);

  function handleCreateProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = projectName.trim();
    const trimmedClient = clientName.trim();

    if (!trimmedName || !trimmedClient) return;

    if (editingProject !== null) {
      setProjectList((currentProjects) =>
        currentProjects.map((project) =>
          project.id === editingProject
            ? {
                ...project,
                name: trimmedName,
                client: trimmedClient,
                status: projectStatus as ProjectStatus,
              }
            : project,
        ),
      );

      setEditingProject(null);
    } else {
      const newProject: Project = {
        id: crypto.randomUUID(),
        name: trimmedName,
        client: trimmedClient,
        progress: 0,
        status: projectStatus as ProjectStatus,
      };

      setProjectList((currentProjects) => [newProject, ...currentProjects]);
    }

    setProjectName('');
    setClientName('');
    setProjectStatus('In Progress');
    setIsProjectModalOpen(false);
  }

  function handleDeleteProject(projectId: string) {
    const project = projectList.find((item) => item.id === projectId);

    if (!project) return;

    const confirmed = window.confirm(`Are you sure you want to delete "${project.name}"?`);

    if (!confirmed) return;

    setProjectList((currentProjects) => currentProjects.filter((item) => item.id !== projectId));
  }

  function handleEditProject(projectId: string) {
    const project = projectList.find((item) => item.id === projectId);

    if (!project) return;

    setProjectName(project.name);
    setClientName(project.client);
    setProjectStatus(project.status);
    setEditingProject(project.id);
    setIsProjectModalOpen(true);
  }

  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem('clientflow-projects');

      if (savedProjects) {
        const parsedProjects: unknown = JSON.parse(savedProjects);

        if (Array.isArray(parsedProjects)) {
          const validProjects: Project[] = parsedProjects
            .filter(
              (project): project is Record<string, unknown> =>
                project !== null &&
                typeof project === 'object' &&
                typeof project.name === 'string' &&
                typeof project.client === 'string' &&
                typeof project.progress === 'number' &&
                project.progress >= 0 &&
                project.progress <= 100 &&
                typeof project.status === 'string' &&
                ['In Progress', 'In Review', 'Completed'].includes(project.status),
            )
            .map((project) => ({
              id:
                typeof project.id === 'string' && project.id.length > 0
                  ? project.id
                  : crypto.randomUUID(),
              name: project.name as string,
              client: project.client as string,
              progress: project.progress as number,
              status: project.status as ProjectStatus,
            }));

          setProjectList(validProjects);
        }
      }
    } catch {
      console.error('Could not load saved ClientFlow projects.');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem('clientflow-projects', JSON.stringify(projectList));
    } catch {
      console.error('Could not save ClientFlow projects.');
    }
  }, [projectList, isLoaded]);

  const filteredProjects = projectList.filter((project) => {
    const query = searchQuery.trim().toLowerCase();

    return (
      project.name.toLowerCase().includes(query) || project.client.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* Sidebar */}

      <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-6 md:flex">
        <Link href="/" className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
            <Activity size={22} />
          </div>

          <span className="text-xl font-bold text-slate-900">ClientFlow</span>
        </Link>

        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        <nav className="space-y-2">
          {[
            { label: 'Overview', icon: Activity },

            { label: 'Projects', icon: FolderKanban },

            { label: 'My Tasks', icon: ListTodo },

            { label: 'Clients', icon: Users },
          ].map(({ label, icon: Icon }, index) => (
            <a
              key={label}
              href={index === 0 ? '/' : `/${label.toLowerCase().replace(' ', '-')}`}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
                index === 0 ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={19} />

              {label}
            </a>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl bg-violet-50 p-4">
          <p className="font-semibold text-slate-800">Keep work flowing</p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Manage projects, tasks, and your team in one place.
          </p>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-5">
          <p className="text-sm font-semibold text-slate-800">Sample User</p>

          <p className="mt-1 text-xs text-slate-500">Demo account</p>
        </div>
      </aside>

      {/* Main dashboard */}

      <main className="min-w-0 flex-1 p-5 md:p-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Workspace / Overview</p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Good morning!</h1>

            <p className="mt-2 text-sm text-slate-500">
              Here is what is happening with your projects.
            </p>
          </div>

          <button
            type="button"
            disabled={!isLoaded}
            onClick={() => setIsProjectModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} />
            New Project
          </button>
        </header>

        {/* Search */}

        <label className="mb-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <Search size={18} className="text-slate-400" />

          <input
            type="search"
            placeholder="Search projects, tasks, clients..."
            aria-label="Search projects, tasks, and clients"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>

        {/* Statistics */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ title, value, description, icon: Icon }) => {
            const displayValue = title === 'Total Projects' ? projectList.length : value;

            return (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">{title}</p>

                  <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
                    <Icon size={20} />
                  </div>
                </div>

                <p className="mt-5 text-3xl font-bold text-slate-900">{displayValue}</p>

                <p className="mt-2 text-xs text-slate-500">{description}</p>
              </article>
            );
          })}
        </section>

        {/* Projects and upcoming tasks */}

        <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white xl:col-span-2">
            <div className="border-b border-slate-100 p-5">
              <h2 className="font-semibold text-slate-900">Recent Projects</h2>

              <p className="mt-1 text-sm text-slate-500">Track your team&apos;s progress</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-155 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">Project</th>

                    <th className="px-5 py-4 font-medium">Progress</th>

                    <th className="px-5 py-4 font-medium">Status</th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
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

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditProject(project.id)}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-violet-50 hover:text-violet-700"
                            aria-label={`Edit ${project.name}`}
                            title="Edit project"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProject(project.id)}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                            aria-label={`Delete ${project.name}`}
                            title="Delete project"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">Upcoming Tasks</h2>

                <p className="mt-1 text-sm text-slate-500">What needs attention</p>
              </div>

              <Clock3 size={19} className="text-violet-600" />
            </div>

            <div className="mt-6 space-y-5">
              {upcomingTasks.map((task) => (
                <div key={task.title} className="flex gap-3">
                  <div className="mt-1 h-9 w-1 shrink-0 rounded-full bg-violet-500" />

                  <div>
                    <p className="text-sm font-medium text-slate-800">{task.title}</p>

                    <p className="mt-1 text-xs text-slate-500">{task.project}</p>

                    <p className="mt-2 text-xs font-medium text-violet-700">{task.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-violet-50 p-3 text-xs leading-5 text-violet-800">
              Your team is making progress. Keep the next priorities in view.
            </div>
          </aside>
        </section>

        <footer className="py-8 text-center text-xs text-slate-400">
          ClientFlow · Demo data only
        </footer>

        {isProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="new-project-title"
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 id="new-project-title" className="text-xl font-bold text-slate-900">
                  {editingProject !== null ? 'Edit Project' : 'Create New Project'}
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    setIsProjectModalOpen(false);
                    setEditingProject(null);
                    setProjectName('');
                    setClientName('');
                    setProjectStatus('In Progress');
                  }}
                  aria-label="Close project form"
                  className="rounded-lg px-3 py-1 text-slate-500 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label
                    htmlFor="projectName"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Project name
                  </label>

                  <input
                    id="projectName"
                    required
                    maxLength={100}
                    value={projectName}
                    onChange={(event) => setProjectName(event.target.value)}
                    placeholder="e.g. Website Redesign"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="clientName"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Client name
                  </label>

                  <input
                    id="clientName"
                    required
                    maxLength={100}
                    value={clientName}
                    onChange={(event) => setClientName(event.target.value)}
                    placeholder="e.g. Acme Studio"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="projectStatus"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Status
                  </label>

                  <select
                    id="projectStatus"
                    value={projectStatus}
                    onChange={(event) => setProjectStatus(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500"
                  >
                    <option value="In Progress">In Progress</option>

                    <option value="In Review">In Review</option>

                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProjectModalOpen(false);
                      setEditingProject(null);
                      setProjectName('');
                      setClientName('');
                      setProjectStatus('In Progress');
                    }}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700"
                  >
                    {editingProject !== null ? 'Save Changes' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
