import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { getTodos } from "../services/todoApi";
import { FaTasks, FaPlus, FaSearch } from "react-icons/fa";

const TABS = ["All", "Not Started", "In Progress", "Completed"];

const priorityColors = {
  Extreme: "text-red-500 bg-red-50",
  Moderate: "text-blue-500 bg-blue-50",
  Low: "text-green-500 bg-green-50",
};

const statusColors = {
  "Not Started": "text-red-500",
  "In Progress": "text-blue-500",
  Completed: "text-green-500",
};

const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-xl p-4 border border-gray-100 flex gap-3">
    <div className="w-4 h-4 rounded-full bg-gray-200 mt-1 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 bg-gray-200 rounded w-2/3" />
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="flex gap-3 mt-1">
        <div className="h-2.5 bg-gray-100 rounded w-20" />
        <div className="h-2.5 bg-gray-100 rounded w-24" />
      </div>
    </div>
    <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0" />
  </div>
);

const MyTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(searchQuery);
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

  const byTab = activeTab === "All" ? tasks : tasks.filter((t) => t.status === activeTab);
  const filtered = searchQuery
    ? byTab.filter((t) =>
        t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : byTab;

  return (
    <PageLayout>
      {/* Search result banner */}
      {searchQuery && (
        <div className="flex items-center justify-between mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-red-600">
            <FaSearch className="text-xs" />
            Results for <span className="font-semibold">"{searchQuery}"</span>
            <span className="text-red-400">— {filtered.length} found</span>
          </div>
          <button
            onClick={() => setSearchParams({})}
            className="text-xs text-red-400 hover:text-red-600 font-medium"
          >
            Clear
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <FaTasks className="text-blue-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">My Tasks</h1>
            <p className="text-xs text-gray-400">All your tasks in one place</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white transition"
          style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}
        >
          <FaPlus className="text-xs" /> Add Task
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {TABS.map((tab) => {
          const count = tab === "All" ? tasks.length : tasks.filter((t) => t.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                activeTab === tab
                  ? "bg-red-500 text-white border-red-500 shadow"
                  : "bg-white text-gray-500 border-gray-200 hover:border-red-300"
              }`}
            >
              {tab} {!loading && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTasks className="text-gray-400 text-2xl" />
            </div>
            <p className="text-gray-500 font-medium">No tasks found</p>
            <p className="text-gray-400 text-sm mt-1">
              {activeTab === "All" ? "Add your first task from the Dashboard" : `No tasks with status "${activeTab}"`}
            </p>
          </div>
        ) : (
          filtered.map((todo) => (
            <div
              key={todo._id}
              onClick={() => navigate(`/task/${todo._id}`)}
              className="bg-white rounded-xl p-4 border border-gray-100 flex gap-3 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="pt-1 flex-shrink-0">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  todo.status === "Completed" ? "border-green-400 bg-green-400"
                  : todo.status === "In Progress" ? "border-blue-400"
                  : "border-red-400"
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm">{todo.title}</h3>
                <p className="text-gray-400 text-xs mt-1 line-clamp-2">{todo.description}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${priorityColors[todo.priority] || "text-gray-500 bg-gray-100"}`}>
                    {todo.priority}
                  </span>
                  <span className={`font-medium ${statusColors[todo.status] || "text-gray-500"}`}>
                    {todo.status}
                  </span>
                  {todo.date && (
                    <span className="text-gray-400">{new Date(todo.date).toLocaleDateString("en-GB")}</span>
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

export default MyTask;
