import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getTodoById, deleteTodo } from "../services/todoApi";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaFlag,
  FaInfoCircle,
} from "react-icons/fa";

const priorityStyle = {
  Extreme: { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  Moderate: { color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  Low: { color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
};

const statusStyle = {
  "Not Started": { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  "In Progress": { color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  Completed: { color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
};

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchTodo();
  }, [id]);

  const fetchTodo = async () => {
    try {
      const res = await getTodoById(id);
      setTodo(res.data);
    } catch {
      setTodo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setDeleting(true);
    try {
      await deleteTodo(id);
      navigate("/");
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full" />
          </main>
        </div>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="flex w-full h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 flex flex-col items-center justify-center gap-4">
            <p className="text-gray-500 text-lg">Task not found.</p>
            <button
              onClick={() => navigate("/")}
              className="text-red-500 hover:underline text-sm font-medium"
            >
              Back to Dashboard
            </button>
          </main>
        </div>
      </div>
    );
  }

  const ps = priorityStyle[todo.priority] || priorityStyle.Moderate;
  const ss = statusStyle[todo.status] || statusStyle["Not Started"];
  const formattedDate = todo.date
    ? new Date(todo.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="flex w-full h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-500 hover:text-red-500 text-sm font-medium mb-6 transition"
          >
            <FaArrowLeft className="text-xs" />
            Back to Dashboard
          </button>

          <div className="max-w-3xl mx-auto">
            {/* Header card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">
                  {todo.title}
                </h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/edit/${id}`)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                  >
                    <FaEdit className="text-xs" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-red-50 text-red-500 hover:bg-red-100 transition disabled:opacity-50"
                  >
                    <FaTrash className="text-xs" />
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mb-5">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ color: ps.color, backgroundColor: ps.bg }}
                >
                  <FaFlag className="text-[10px]" />
                  {todo.priority}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ color: ss.color, backgroundColor: ss.bg }}
                >
                  <FaInfoCircle className="text-[10px]" />
                  {todo.status}
                </span>
                {formattedDate && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-gray-500 bg-gray-100">
                    <FaCalendarAlt className="text-[10px]" />
                    {formattedDate}
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Description
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {todo.description}
                </p>
              </div>
            </div>

            {/* Image */}
            {todo.image && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Attachment
                </h3>
                <img
                  src={`http://127.0.0.1:5000/${todo.image}`}
                  alt={todo.title}
                  className="rounded-xl max-h-80 object-contain"
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskDetails;
