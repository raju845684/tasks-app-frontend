import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getTodoById, updateTodo } from "../services/todoApi";
import {
  FaArrowLeft,
  FaCloudUploadAlt,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const priorities = [
  { label: "Extreme", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  { label: "Moderate", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  { label: "Low", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
];

const statuses = ["Not Started", "In Progress", "Completed"];

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    date: "",
    priority: "",
    status: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodo();
  }, [id]);

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
    } catch {
      // if todo not found, navigate back
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePriority = (label) => setForm({ ...form, priority: label });

  const handleImage = (file) => {
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleImage(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.priority || !form.description)
      return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("date", form.date);
      fd.append("priority", form.priority);
      fd.append("status", form.status);
      fd.append("description", form.description);
      if (imageFile) fd.append("image", imageFile);
      await updateTodo(id, fd);
      navigate(`/task/${id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {/* Back button skeleton */}
            <div className="animate-pulse h-4 w-28 bg-gray-200 rounded mb-6" />

            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              {/* Form header skeleton */}
              <div className="animate-pulse flex items-center justify-between mb-6">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-24" />
                  <div className="h-1 bg-gray-100 rounded w-14" />
                </div>
                <div className="w-9 h-9 rounded-full bg-gray-100" />
              </div>

              <div className="animate-pulse space-y-5">
                {/* Title field */}
                <div>
                  <div className="h-3.5 bg-gray-200 rounded w-12 mb-2" />
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
                {/* Date field */}
                <div>
                  <div className="h-3.5 bg-gray-200 rounded w-10 mb-2" />
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
                {/* Priority */}
                <div>
                  <div className="h-3.5 bg-gray-200 rounded w-16 mb-2" />
                  <div className="flex gap-3">
                    <div className="h-9 w-24 bg-gray-100 rounded-full" />
                    <div className="h-9 w-24 bg-gray-100 rounded-full" />
                    <div className="h-9 w-20 bg-gray-100 rounded-full" />
                  </div>
                </div>
                {/* Status */}
                <div>
                  <div className="h-3.5 bg-gray-200 rounded w-14 mb-2" />
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
                {/* Description + Image */}
                <div className="grid grid-cols-5 gap-5">
                  <div className="col-span-3 space-y-2">
                    <div className="h-3.5 bg-gray-200 rounded w-28 mb-2" />
                    <div className="h-36 bg-gray-100 rounded-xl" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <div className="h-3.5 bg-gray-200 rounded w-24 mb-2" />
                    <div className="h-36 bg-gray-100 rounded-xl" />
                  </div>
                </div>
                {/* Submit button */}
                <div className="h-10 bg-gray-200 rounded-xl w-32" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const currentPreview = imagePreview || existingImage || null;

  return (
    <div className="flex w-full h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Back button */}
          <button
            onClick={() => navigate(`/task/${id}`)}
            className="flex items-center gap-2 text-gray-500 hover:text-red-500 text-sm font-medium mb-6 transition"
          >
            <FaArrowLeft className="text-xs" />
            Back to Task
          </button>

          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                  Edit Task
                </h2>
                <div className="h-1 w-14 rounded-full bg-gradient-to-r from-red-500 to-orange-400 mt-1.5" />
              </div>
              <button
                onClick={() => navigate(`/task/${id}`)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter task title..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
                />
              </div>

              {/* Date */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-800 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition appearance-none"
                  />
                  <FaCalendarAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                </div>
              </div>

              {/* Priority */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority
                </label>
                <div className="flex gap-3 flex-wrap">
                  {priorities.map((p) => {
                    const isActive = form.priority === p.label;
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => handlePriority(p.label)}
                        className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2"
                        style={{
                          borderColor: isActive ? p.color : "#e5e7eb",
                          backgroundColor: isActive ? p.bg : "transparent",
                          color: isActive ? p.color : "#6b7280",
                        }}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: p.color }}
                        />
                        {p.label}
                        {isActive && (
                          <FaCheck
                            className="text-xs ml-1"
                            style={{ color: p.color }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-800 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description + Image */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Task Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe your task in detail..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition resize-none h-full min-h-[150px]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Upload Image
                  </label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all h-full min-h-[150px] cursor-pointer ${
                      dragActive
                        ? "border-red-400 bg-red-50/50"
                        : currentPreview
                        ? "border-green-300 bg-green-50/30"
                        : "border-gray-200 bg-gray-50/50 hover:border-red-300 hover:bg-red-50/30"
                    }`}
                    onClick={() =>
                      document.getElementById("edit-file-upload").click()
                    }
                  >
                    <input
                      id="edit-file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && handleImage(e.target.files[0])
                      }
                    />
                    {currentPreview ? (
                      <div className="relative w-full h-full flex items-center justify-center p-3">
                        <img
                          src={currentPreview}
                          alt="preview"
                          className="max-h-28 rounded-lg object-contain"
                        />
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <FaCheck className="text-white text-[10px]" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-2">
                          <FaCloudUploadAlt className="text-xl text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                          Drag & Drop files here
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">or</p>
                        <span className="mt-1.5 px-3 py-1 rounded-lg border border-gray-300 text-xs font-medium text-gray-600 hover:bg-gray-100 transition">
                          Browse
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
                }}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Task"
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditTask;
