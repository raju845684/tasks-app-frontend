import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { getTodoById, deleteTodo, updateTodo } from "../services/todoApi";
import {
  FaArrowLeft, FaEdit, FaTrash, FaCalendarAlt, FaFlag,
  FaCheckCircle, FaClock, FaHourglassHalf, FaExclamationTriangle,
  FaChevronDown, FaUser, FaTag, FaPaperclip, FaCommentAlt,
  FaHome, FaTasks, FaEllipsisH,
} from "react-icons/fa";

/* ─── meta maps ─────────────────────────────────────────── */
const PRIORITY_META = {
  Extreme:  { label: "Highest",     color: "#ef4444", bg: "#fef2f2", border: "#fca5a5", icon: "🔴" },
  Moderate: { label: "Medium",      color: "#f97316", bg: "#fff7ed", border: "#fdba74", icon: "🟠" },
  Low:      { label: "Low",         color: "#22c55e", bg: "#f0fdf4", border: "#86efac", icon: "🟢" },
};

const STATUS_META = {
  "Not Started": { label: "TO DO",       color: "#6b7280", bg: "#f3f4f6", border: "#d1d5db", Icon: FaExclamationTriangle },
  "In Progress":  { label: "IN PROGRESS", color: "#2563eb", bg: "#eff6ff", border: "#93c5fd", Icon: FaHourglassHalf },
  Completed:      { label: "DONE",        color: "#16a34a", bg: "#f0fdf4", border: "#86efac", Icon: FaCheckCircle },
};

const STATUS_FLOW = ["Not Started", "In Progress", "Completed"];

/* ─── helpers ───────────────────────────────────────────── */
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

const timeAgo = (d) => {
  if (!d) return "";
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), dy = Math.floor(diff / 86400000);
  if (m < 1) return "just now";
  if (h < 1) return `${m}m ago`;
  if (dy < 1) return `${h}h ago`;
  if (dy < 30) return `${dy}d ago`;
  return fmtDate(d);
};

const shortId = (id = "") => "TASK-" + id.slice(-5).toUpperCase();

/* ─── skeleton ──────────────────────────────────────────── */
const Skeleton = () => (
  <div className="flex w-full h-screen bg-[#f4f5f7]">
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="animate-pulse space-y-4 max-w-6xl mx-auto">
          <div className="h-3 w-48 bg-gray-200 rounded" />
          <div className="h-7 w-2/3 bg-gray-200 rounded" />
          <div className="flex gap-5 mt-4">
            <div className="flex-1 space-y-3">
              <div className="bg-white rounded-lg h-40 border border-gray-200" />
              <div className="bg-white rounded-lg h-28 border border-gray-200" />
            </div>
            <div className="w-64 space-y-3">
              <div className="bg-white rounded-lg h-64 border border-gray-200" />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════ */
const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [todo, setTodo]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [deleting, setDeleting]     = useState(false);
  const [saving, setSaving]         = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [comment, setComment]       = useState("");
  const [comments, setComments]     = useState([]);
  const statusRef = useRef(null);

  useEffect(() => { fetchTodo(); }, [id]);

  /* close status dropdown on outside click */
  useEffect(() => {
    const handler = (e) => { if (statusRef.current && !statusRef.current.contains(e.target)) setStatusOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

  const changeStatus = async (newStatus) => {
    if (!todo || newStatus === todo.status || saving) return;
    setStatusOpen(false);
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title",       todo.title);
      fd.append("description", todo.description || "");
      fd.append("priority",    todo.priority);
      fd.append("status",      newStatus);
      if (todo.date) fd.append("date", todo.date);
      await updateTodo(id, fd);
      setTodo((p) => ({ ...p, status: newStatus }));
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments((prev) => [
      ...prev,
      { text: comment.trim(), author: user?.name || "You", avatar: user?.avatar, at: new Date().toISOString() },
    ]);
    setComment("");
  };

  if (loading) return <Skeleton />;

  if (!todo) return (
    <div className="flex w-full h-screen bg-[#f4f5f7]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-3">
          <p className="text-gray-500">Task not found.</p>
          <button onClick={() => navigate("/")} className="text-blue-600 hover:underline text-sm">Back to Dashboard</button>
        </main>
      </div>
    </div>
  );

  const pm  = PRIORITY_META[todo.priority] || PRIORITY_META.Moderate;
  const sm  = STATUS_META[todo.status]     || STATUS_META["Not Started"];
  const tid = shortId(todo._id);

  return (
    <div className="flex w-full h-screen bg-[#f4f5f7]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">

          {/* ── Top bar ─────────────────────────────────── */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
              <button onClick={() => navigate("/")} className="flex items-center gap-1 hover:text-blue-600 transition">
                <FaHome className="text-[10px]" /> Dashboard
              </button>
              <span>/</span>
              <button onClick={() => navigate("/tasks")} className="flex items-center gap-1 hover:text-blue-600 transition">
                <FaTasks className="text-[10px]" /> My Tasks
              </button>
              <span>/</span>
              <span className="text-gray-600 font-semibold">{tid}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {saving && <span className="text-xs text-gray-400 animate-pulse mr-1">Saving…</span>}
              <button
                onClick={() => navigate(`/edit/${id}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
              >
                <FaEdit className="text-[10px]" /> Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition disabled:opacity-50"
              >
                <FaTrash className="text-[10px]" /> {deleting ? "Deleting…" : "Delete"}
              </button>
              <button className="w-7 h-7 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-400 transition">
                <FaEllipsisH className="text-xs" />
              </button>
            </div>
          </div>

          {/* ── Main 2-col layout ──────────────────────── */}
          <div className="flex gap-0 min-h-full">

            {/* LEFT — main content */}
            <div className="flex-1 min-w-0 p-7 space-y-6">

              {/* Task ID + Title */}
              <div>
                <p className="text-xs font-bold text-gray-400 tracking-widest mb-2">{tid}</p>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{todo.title}</h1>
              </div>

              {/* Status workflow chips */}
              <div className="flex items-center gap-2 flex-wrap">
                {STATUS_FLOW.map((s, i) => {
                  const m = STATUS_META[s];
                  const isCurrent = todo.status === s;
                  const isPast    = STATUS_FLOW.indexOf(todo.status) > i;
                  return (
                    <div key={s} className="flex items-center gap-2">
                      <button
                        onClick={() => changeStatus(s)}
                        disabled={saving}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all
                          ${isCurrent
                            ? "text-white shadow-sm scale-105"
                            : "hover:opacity-80 hover:scale-105"}`}
                        style={isCurrent
                          ? { backgroundColor: m.color, borderColor: m.color }
                          : { color: isPast ? m.color : "#9ca3af", backgroundColor: isPast ? m.bg : "#f9fafb", borderColor: isPast ? m.border : "#e5e7eb" }}
                      >
                        <m.Icon className="text-[9px]" />
                        {m.label}
                      </button>
                      {i < STATUS_FLOW.length - 1 && (
                        <div className={`h-px w-5 ${STATUS_FLOW.indexOf(todo.status) > i ? "bg-gray-400" : "bg-gray-200"}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                  <FaTag className="text-gray-400 text-xs" />
                  <span className="text-xs font-bold text-gray-600 tracking-wide uppercase">Description</span>
                </div>
                <div className="px-5 py-4">
                  {todo.description ? (
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{todo.description}</p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No description provided.</p>
                  )}
                </div>
              </div>

              {/* Attachment */}
              {todo.image && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                    <FaPaperclip className="text-gray-400 text-xs" />
                    <span className="text-xs font-bold text-gray-600 tracking-wide uppercase">Attachment</span>
                    <span className="ml-auto text-[11px] text-gray-400 font-medium">1 file</span>
                  </div>
                  <div className="p-4">
                    <div className="rounded-lg overflow-hidden border border-gray-100 inline-block max-w-full">
                      <img src={todo.image} alt={todo.title} className="max-h-64 object-cover" />
                    </div>
                  </div>
                </div>
              )}

              {/* Activity / Comments */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                  <FaCommentAlt className="text-gray-400 text-xs" />
                  <span className="text-xs font-bold text-gray-600 tracking-wide uppercase">Activity</span>
                  {comments.length > 0 && (
                    <span className="ml-auto text-[11px] text-gray-400 font-medium">{comments.length} comment{comments.length > 1 ? "s" : ""}</span>
                  )}
                </div>

                {/* Comment list */}
                {comments.length > 0 && (
                  <div className="divide-y divide-gray-50">
                    {comments.map((c, i) => (
                      <div key={i} className="flex gap-3 px-5 py-4">
                        <img
                          src={c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.author)}&background=ef4444&color=fff&size=32`}
                          alt={c.author}
                          className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-gray-800">{c.author}</span>
                            <span className="text-[11px] text-gray-400">{timeAgo(c.at)}</span>
                          </div>
                          <p className="text-sm text-gray-700">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment input */}
                <div className="flex gap-3 px-5 py-4 border-t border-gray-100">
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=ef4444&color=fff&size=32`}
                    alt="me"
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
                  />
                  <form onSubmit={submitComment} className="flex-1 flex gap-2">
                    <input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment…"
                      className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                    />
                    <button
                      type="submit"
                      disabled={!comment.trim()}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Save
                    </button>
                  </form>
                </div>
              </div>

            </div>

            {/* RIGHT — sidebar */}
            <div className="w-72 flex-shrink-0 border-l border-gray-200 bg-white p-5 space-y-6">

              {/* Status dropdown */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Status</p>
                <div ref={statusRef} className="relative">
                  <button
                    onClick={() => setStatusOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-bold transition hover:opacity-90"
                    style={{ color: sm.color, backgroundColor: sm.bg, borderColor: sm.border }}
                  >
                    <span className="flex items-center gap-1.5">
                      <sm.Icon className="text-[10px]" />
                      {sm.label}
                    </span>
                    <FaChevronDown className={`text-[9px] transition-transform ${statusOpen ? "rotate-180" : ""}`} />
                  </button>
                  {statusOpen && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                      {STATUS_FLOW.map((s) => {
                        const m = STATUS_META[s];
                        return (
                          <button
                            key={s}
                            onClick={() => changeStatus(s)}
                            className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-left hover:bg-gray-50 transition
                              ${todo.status === s ? "bg-gray-50" : ""}`}
                            style={{ color: m.color }}
                          >
                            <m.Icon className="text-[10px]" />
                            {m.label}
                            {todo.status === s && <span className="ml-auto text-gray-300">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Priority */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Priority</p>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border"
                  style={{ color: pm.color, backgroundColor: pm.bg, borderColor: pm.border }}
                >
                  <FaFlag className="text-[9px]" />
                  {pm.label}
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Assignee */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Assignee</p>
                <div className="flex items-center gap-2">
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=ef4444&color=fff&size=28`}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{user?.name || "You"}</p>
                    <p className="text-[11px] text-gray-400">Assignee</p>
                  </div>
                </div>
              </div>

              {/* Reporter */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Reporter</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                    <FaUser className="text-gray-400 text-[10px]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{user?.name || "You"}</p>
                    <p className="text-[11px] text-gray-400">Reporter</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Dates */}
              <div className="space-y-4">
                {todo.date && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Due Date</p>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                      <FaCalendarAlt className="text-gray-400 text-[10px]" />
                      {fmtDate(todo.date)}
                    </div>
                  </div>
                )}
                {todo.createdAt && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Created</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <FaClock className="text-gray-300 text-[10px]" />
                      {fmtDate(todo.createdAt)}
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-400">{timeAgo(todo.createdAt)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100" />

              {/* Labels */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Label</p>
                <span className="inline-block text-xs font-semibold text-purple-600 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-md">
                  {todo.priority === "Extreme" ? "Urgent" : todo.priority === "Moderate" ? "Feature" : "Enhancement"}
                </span>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskDetails;
