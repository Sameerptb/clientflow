'use client';

import { CheckCircle2, Clock3, ListTodo } from 'lucide-react';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';

type Task = {
  id: string;
  title: string;
  project: string;
  date: string;
  completed: boolean;
};

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('clientflow-tasks');

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          const validTasks: Task[] = parsed.filter(
            (item): item is Task =>
              item !== null &&
              typeof item === 'object' &&
              typeof item.id === 'string' &&
              typeof item.title === 'string' &&
              typeof item.project === 'string' &&
              typeof item.date === 'string' &&
              typeof item.completed === 'boolean',
          );

          // Loading saved tasks once when the page opens is intentional.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setTasks(validTasks);
        }
      }
    } catch {
      console.error('Could not load ClientFlow tasks.');
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem('clientflow-tasks', JSON.stringify(tasks));
    } catch {
      console.error('Could not save ClientFlow tasks.');
    }
  }, [tasks, loaded]);

  function toggleTask(taskId: string) {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    );
  }

  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = tasks.length - completedCount;

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="min-w-0 flex-1">
        <main className="mx-auto max-w-6xl px-5 py-8 md:px-10">
          <p className="text-sm text-slate-500">Workspace / My Tasks</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">My Tasks</h1>

          <p className="mt-2 text-sm text-slate-500">Keep track of your work and progress.</p>

          <section className="mt-8 grid gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Total Tasks</p>
                <ListTodo className="text-violet-600" size={20} />
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{tasks.length}</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Active Tasks</p>
                <Clock3 className="text-amber-600" size={20} />
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{activeCount}</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Completed Tasks</p>
                <CheckCircle2 className="text-emerald-600" size={20} />
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{completedCount}</p>
            </article>
          </section>

          <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-5">
              <h2 className="font-semibold text-slate-900">All Tasks</h2>
              <p className="mt-1 text-sm text-slate-500">Select a checkbox to update a task.</p>
            </div>

            {!loaded ? (
              <p className="p-8 text-sm text-slate-500">Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p className="p-8 text-sm text-slate-500">
                No tasks yet. Create a task from your dashboard.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {tasks.map((task) => (
                  <label
                    key={task.id}
                    className="flex cursor-pointer items-start gap-3 p-5 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="mt-1 h-4 w-4 accent-violet-600"
                      aria-label={`Mark ${task.title} as ${
                        task.completed ? 'not completed' : 'completed'
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

                      <span className="mt-2 block text-xs text-slate-400">
                        {task.completed ? 'Completed' : task.date}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
