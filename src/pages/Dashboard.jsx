import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TaskCard from "../components/TaskCard";
import StatusCard from "../components/StatusCard";
import CreateTaskModal from "./CreateTask";
import { getTodos, getStats } from "../services/todoApi";
import { useAuth } from "../context/AuthContext";
import { FaPlus, FaCheckSquare, FaRegClock } from "react-icons/fa";

/* ─── Skeleton pieces ─────────────────────────────────────── */

const TaskCardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-xl p-4 border border-gray-100 flex gap-3">
    <div className="pt-1 flex-shrink-0">
      <div className="w-4 h-4 rounded-full bg-gray-200" />
    </div>
    <div className="flex-1 space-y-2">
      <div className="h-3.5 bg-gray-200 rounded w-2/3" />
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-4/5" />
      <div className="flex gap-4 mt-1">
        <div className="h-2.5 bg-gray-100 rounded w-20" />
        <div className="h-2.5 bg-gray-100 rounded w-24" />
      </div>
    </div>
    <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0" />
  </div>
);

const StatusCardSkeleton = () => (
  <div className="animate-pulse flex flex-col items-center gap-2">
    <div className="w-24 h-24 rounded-full bg-gray-200" />
    <div className="h-3 bg-gray-200 rounded w-16" />
  </div>
);

const CompletedCardSkeleton = () => (
  <div className="animate-pulse flex gap-3 items-start bg-gray-50 rounded-xl p-3">
    <div className="pt-0.5 flex-shrink-0">
      <div className="w-4 h-4 rounded-full bg-gray-200" />
    </div>
    <div className="flex-1 space-y-2">
      <div className="h-3.5 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="flex gap-3">
        <div className="h-2.5 bg-gray-100 rounded w-20" />
        <div className="h-2.5 bg-gray-100 rounded w-24" />
      </div>
    </div>
    <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0" />
  </div>
);

/* ─── Dashboard ───────────────────────────────────────────── */

const Dashboard = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [todoRes, statsRes] = await Promise.all([getTodos(), getStats()]);
      setTodos(todoRes.data || []);
      setStats(statsRes.data || {});
    } catch {
      setTodos([]);
      setStats({});
    } finally {
      setLoading(false);
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

        <main className="flex-1 overflow-hidden flex flex-col px-6 pt-5 pb-4 gap-4">
          {/* Welcome row */}
          <div className="flex items-center justify-between flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {user?.name?.split(" ")[0]}
            </h1>
          </div>

          {/* Two-column layout — fills remaining height exactly */}
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* ── Left: To-Do ── */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-2 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <FaRegClock className="text-sm text-gray-400" />
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
              <p className="text-xs text-gray-400 mb-3 font-medium flex-shrink-0">
                {today} &nbsp;•&nbsp; Today
              </p>

              {/* scrollable list */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                {loading ? (
                  <>
                    <TaskCardSkeleton />
                    <TaskCardSkeleton />
                    <TaskCardSkeleton />
                  </>
                ) : activeTodos.length > 0 ? (
                  activeTodos.map((todo) => (
                    <TaskCard key={todo._id} todo={todo} onRefresh={fetchData} />
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    No active tasks. Add a task to get started!
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: Stats + Completed ── */}
            <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">

              {/* Task Status — fixed height */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex-shrink-0">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 rounded border-2 border-gray-400 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-sm" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-700">Task Status</h2>
                </div>

                {loading ? (
                  <div className="flex justify-around">
                    <StatusCardSkeleton />
                    <StatusCardSkeleton />
                    <StatusCardSkeleton />
                  </div>
                ) : (
                  <div className="flex justify-around">
                    <StatusCard label="Completed"  value={stats.completed  || 0} color="green" />
                    <StatusCard label="In Progress" value={stats.inProgress || 0} color="blue"  />
                    <StatusCard label="Not Started" value={stats.notStarted || 0} color="red"   />
                  </div>
                )}
              </div>

              {/* Completed Tasks — grows + scrolls internally */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col flex-1 overflow-hidden">
                <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                  <FaCheckSquare className="text-red-400 text-sm" />
                  <h2 className="text-sm font-semibold text-gray-700">Completed Task</h2>
                </div>

                {/* scrollable list */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                  {loading ? (
                    <>
                      <CompletedCardSkeleton />
                      <CompletedCardSkeleton />
                    </>
                  ) : completedTodos.length > 0 ? (
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

/* ─── Completed card ──────────────────────────────────────── */

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
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{todo.description}</p>
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
