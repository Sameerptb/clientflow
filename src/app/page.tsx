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
  X,
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

type Task = {
  id: string;
  title: string;
  project: string;
  date: string;
  completed: boolean;
};

const initialProjects: Project[] = [
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

const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Finalize homepage design',
    project: 'Website Redesign',
    date: 'Today',
    completed: false,
  },
  {
    id: 'task-2',
    title: 'Review mobile wireframes',
    project: 'Mobile Application',
    date: 'Tomorrow',
    completed: false,
  },
  {
    id: 'task-3',
    title: 'Prepare launch checklist',
    project: 'Marketing Website',
    date: 'Oct 14',
    completed: false,
  },
];

const stats = [
  {
    title: 'Total Projects',
    description: 'Across all clients',
    icon: FolderKanban,
  },
  {
    title: 'Active Tasks',
    description: 'Tasks in progress',
    icon: ListTodo,
  },
  {
    title: 'Completed Tasks',
    description: 'Tasks completed',
    icon: CheckCircle2,
  },
  {
    title: 'Team Members',
    description: 'In your workspace',
    icon: Users,
  },
];

export default function DashboardPage() {
  const [projectList, setProjectList] = useState<Project[]>(initialProjects);
  const [taskList, setTaskList] = useState<Task[]>(initialTasks);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>('In Progress');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskProject, setTaskProject] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem('clientflow-projects');

      if (savedProjects) {
        const parsed: unknown = JSON.parse(savedProjects);

        if (Array.isArray(parsed)) {
          const validProjects: Project[] = parsed
            .filter(
              (item): item is Record<string, unknown> =>
                item !== null &&
                typeof item === 'object' &&
                typeof item.name === 'string' &&
                typeof item.client === 'string' &&
                typeof item.progress === 'number' &&
                item.progress >= 0 &&
                item.progress <= 100 &&
                (item.status === 'In Progress' ||
                  item.status === 'In Review' ||
                  item.status === 'Completed'),
            )
            .map((item) => ({
              id: typeof item.id === 'string' && item.id.length > 0 ? item.id : crypto.randomUUID(),
              name: item.name as string,
              client: item.client as string,
              progress: item.progress as number,
              status: item.status as ProjectStatus,
            }));

          // Loading persisted data is intentional; this runs only once on mount.
          // eslint-disable-next-line react-hooks/set-state-in-effect
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

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('clientflow-tasks');

      if (savedTasks) {
        const parsed: unknown = JSON.parse(savedTasks);

        if (Array.isArray(parsed)) {
          const validTasks: Task[] = parsed
            .filter(
              (item): item is Record<string, unknown> =>
                item !== null &&
                typeof item === 'object' &&
                typeof item.id === 'string' &&
                typeof item.title === 'string' &&
                typeof item.project === 'string' &&
                typeof item.date === 'string' &&
                typeof item.completed === 'boolean',
            )
            .map((item) => ({
              id: item.id as string,
              title: item.title as string,
              project: item.project as string,
              date: item.date as string,
              completed: item.completed as boolean,
            }));

          // Loading persisted data is intentional; this runs only once on mount.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setTaskList(validTasks);
        }
      }
    } catch {
      console.error('Could not load saved ClientFlow tasks.');
    } finally {
      setTasksLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!tasksLoaded) return;

    try {
      localStorage.setItem('clientflow-tasks', JSON.stringify(taskList));
    } catch {
      console.error('Could not save ClientFlow tasks.');
    }
  }, [taskList, tasksLoaded]);

  const filteredProjects = projectList.filter((project) => {
    const query = searchQuery.trim().toLowerCase();

    return (
      project.name.toLowerCase().includes(query) || project.client.toLowerCase().includes(query)
    );
  });

  function resetProjectForm() {
    setProjectName('');
    setClientName('');
    setProjectStatus('In Progress');
    setEditingProject(null);
    setIsProjectModalOpen(false);
  }

  function handleCreateProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = projectName.trim();
    const trimmedClient = clientName.trim();

    if (!trimmedName || !trimmedClient) return;

    if (editingProject) {
      setProjectList((current) =>
        current.map((project) =>
          project.id === editingProject
            ? {
                ...project,
                name: trimmedName,
                client: trimmedClient,
                status: projectStatus,
              }
            : project,
        ),
      );
    } else {
      const newProject: Project = {
        id: crypto.randomUUID(),
        name: trimmedName,
        client: trimmedClient,
        progress: 0,
        status: projectStatus,
      };

      setProjectList((current) => [newProject, ...current]);
    }

    resetProjectForm();
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

  function handleDeleteProject(projectId: string) {
    const project = projectList.find((item) => item.id === projectId);
    if (!project) return;

    if (!window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      return;
    }

    setProjectList((current) => current.filter((item) => item.id !== projectId));
  }

  function handleToggleTask(taskId: string) {
    setTaskList((current) =>
      current.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    );
  }

  function resetTaskForm() {
    setTaskTitle('');
    setTaskProject('');
    setTaskDate('');
    setEditingTask(null);
    setIsTaskModalOpen(false);
  }

  function handleCreateTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = taskTitle.trim();
    const trimmedProject = taskProject.trim();

    if (!trimmedTitle || !trimmedProject || !taskDate) return;

    if (editingTask) {
      setTaskList((current) =>
        current.map((task) =>
          task.id === editingTask
            ? {
                ...task,
                title: trimmedTitle,
                project: trimmedProject,
                date: taskDate,
              }
            : task,
        ),
      );
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: trimmedTitle,
        project: trimmedProject,
        date: taskDate,
        completed: false,
      };

      setTaskList((current) => [...current, newTask]);
    }

    resetTaskForm();
  }

  function handleEditTask(taskId: string) {
    const task = taskList.find((item) => item.id === taskId);
    if (!task) return;

    setTaskTitle(task.title);
    setTaskProject(task.project);
    setTaskDate(/^\d{4}-\d{2}-\d{2}$/.test(task.date) ? task.date : '');
    setEditingTask(task.id);
    setIsTaskModalOpen(true);
  }

  function handleDeleteTask(taskId: string) {
    const task = taskList.find((item) => item.id === taskId);
    if (!task) return;

    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      return;
    }

    setTaskList((current) => current.filter((item) => item.id !== taskId));
  }

  const completedTasks = taskList.filter((task) => task.completed).length;
  const activeTasks = taskList.length - completedTasks;

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
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
            { label: 'Overview', href: '/', icon: Activity, active: true },
            { label: 'Projects', href: '/projects', icon: FolderKanban, active: false },
            { label: 'My Tasks', href: '/my-tasks', icon: ListTodo, active: false },
            { label: 'Clients', href: '/clients', icon: Users, active: false },
          ].map(({ label, href, icon: Icon, active }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
                active ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={19} />
              {label}
            </Link>
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
            onClick={() => {
              setEditingProject(null);
              setProjectName('');
              setClientName('');
              setProjectStatus('In Progress');
              setIsProjectModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} />
            New Project
          </button>
        </header>

        <label className="mb-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <Search size={18} className="text-slate-400" />
          <input
            type="search"
            placeholder="Search projects and clients..."
            aria-label="Search projects and clients"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ title, description, icon: Icon }) => {
            const value =
              title === 'Total Projects'
                ? projectList.length
                : title === 'Active Tasks'
                  ? activeTasks
                  : title === 'Completed Tasks'
                    ? completedTasks
                    : '08';

            return (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">{title}</p>
                  <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
                    <Icon size={20} />
                  </div>
                </div>
                <p className="mt-5 text-3xl font-bold text-slate-900">{value}</p>
                <p className="mt-2 text-xs text-slate-500">{description}</p>
              </article>
            );
          })}
        </section>

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
                    <th className="px-5 py-4 font-medium">Actions</th>
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
                  {filteredProjects.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center text-sm text-slate-500">
                        No projects match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
              <div>
                <div className="flex items-center gap-2">
                  <Clock3 size={18} className="text-violet-600" />
                  <h2 className="font-semibold text-slate-900">Upcoming Tasks</h2>
                </div>
                <p className="mt-1 text-sm text-slate-500">Check off tasks as you finish them</p>
              </div>

              <button
                type="button"
                onClick={() => setIsTaskModalOpen(true)}
                disabled={!tasksLoaded}
                className="flex shrink-0 items-center gap-1 rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
              >
                <Plus size={16} />
                Add Task
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {taskList.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-2 p-5 transition hover:bg-slate-50"
                >
                  <label className="flex min-w-0 flex-1 cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                      aria-label={`Mark ${task.title} as ${
                        task.completed ? 'not completed' : 'completed'
                      }`}
                      className="mt-1 h-4 w-4 shrink-0 accent-violet-600"
                    />

                    <span
                      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                        task.completed ? 'bg-emerald-500' : 'bg-violet-500'
                      }`}
                    />

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-medium ${
                          task.completed ? 'text-slate-400 line-through' : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">{task.project}</span>
                      <span
                        className={`mt-2 block text-xs ${
                          task.completed ? 'font-medium text-emerald-600' : 'text-slate-400'
                        }`}
                      >
                        {task.completed ? 'Completed' : task.date}
                      </span>
                    </span>
                  </label>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEditTask(task.id)}
                      aria-label={`Edit ${task.title}`}
                      title="Edit task"
                      className="rounded-lg p-2 text-slate-500 hover:bg-violet-50 hover:text-violet-700"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      aria-label={`Delete ${task.title}`}
                      title="Delete task"
                      className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>

      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 id="project-modal-title" className="text-xl font-bold text-slate-900">
                  {editingProject ? 'Edit Project' : 'Create Project'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">Add the project details below.</p>
              </div>
              <button
                type="button"
                onClick={resetProjectForm}
                aria-label="Close project form"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label
                  htmlFor="project-name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Project name
                </label>
                <input
                  id="project-name"
                  required
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  placeholder="e.g. Website Redesign"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label
                  htmlFor="client-name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Client name
                </label>
                <input
                  id="client-name"
                  required
                  value={clientName}
                  onChange={(event) => setClientName(event.target.value)}
                  placeholder="e.g. Acme Studio"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label
                  htmlFor="project-status"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Status
                </label>
                <select
                  id="project-status"
                  value={projectStatus}
                  onChange={(event) => setProjectStatus(event.target.value as ProjectStatus)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetProjectForm}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 id="task-modal-title" className="text-xl font-bold text-slate-900">
                {editingTask ? 'Edit Task' : 'Create Task'}
              </h2>

              <button
                type="button"
                onClick={resetTaskForm}
                aria-label="Close task form"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label
                  htmlFor="task-title"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Task title
                </label>
                <input
                  id="task-title"
                  required
                  value={taskTitle}
                  onChange={(event) => setTaskTitle(event.target.value)}
                  placeholder="e.g. Prepare project proposal"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label
                  htmlFor="task-project"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Project
                </label>
                <select
                  id="task-project"
                  required
                  value={taskProject}
                  onChange={(event) => setTaskProject(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                >
                  <option value="">Select a project</option>
                  {projectList.map((project) => (
                    <option key={project.id} value={project.name}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="task-date"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Due date
                </label>
                <input
                  id="task-date"
                  type="date"
                  required
                  value={taskDate}
                  onChange={(event) => setTaskDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetTaskForm}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
