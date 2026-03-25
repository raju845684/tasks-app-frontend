import { useState } from "react";
import { createTodo } from "../services/todoApi";
import {
  FaCloudUploadAlt,
  FaCalendarAlt,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

const priorities = [
  { label: "Extreme", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  { label: "Moderate", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  { label: "Low", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
];

const CreateTaskModal = ({ isOpen, onClose, onCreated }) => {
  const [form, setForm] = useState({
    title: "",
    date: "",
    priority: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setForm({ title: "", date: "", priority: "", description: "" });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePriority = (label) =>
    setForm({ ...form, priority: label });

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
    if (!form.title || !form.date || !form.priority || !form.description) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("date", form.date);
      fd.append("priority", form.priority);
      fd.append("description", form.description);
      if (imageFile) fd.append("image", imageFile);
      await createTodo(fd);
      resetForm();
      onCreated?.();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-2xl mx-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100/60 animate-modalIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              Add New Task
            </h2>
            <div className="h-1 w-14 rounded-full bg-gradient-to-r from-red-500 to-orange-400 mt-1.5" />
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-7">
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

          {/* Description + Image side by side */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-6">
            {/* Description */}
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

            {/* Image Upload */}
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
                    : imagePreview
                    ? "border-green-300 bg-green-50/30"
                    : "border-gray-200 bg-gray-50/50 hover:border-red-300 hover:bg-red-50/30"
                }`}
                onClick={() =>
                  document.getElementById("modal-file-upload").click()
                }
              >
                <input
                  id="modal-file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && handleImage(e.target.files[0])
                  }
                />
                {imagePreview ? (
                  <div className="relative w-full h-full flex items-center justify-center p-3">
                    <img
                      src={imagePreview}
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
              background: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
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
                Creating...
              </span>
            ) : (
              "Done"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
