import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getTodoById, updateTodo } from "../services/todoApi";
import {
  FaHome, FaTasks, FaCloudUploadAlt, FaCalendarAlt,
  FaCheck, FaTimes, FaFlag, FaChevronDown,
  FaExclamationTriangle, FaHourglassHalf, FaCheckCircle,
  FaTag, FaPaperclip,
} from "react-icons/fa";

/* ─── meta maps (mirrors TaskDetails) ──────────────────── */
const PRIORITY_META = {
  Extreme:  { label: "Highest", color: "#ef4444", bg: "#fef2f2", border: "#fca5a5" },
  Moderate: { label: "Medium",  color: "#f97316", bg: "#fff7ed", border: "#fdba74" },
  Low:      { label: "Low",     color: "#22c55e", bg: "#f0fdf4", border: "#86efac" },
};

const STATUS_META = {
  "Not Started": { label: "TO DO",       color: "#6b7280", bg: "#f3f4f6", border: "#d1d5db", Icon: FaExclamationTriangle },
  "In Progress":  { label: "IN PROGRESS", color: "#2563eb", bg: "#eff6ff", border: "#93c5fd", Icon: FaHourglassHalf },
  Completed:      { label: "DONE",        color: "#16a34a", bg: "#f0fdf4", border: "#86efac", Icon: FaCheckCircle },
};

const STATUS_FLOW   = ["Not Started", "In Progress", "Completed"];
const shortId = (id = "") => "TASK-" + id.slice(-5).toUpperCase();

/* ─── skeleton ──────────────────────────────────────────── */
const Skeleton = () => (
  <div className="flex w-full h-screen bg-[#f4f5f7]">
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Header />
      {/* top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="animate-pulse flex items-center gap-2">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-3 bg-gray-100 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-3 bg-gray-100 rounded" />
          <div className="h-3 w-24 bg-gray-300 rounded" />
        </div>
        <div className="animate-pulse flex gap-2">
          <div className="h-7 w-20 bg-gray-100 rounded-md" />
          <div className="h-7 w-14 bg-gray-100 rounded-md" />
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* left */}
        <div className="flex-1 overflow-y-auto p-7 space-y-5">
          <div className="animate-pulse space-y-2">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-8 bg-gray-100 rounded-lg" />
          </div>
          <div className="animate-pulse bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="h-10 bg-gray-50 border-b border-gray-100" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-5/6" />
              <div className="h-3 bg-gray-100 rounded w-3/6" />
              <div className="h-20" />
            </div>
          </div>
          <div className="animate-pulse bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="h-10 bg-gray-50 border-b border-gray-100" />
            <div className="p-4">
              <div className="h-40 bg-gray-100 rounded-lg" />
            </div>
          </div>
        </div>
        {/* right */}
        <div className="w-72 flex-shrink-0 border-l border-gray-200 bg-white p-5 space-y-5">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-2.5 w-14 bg-gray-200 rounded" />
              <div className="h-9 bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════ */
const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", date: "", priority: "", status: "", description: "" });
  const [imageFile, setImageFile]     = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [dragActive, setDragActive]   = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [loading, setLoading]         = useState(true);
  const [statusOpen, setStatusOpen]   = useState(false);

  useEffect(() => { fetchTodo(); }, [id]);

  const fetchTodo = async () => {
    try {
      const res = await getTodoById(id);
      const t = res.data;
      setForm({
        title: t.title || "",
        date: t.date ? t.date.substring(0, 10) : "",
        priority: t.priority || "",
        status: t.status || "Not Started",
        description: t.description || "",
      });
      if (t.image) setExistingImage(t.image);
    } catch { /* navigate back silently */ }
    finally { setLoading(false); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (file) => {
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.priority || !form.description) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title",       form.title);
      fd.append("date",        form.date);
      fd.append("priority",    form.priority);
      fd.append("status",      form.status);
      fd.append("description", form.description);
      if (imageFile) fd.append("image", imageFile);
      await updateTodo(id, fd);
      navigate(`/task/${id}`);
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  if (loading) return <Skeleton />;

  const sm  = STATUS_META[form.status]     || STATUS_META["Not Started"];
  const pm  = PRIORITY_META[form.priority] || null;
  const tid = shortId(id);
  const currentPreview = imagePreview || existingImage || null;

  return (
    <div className="flex w-full h-screen bg-[#f4f5f7]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        {/* ── Sticky top bar ────────────────────────────── */}
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
            <button onClick={() => navigate(`/task/${id}`)} className="hover:text-blue-600 transition">{tid}</button>
            <span>/</span>
            <span className="text-gray-600 font-semibold">Edit</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(`/task/${id}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200 transition"
            >
              <FaTimes className="text-[10px]" /> Cancel
            </button>
            <button
              form="edit-form"
              type="submit"
              disabled={submitting || !form.title || !form.date || !form.priority || !form.description}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 border border-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <FaCheck className="text-[10px]" />
              )}
              {submitting ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>

        {/* ── Two-column body ───────────────────────────── */}
        <form id="edit-form" onSubmit={handleSubmit} className="flex flex-1 overflow-hidden">

          {/* LEFT — main content */}
          <div className="flex-1 min-w-0 overflow-y-auto p-7 space-y-5">

            {/* Task ID + Title input */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-2">{tid}</p>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Task title…"
                required
                className="w-full text-2xl font-bold text-gray-900 bg-transparent border-0 border-b-2 border-transparent focus:border-blue-400 focus:outline-none transition pb-1 placeholder-gray-300"
              />
            </div>

            {/* Description card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                <FaTag className="text-gray-400 text-xs" />
                <span className="text-xs font-bold text-gray-600 tracking-wide uppercase">Description</span>
              </div>
              <div className="px-5 py-4">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  required
                  placeholder="Add a description…"
                  className="w-full text-sm text-gray-700 bg-transparent border-0 outline-none resize-none placeholder-gray-400 leading-relaxed"
                />
              </div>
            </div>

            {/* Attachment card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                <FaPaperclip className="text-gray-400 text-xs" />
                <span className="text-xs font-bold text-gray-600 tracking-wide uppercase">Attachment</span>
                {currentPreview && <span className="ml-auto text-[11px] text-gray-400 font-medium">1 file</span>}
              </div>
              <div className="p-4">
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleImage(e.dataTransfer.files[0]); }}
                  onClick={() => document.getElementById("edit-file-upload").click()}
                  className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-all min-h-[140px]
                    ${dragActive ? "border-blue-400 bg-blue-50" : currentPreview ? "border-green-300 bg-green-50/40" : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30"}`}
                >
                  <input id="edit-file-upload" type="file" accept="image/*" className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />

                  {currentPreview ? (
                    <div className="relative w-full flex items-center justify-center p-3">
                      <img src={currentPreview} alt="preview" className="max-h-40 rounded-lg object-contain shadow-sm" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); setExistingImage(""); }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition shadow"
                      >
                        <FaTimes className="text-[10px]" />
                      </button>
                      <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow">
                        <FaCheck className="text-white text-[10px]" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 py-6">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-1">
                        <FaCloudUploadAlt className="text-lg text-gray-400" />
                      </div>
                      <p className="text-xs font-semibold text-gray-500">Drag & drop or click to upload</p>
                      <p className="text-[11px] text-gray-400">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT — sidebar */}
          <div className="w-72 flex-shrink-0 border-l border-gray-200 bg-white p-5 space-y-6 overflow-y-auto">

            {/* Status */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Status</p>
              <div className="relative">
                <button
                  type="button"
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
                          key={s} type="button"
                          onClick={() => { setForm((f) => ({ ...f, status: s })); setStatusOpen(false); }}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-left hover:bg-gray-50 transition ${form.status === s ? "bg-gray-50" : ""}`}
                          style={{ color: m.color }}
                        >
                          <m.Icon className="text-[10px]" />
                          {m.label}
                          {form.status === s && <span className="ml-auto text-gray-300">✓</span>}
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
              <div className="flex flex-col gap-2">
                {Object.entries(PRIORITY_META).map(([key, p]) => {
                  const isActive = form.priority === key;
                  return (
                    <button
                      key={key} type="button"
                      onClick={() => setForm((f) => ({ ...f, priority: key }))}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all"
                      style={isActive
                        ? { color: p.color, backgroundColor: p.bg, borderColor: p.border }
                        : { color: "#6b7280", backgroundColor: "#f9fafb", borderColor: "#e5e7eb" }}
                    >
                      <FaFlag className="text-[9px]" style={{ color: isActive ? p.color : "#d1d5db" }} />
                      {p.label}
                      {isActive && <FaCheck className="ml-auto text-[9px]" style={{ color: p.color }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Due date */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Due Date</p>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full text-xs font-semibold text-gray-700 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition appearance-none"
                />
                <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none" />
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Label (derived, read-only display) */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Label</p>
              {pm ? (
                <span
                  className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md border"
                  style={{ color: "#7c3aed", backgroundColor: "#f5f3ff", borderColor: "#ddd6fe" }}
                >
                  {form.priority === "Extreme" ? "Urgent" : form.priority === "Moderate" ? "Feature" : "Enhancement"}
                </span>
              ) : (
                <span className="text-xs text-gray-400 italic">Select a priority first</span>
              )}
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
