import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTodos } from "../services/todoApi";
import { FaArrowLeft, FaBell } from "react-icons/fa";

const priorityStyle = {
  Extreme: { label: "Extremely High", color: "text-red-500" },
  Moderate: { label: "High", color: "text-orange-500" },
  Low: { label: "Low", color: "text-green-500" },
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

  const todayTasks = todos.filter((t) => {
    if (!t.date) return false;
    const d = new Date(t.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  const upcomingTasks = todos.filter((t) => {
    if (!t.date) return false;
    const d = new Date(t.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() > today.getTime();
  });

  const overdueTasks = todos.filter((t) => {
    if (!t.date || t.status === "Completed") return false;
    const d = new Date(t.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() < today.getTime();
  });

  const renderTask = (todo) => {
    const ps = priorityStyle[todo.priority] || { label: todo.priority, color: "text-gray-500" };
    return (
      <div
        key={todo._id}
        onClick={() => { navigate(`/task/${todo._id}`); onClose(); }}
        className="flex gap-3 items-start p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition group"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 leading-snug">
            Complete the <span className="font-bold">{todo.title}</span>
            {todo.date && (
              <span className="text-gray-400 text-xs ml-1">
                {Math.abs(Math.round((new Date(todo.date) - new Date()) / 3600000))}h
              </span>
            )}
          </p>
          <p className={`text-xs mt-1 font-medium ${ps.color}`}>Priority: {ps.label}</p>
        </div>
        {todo.image ? (
          <img src={todo.image} alt={todo.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center">
            <FaBell className="text-gray-300 text-xl" />
          </div>
        )}
      </div>
    );
  };

  const Section = ({ title, items }) =>
    items.length === 0 ? null : (
      <div className="mb-2">
        <p className="text-xs font-semibold text-gray-400 px-3 py-2">{title}</p>
        {items.map(renderTask)}
      </div>
    );

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col rounded-l-3xl animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Notifications</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition">
            <FaArrowLeft />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-2">
          {loading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse flex gap-3 p-3">
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gray-200 flex-shrink-0" />
                </div>
              ))}
            </div>
          ) : todos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
              <FaBell className="text-4xl text-gray-200" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <>
              <Section title="Overdue" items={overdueTasks} />
              <Section title="Today" items={todayTasks} />
              <Section title="Upcoming" items={upcomingTasks} />
              {overdueTasks.length === 0 && todayTasks.length === 0 && upcomingTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400">
                  <FaBell className="text-3xl text-gray-200" />
                  <p className="text-sm">All caught up!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsPanel;
