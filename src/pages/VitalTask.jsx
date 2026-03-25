import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { getTodos } from "../services/todoApi";
import { FaExclamationCircle, FaFire } from "react-icons/fa";

const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-xl p-4 border border-gray-100 flex gap-3">
    <div className="w-4 h-4 rounded-full bg-gray-200 mt-1 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 bg-gray-200 rounded w-2/3" />
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-4/5" />
      <div className="flex gap-3">
        <div className="h-2.5 bg-gray-100 rounded w-20" />
        <div className="h-2.5 bg-gray-100 rounded w-24" />
      </div>
    </div>
    <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0" />
  </div>
);

const statusColors = {
  "Not Started": "text-red-500 bg-red-50",
  "In Progress": "text-blue-500 bg-blue-50",
  Completed: "text-green-500 bg-green-50",
};

const VitalTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVital = async () => {
      try {
        const res = await getTodos();
        const vital = (res.data || []).filter((t) => t.priority === "Extreme");
        setTasks(vital);
      } catch {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVital();
  }, []);

  return (
    <PageLayout>
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
          <FaFire className="text-red-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Vital Tasks</h1>
          <p className="text-xs text-gray-400">Extreme priority tasks that need urgent attention</p>
        </div>
      </div>

      {/* Count badge */}
      {!loading && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
            <FaExclamationCircle />
            {tasks.length} Extreme priority {tasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>
      )}

      {/* Task list */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaFire className="text-red-400 text-2xl" />
            </div>
            <p className="text-gray-500 font-medium">No vital tasks</p>
            <p className="text-gray-400 text-sm mt-1">Tasks marked as Extreme priority will appear here</p>
          </div>
        ) : (
          tasks.map((todo) => (
            <div
              key={todo._id}
              onClick={() => navigate(`/task/${todo._id}`)}
              className="bg-white rounded-xl p-4 border border-red-100 flex gap-3 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="pt-1 flex-shrink-0">
                <div className="w-4 h-4 rounded-full border-2 border-red-400 flex items-center justify-center">
                  {todo.status === "Completed" && <div className="w-2 h-2 rounded-full bg-red-400" />}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm">{todo.title}</h3>
                <p className="text-gray-400 text-xs mt-1 line-clamp-2">{todo.description}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-600">
                    Extreme
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusColors[todo.status] || "text-gray-500 bg-gray-100"}`}>
                    {todo.status}
                  </span>
                  {todo.date && (
                    <span className="text-xs text-gray-400">
                      {new Date(todo.date).toLocaleDateString("en-GB")}
                    </span>
                  )}
                </div>
              </div>
              {todo.image && (
                <img src={todo.image} alt={todo.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              )}
            </div>
          ))
        )}
      </div>
    </PageLayout>
  );
};

export default VitalTask;
