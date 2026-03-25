import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getTodoById, deleteTodo, updateTodo } from "../services/todoApi";
import {
  FaArrowLeft, FaEdit, FaTrash, FaCalendarAlt, FaFlag,
  FaCheckCircle, FaClock, FaHourglassHalf, FaImage,
  FaAlignLeft, FaExclamationTriangle,
} from "react-icons/fa";

/* ── priority meta ───────────────────────────────────────── */
const PRIORITY = {
  Extreme:  { label: "Extremely High", color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
  Moderate: { label: "High",           color: "#f97316", bg: "#fff7ed", border: "#fed7aa" },
  Low:      { label: "Low",            color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0" },
};

/* ── status step config ──────────────────────────────────── */
const STEPS = ["Not Started", "In Progress", "Completed"];
const STEP_META = {
  "Not Started": { icon: FaExclamationTriangle, color: "#ef4444", bg: "#fef2f2", label: "Not Started" },
  "In Progress":  { icon: FaHourglassHalf,       color: "#3b82f6", bg: "#eff6ff", label: "In Progress" },
  Completed:      { icon: FaCheckCircle,          color: "#22c55e", bg: "#f0fdf4", label: "Completed"   },
};

/* ── skeleton ────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="flex w-full h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="animate-pulse h-4 w-32 bg-gray-200 rounded mb-6" />
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="bg-white rounded-2xl p-6 space-y-4 border border-gray-100">
            <div className="flex justify-between">
              <div className="h-7 bg-gray-200 rounded w-2/3" />
              <div className="flex gap-2">
                <div className="h-9 w-16 bg-gray-100 rounded-xl" />
                <div className="h-9 w-20 bg-gray-100 rounded-xl" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-7 w-28 bg-gray-100 rounded-full" />
              <div className="h-7 w-24 bg-gray-100 rounded-full" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 h-28" />
          <div className="bg-white rounded-2xl p-6 border border-gray-100 h-40" />
        </div>
      </main>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════ */
const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => { fetchTodo(); }, [id]);

  const fetchTodo = async () => {
    try { const res = await getTodoById(id); setTodo(res.data); }
    catch { setTodo(null); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    setDeleting(true);
    try { await deleteTodo(id); navigate("/"); }
    catch (err) { console.error(err); setDeleting(false); }
  };

  const handleStatusChange = async (newStatus) => {
    if (!todo || newStatus === todo.status || updatingStatus) return;
    setUpdatingStatus(true);
    try {
      const fd = new FormData();
      fd.append("title",       todo.title);
      fd.append("description", todo.description || "");
      fd.append("priority",    todo.priority);
      fd.append("status",      newStatus);
      if (todo.date) fd.append("date", todo.date);
      await updateTodo(id, fd);
      setTodo((prev) => ({ ...prev, status: newStatus }));
    } catch (err) { console.error(err); }
    finally { setUpdatingStatus(false); }
  };

  if (loading) return <Skeleton />;

  if (!todo) return (
    <div className="flex w-full h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500 text-lg">Task not found.</p>
          <button onClick={() => navigate("/")} className="text-red-500 hover:underline text-sm font-medium">
            Back to Dashboard
          </button>
        </main>
      </div>
    </div>
  );

  const ps = PRIORITY[todo.priority] || PRIORITY.Moderate;
  const currentStep = STEPS.indexOf(todo.status);
  const formattedDate = todo.date
    ? new Date(todo.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="flex w-full h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-red-500 text-sm font-medium mb-6 transition"
          >
            <FaArrowLeft className="text-xs" />
            Back
          </button>

          <div className="max-w-4xl mx-auto space-y-4">

            {/* ── Hero card ─────────────────────────────────── */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex gap-0">
                {/* Left content */}
                <div className="flex-1 p-7">
                  {/* Priority pill */}
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-4"
                    style={{ color: ps.color, backgroundColor: ps.bg, border: `1px solid ${ps.border}` }}
                  >
                    <FaFlag className="text-[10px]" />
                    {ps.label}
                  </span>

                  <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-3">{todo.title}</h1>

                  {formattedDate && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-5">
                      <FaCalendarAlt className="text-xs" />
                      Due {formattedDate}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-auto pt-2">
                    <button
                      onClick={() => navigate(`/edit/${id}`)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                    >
                      <FaEdit className="text-xs" /> Edit Task
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition disabled:opacity-50"
                    >
                      <FaTrash className="text-xs" />
                      {deleting ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>

                {/* Right image panel */}
                {todo.image && (
                  <div className="w-56 flex-shrink-0">
                    <img src={todo.image} alt={todo.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* ── Status stepper card ───────────────────────── */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <FaClock className="text-red-400 text-sm" />
                <h3 className="text-sm font-bold text-gray-800">Task Status</h3>
                {updatingStatus && (
                  <span className="ml-auto text-xs text-gray-400 animate-pulse">Updating…</span>
                )}
              </div>

              {/* Step track */}
              <div className="flex items-center">
                {STEPS.map((step, idx) => {
                  const meta = STEP_META[step];
                  const Icon = meta.icon;
                  const isDone    = idx < currentStep;
                  const isCurrent = idx === currentStep;
                  const isLast    = idx === STEPS.length - 1;

                  return (
                    <div key={step} className="flex items-center flex-1">
                      {/* Step node */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <button
                          onClick={() => handleStatusChange(step)}
                          disabled={updatingStatus}
                          title={`Set to ${step}`}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm
                            ${isCurrent ? "scale-110 shadow-md" : "hover:scale-105"}
                            ${isDone || isCurrent ? "text-white" : "text-gray-300 bg-gray-50 border-2 border-dashed border-gray-200"}`}
                          style={isDone || isCurrent ? { backgroundColor: meta.color } : {}}
                        >
                          <Icon className="text-base" />
                        </button>
                        <span
                          className={`mt-2 text-[11px] font-semibold text-center leading-tight
                            ${isCurrent ? "text-gray-800" : isDone ? "text-gray-500" : "text-gray-300"}`}
                        >
                          {meta.label}
                        </span>
                      </div>

                      {/* Connector line */}
                      {!isLast && (
                        <div className="flex-1 h-1 mx-2 rounded-full overflow-hidden bg-gray-100">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: isDone ? "100%" : "0%",
                              backgroundColor: STEP_META[STEPS[idx + 1]].color,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Current status banner */}
              <div
                className="mt-6 flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{ backgroundColor: STEP_META[todo.status]?.bg || "#f9fafb" }}
              >
                {(() => { const Icon = STEP_META[todo.status]?.icon || FaClock; return <Icon style={{ color: STEP_META[todo.status]?.color }} className="text-base flex-shrink-0" />; })()}
                <div>
                  <p className="text-xs font-semibold" style={{ color: STEP_META[todo.status]?.color }}>
                    Current Status
                  </p>
                  <p className="text-sm font-bold text-gray-800">{todo.status}</p>
                </div>
                <span className="ml-auto text-xs text-gray-400">Click a step to change status</span>
              </div>
            </div>

            {/* ── Description card ──────────────────────────── */}
            {todo.description && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaAlignLeft className="text-red-400 text-sm" />
                  <h3 className="text-sm font-bold text-gray-800">Description</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {todo.description}
                </p>
              </div>
            )}

            {/* ── Attachment card ───────────────────────────── */}
            {todo.image && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaImage className="text-red-400 text-sm" />
                  <h3 className="text-sm font-bold text-gray-800">Attachment</h3>
                </div>
                <div className="rounded-2xl overflow-hidden border border-gray-100">
                  <img src={todo.image} alt={todo.title} className="w-full max-h-72 object-cover" />
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskDetails;
