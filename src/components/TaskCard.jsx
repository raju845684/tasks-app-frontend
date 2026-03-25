import { useNavigate } from "react-router-dom";

const priorityColors = {
  high: "text-red-500",
  moderate: "text-orange-400",
  low: "text-green-500",
};

const statusColors = {
  "Not Started": "text-red-500",
  "In Progress": "text-blue-500",
  Completed: "text-green-500",
};

const statusDot = {
  "Not Started": "bg-red-400",
  "In Progress": "bg-blue-400",
  Completed: "bg-green-400",
};

const TaskCard = ({ todo }) => {
  const navigate = useNavigate();
  const priority = todo.priority || "moderate";
  const status = todo.status || "Not Started";
  const createdAt = todo.createdAt
    ? new Date(todo.createdAt).toLocaleDateString("en-GB").replace(/\//g, "/")
    : "";

  return (
    <div
      onClick={() => navigate(`/task/${todo._id}`)}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-3 hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Status dot */}
      <div className="pt-1 flex-shrink-0">
        <div
          className={`w-4 h-4 rounded-full border-2 ${
            status === "Completed"
              ? "border-green-400 bg-green-400"
              : status === "In Progress"
              ? "border-blue-400"
              : "border-red-400"
          } flex items-center justify-center`}
        >
          {status === "Completed" && (
            <div className="w-2 h-2 rounded-full bg-white" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug">
          {todo.title}
        </h3>
        <p className="text-gray-400 text-xs mt-1 leading-relaxed line-clamp-2">
          {todo.description}
        </p>
        <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
          <span>
            Priority:{" "}
            <span className={`font-medium ${priorityColors[priority.toLowerCase()] || "text-orange-400"}`}>
              {priority}
            </span>
          </span>
          <span>
            Status:{" "}
            <span className={`font-medium ${statusColors[status] || "text-gray-500"}`}>
              {status}
            </span>
          </span>
          {createdAt && (
            <span className="text-gray-400">Created on: {createdAt}</span>
          )}
        </div>
      </div>

      {/* Image */}
      {todo.image && (
        <img
          src={todo.image}
          alt={todo.title}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        />
      )}
    </div>
  );
};

export default TaskCard;

