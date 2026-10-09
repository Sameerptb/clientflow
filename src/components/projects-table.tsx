import { ArrowUpRight, MoreHorizontal } from 'lucide-react';

type Project = {
  id: number;
  name: string;
  client: string;
  category: string;
  progress: number;
  status: 'In Progress' | 'In Review' | 'Completed';
  dueDate: string;
};

const projects: Project[] = [
  {
    id: 1,
    name: 'Website Redesign',
    client: 'Acme Studio',
    category: 'Design',
    progress: 75,
    status: 'In Progress',
    dueDate: 'Oct 18, 2026',
  },
  {
    id: 2,
    name: 'Mobile Application',
    client: 'Nova Digital',
    category: 'Development',
    progress: 45,
    status: 'In Progress',
    dueDate: 'Oct 22, 2026',
  },
  {
    id: 3,
    name: 'Marketing Website',
    client: 'Bright Agency',
    category: 'Marketing',
    progress: 100,
    status: 'Completed',
    dueDate: 'Oct 05, 2026',
  },
  {
    id: 4,
    name: 'Customer Portal',
    client: 'Orbit Systems',
    category: 'Development',
    progress: 60,
    status: 'In Review',
    dueDate: 'Oct 25, 2026',
  },
];

function StatusBadge({ status }: { status: Project['status'] }) {
  const styles = {
    'In Progress': 'bg-violet-50 text-violet-700',
    'In Review': 'bg-amber-50 text-amber-700',
    Completed: 'bg-emerald-50 text-emerald-700',
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function ProjectsTable() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
        <div>
          <h2 className="font-semibold text-slate-900">Recent Projects</h2>
          <p className="mt-1 text-sm text-slate-500">An overview of your latest work</p>
        </div>

        <button className="flex items-center gap-1 text-sm font-semibold text-violet-700 hover:text-violet-900">
          View all <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-190 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4 font-medium">Project</th>
              <th className="px-5 py-4 font-medium">Progress</th>
              <th className="px-5 py-4 font-medium">Due date</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                className="border-t border-slate-100 transition hover:bg-slate-50/70"
              >
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-800">{project.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {project.client} · {project.category}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-violet-600"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{project.progress}%</span>
                  </div>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-slate-500">{project.dueDate}</td>

                <td className="px-5 py-4">
                  <StatusBadge status={project.status} />
                </td>

                <td className="px-5 py-4">
                  <button
                    aria-label={`More actions for ${project.name}`}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <MoreHorizontal size={19} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
        Showing {projects.length} sample projects
      </div>
    </section>
  );
}
