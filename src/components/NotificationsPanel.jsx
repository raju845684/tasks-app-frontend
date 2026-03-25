import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTodos } from "../services/todoApi";
import { FaArrowLeft, FaBell, FaClock, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";

const priorityStyle = {
  Extreme:  { label: "Extremely High", color: "text-red-500",    bg: "bg-red-50",    dot: "bg-red-500" },
  Moderate: { label: "High",           color: "text-orange-500", bg: "bg-orange-50", dot: "bg-orange-500" },
  Low:      { label: "Low",            color: "text-green-500",  bg: "bg-green-50",  dot: "bg-green-500" },
};

const timeAgo = (dateStr) => {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  <  1) return "just now";
  if (hours <  1) return `${mins}m ago`;
  if (days  <  1) return `${hours}h ago`;
  if (days  <  7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

const sectionMeta = {
  Overdue:  { icon: FaExclamationCircle, color: "text-red-500",    bg: "bg-red-50",    label: "Overdue" },
  Today:    { icon: FaClock,             color: "text-orange-500", bg: "bg-orange-50", label: "Today" },
  Upcoming: { icon: FaBell,              color: "text-blue-500",   bg: "bg-blue-50",   label: "Upcoming" },
};

const NotificationsPanel = ({ onClose }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getTodos()
      .then((res) => setTodos(res.data || []))
      .catch(() => setTodos([]))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueTasks  = todos.filter((t) => { if (!t.date || t.status === "Completed") return false; const d = new Date(t.date); d.setHours(0,0,0,0); return d < today; });
  const todayTasks    = todos.filter((t) => { if (!t.date) return false; const d = new Date(t.date); d.setHours(0,0,0,0); return d.getTime() === today.getTime(); });
  const upcomingTasks = todos.filter((t) => { if (!t.date) return false; const d = new Date(t.date); d.setHours(0,0,0,0); return d > today; });

  const totalCount = overdueTasks.length + todayTasks.length + upcomingTasks.length;

  const renderTask = (todo) => {
    const ps = priorityStyle[todo.priority] || { label: todo.priority, color: "text-gray-500", bg: "bg-gray-50", dot: "bg-gray-400" };
    const ago = timeAgo(todo.createdAt);
    return (
      <div
        key={todo._id}
        onClick={() => { navigate(`/task/${todo._id}`); onClose(); }}
        className="flex gap-3 items-start px-4 py-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition group border border-transparent hover:border-gray-100"
      >
        {/* Thumbnail or placeholder */}
        {todo.image ? (
          <img src={todo.image} alt={todo.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow-sm" />
        ) : (
          <div className={`w-12 h-12 rounded-xl ${ps.bg} flex-shrink-0 flex items-center justify-center`}>
            <span className={`w-3 h-3 rounded-full ${ps.dot}`} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 leading-snug">
            Complete the{" "}
            <span className="font-semibold text-gray-900">{todo.title}</span>
            {ago && (
              <span className="ml-1.5 text-xs font-medium text-gray-400 inline-flex items-center gap-0.5">
                <FaClock className="text-[9px]" />
                {ago}
              </span>
            )}
          </p>
          <span className={`inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${ps.bg} ${ps.color}`}>
            Priority: {ps.label}
          </span>
        </div>
      </div>
    );
  };

  const Section = ({ type, items }) => {
    if (items.length === 0) return null;
    const meta = sectionMeta[type];
    const Icon = meta.icon;
    return (
      <div className="mb-3">
        <div className={`flex items-center gap-2 mx-4 mb-2 px-3 py-1.5 rounded-xl ${meta.bg}`}>
          <Icon className={`text-xs ${meta.color}`} />
          <span className={`text-xs font-bold ${meta.color}`}>{meta.label}</span>
          <span className={`ml-auto text-xs font-bold ${meta.color} opacity-70`}>{items.length}</span>
        </div>
        <div className="space-y-1">{items.map(renderTask)}</div>
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-[340px] bg-white z-50 shadow-2xl flex flex-col rounded-l-3xl animate-slideIn">
        {/* Header */}
        <div className="px-5 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                <FaBell className="text-red-500 text-sm" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Notifications</h2>
              {totalCount > 0 && (
                <span className="text-xs font-bold text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
            >
              <FaArrowLeft className="text-xs" />
            </button>
          </div>
          <p className="text-xs text-gray-400 pl-10">Your task reminders</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-3">
          {loading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse flex gap-3 p-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3.5 bg-gray-200 rounded w-4/5" />
                    <div className="h-5 bg-gray-100 rounded-full w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : totalCount === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 pb-10">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                <FaCheckCircle className="text-3xl text-gray-200" />
              </div>
              <p className="text-sm font-medium">All caught up!</p>
              <p className="text-xs text-gray-300">No pending tasks right now</p>
            </div>
          ) : (
            <>
              <Section type="Overdue"  items={overdueTasks} />
              <Section type="Today"    items={todayTasks} />
              <Section type="Upcoming" items={upcomingTasks} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsPanel;
