import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TaskCard from "../components/TaskCard";
import StatusCard from "../components/StatusCard";
import CreateTaskModal from "./CreateTask";
import { getTodos, getStats } from "../services/todoApi";
import { FaPlus, FaUserPlus, FaCheckSquare, FaRegClock } from "react-icons/fa";

const teamAvatars = [
  "https://ui-avatars.com/api/?name=Alice&background=f87171&color=fff&size=32",
  "https://ui-avatars.com/api/?name=Bob&background=60a5fa&color=fff&size=32",
  "https://ui-avatars.com/api/?name=Carol&background=34d399&color=fff&size=32",
  "https://ui-avatars.com/api/?name=Dan&background=a78bfa&color=fff&size=32",
];

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const todoRes = await getTodos();
      const statsRes = await getStats();
      setTodos(todoRes.data || []);
      setStats(statsRes.data || {});
    } catch {
      setTodos([]);
      setStats({});
    }
  };

  const activeTodos = todos.filter((t) => t.status !== "Completed");
  const completedTodos = todos.filter((t) => t.status === "Completed");

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex w-full h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Welcome row */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, Sundar
            </h1>
            <div className="flex items-center gap-3">
              {/* Team avatars */}
              <div className="flex -space-x-2">
                {teamAvatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs text-gray-600 font-semibold">
                  +3
                </div>
              </div>
              <button className="flex items-center gap-1.5 border border-red-400 text-red-500 text-sm px-3 py-1.5 rounded-full hover:bg-red-50 transition font-medium">
                <FaUserPlus className="text-xs" />
                Invite
              </button>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: To-Do List */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-gray-500">
                  <FaRegClock className="text-sm" />
                  <span className="text-sm font-semibold text-red-500">To-Do</span>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition font-medium"
                >
                  <FaPlus className="text-xs" />
                  Add task
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-3 font-medium">
                {today} &nbsp;•&nbsp; Today
              </p>

              <div className="overflow-y-auto max-h-[calc(100vh-320px)] pr-1 space-y-3 scrollbar-thin">
                {activeTodos.length > 0 ? (
                  activeTodos.map((todo) => (
                    <TaskCard key={todo._id} todo={todo} />
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    No active tasks. Add a task to get started!
                  </div>
                )}
              </div>
            </div>

            {/* Right: Stats + Completed */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Task Status */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 rounded border-2 border-gray-400 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-sm" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-700">Task Status</h2>
                </div>
                <div className="flex justify-around">
                  <StatusCard
                    label="Completed"
                    value={stats.completed || 0}
                    color="green"
                  />
                  <StatusCard
                    label="In Progress"
                    value={stats.inProgress || 0}
                    color="blue"
                  />
                  <StatusCard
                    label="Not Started"
                    value={stats.notStarted || 0}
                    color="red"
                  />
                </div>
              </div>

              {/* Completed Tasks */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <FaCheckSquare className="text-red-400 text-sm" />
                  <h2 className="text-sm font-semibold text-gray-700">
                    Completed Task
                  </h2>
                </div>
                <div className="overflow-y-auto max-h-[calc(100vh-480px)] pr-1 space-y-3 scrollbar-thin">
                  {completedTodos.length > 0 ? (
                    completedTodos.map((todo) => (
                      <CompletedCard key={todo._id} todo={todo} />
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-400 text-sm">
                      No completed tasks yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={fetchData}
      />
    </div>
  );
};

const CompletedCard = ({ todo }) => {
  const completedAt = todo.updatedAt
    ? new Date(todo.updatedAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="flex gap-3 items-start bg-gray-50 rounded-xl p-3">
      <div className="pt-0.5 flex-shrink-0">
        <div className="w-4 h-4 rounded-full border-2 border-green-400 flex items-center justify-center bg-white">
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-gray-800">{todo.title}</h4>
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
          {todo.description}
        </p>
        <div className="flex items-center gap-2 mt-1 text-xs">
          <span className="text-green-500 font-medium">Status: Completed</span>
          {completedAt && (
            <span className="text-gray-400">Completed {completedAt}</span>
          )}
        </div>
      </div>
      {todo.image && (
        <img
          src={todo.image}
          alt={todo.title}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        />
      )}
    </div>
  );
};

export default Dashboard;
