import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { getTodos } from "../services/todoApi";
import { FaListUl } from "react-icons/fa";

const CATEGORIES = [
  { label: "Extreme", color: "#ef4444", bg: "bg-red-50", border: "border-red-200", dot: "bg-red-400", text: "text-red-600" },
  { label: "Moderate", color: "#3b82f6", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-400", text: "text-blue-600" },
  { label: "Low", color: "#22c55e", bg: "bg-green-50", border: "border-green-200", dot: "bg-green-400", text: "text-green-600" },
];

const statusColors = {
  "Not Started": "text-red-500 bg-red-50",
  "In Progress": "text-blue-500 bg-blue-50",
  Completed: "text-green-500 bg-green-50",
};

const SkeletonGroup = () => (
  <div className="animate-pulse bg-white rounded-2xl border border-gray-100 p-5">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-3 h-3 rounded-full bg-gray-200" />
      <div className="h-4 bg-gray-200 rounded w-24" />
      <div className="h-5 bg-gray-100 rounded-full w-8 ml-auto" />
    </div>
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div key={i} className="flex gap-3 p-3 rounded-xl bg-gray-50">
          <div className="w-4 h-4 rounded-full bg-gray-200 mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-2.5 bg-gray-100 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TaskCategories = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTodos();
        setTasks(res.data || []);
      } catch {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <PageLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <FaListUl className="text-purple-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Task Categories</h1>
          <p className="text-xs text-gray-400">Tasks grouped by priority level</p>
        </div>
      </div>

      {/* Category groups */}
      <div className="space-y-5">
        {loading ? (
          CATEGORIES.map((c) => <SkeletonGroup key={c.label} />)
        ) : (
          CATEGORIES.map((cat) => {
            const group = tasks.filter((t) => t.priority === cat.label);
            return (
              <div key={cat.label} className={`bg-white rounded-2xl border ${cat.border} p-5`}>
                {/* Group header */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-3 h-3 rounded-full ${cat.dot}`} />
                  <h2 className={`text-sm font-bold ${cat.text}`}>{cat.label} Priority</h2>
                  <span className={`ml-auto px-2.5 py-0.5 rounded-full text-xs font-bold ${cat.text} ${cat.bg}`}>
                    {group.length}
                  </span>
                </div>

                {group.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">No tasks in this category</p>
                ) : (
                  <div className="space-y-2">
                    {group.map((todo) => (
                      <div
                        key={todo._id}
                        onClick={() => navigate(`/task/${todo._id}`)}
                        className={`flex gap-3 p-3 rounded-xl ${cat.bg} cursor-pointer hover:opacity-80 transition`}
                      >
                        <div className="pt-0.5 flex-shrink-0">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center`}
                            style={{ borderColor: cat.color }}>
                            {todo.status === "Completed" && (
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-800 leading-tight">{todo.title}</h4>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{todo.description}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusColors[todo.status] || "text-gray-500 bg-gray-100"}`}>
                              {todo.status}
                            </span>
                            {todo.date && (
                              <span className="text-xs text-gray-400">{new Date(todo.date).toLocaleDateString("en-GB")}</span>
                            )}
                          </div>
                        </div>
                        {todo.image && (
                          <img src={todo.image} alt={todo.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </PageLayout>
  );
};

export default TaskCategories;
