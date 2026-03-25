import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTodos } from "../services/todoApi";
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const CalendarPanel = ({ onClose }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    getTodos()
      .then((res) => setTodos(res.data || []))
      .catch(() => setTodos([]))
      .finally(() => setLoading(false));
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  // Monday = 0 offset
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const taskDates = new Set(
    todos
      .filter((t) => t.date)
      .map((t) => {
        const d = new Date(t.date);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      })
  );

  const isToday = (day) => {
    const now = new Date();
    return now.getDate() === day && now.getMonth() === month && now.getFullYear() === year;
  };

  const isSelected = (day) =>
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === month &&
    selectedDate.getFullYear() === year;

  const hasTask = (day) => taskDates.has(`${year}-${month}-${day}`);

  const handleDayClick = (day) => {
    setSelectedDate(new Date(year, month, day));
  };

  const selectedKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
  const tasksForDay = todos.filter((t) => {
    if (!t.date) return false;
    const d = new Date(t.date);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` === selectedKey;
  });

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const selectedLabel = selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  // Build grid cells
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col rounded-l-3xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Calendar</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition">
            <FaArrowLeft />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Selected date pill */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 mb-4">
            <span className="text-sm font-medium text-gray-700">{selectedLabel}</span>
            <button onClick={() => setSelectedDate(new Date())} className="text-gray-400 text-xs hover:text-gray-600">✕</button>
          </div>

          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
              <FaChevronLeft className="text-xs text-gray-600" />
            </button>
            <span className="text-sm font-bold text-gray-800">{monthName}</span>
            <button onClick={nextMonth} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
              <FaChevronRight className="text-xs text-gray-600" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((day, i) =>
              day === null ? (
                <div key={`empty-${i}`} />
              ) : (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`relative mx-auto w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all
                    ${isSelected(day) ? "bg-red-500 text-white shadow-md" : isToday(day) ? "bg-red-100 text-red-600 font-bold" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  {day}
                  {hasTask(day) && (
                    <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isSelected(day) ? "bg-white" : "bg-red-400"}`} />
                  )}
                </button>
              )
            )}
          </div>

          {/* Tasks for selected day */}
          <div className="mt-5">
            <p className="text-xs font-semibold text-gray-400 mb-2">
              {tasksForDay.length > 0
                ? `${tasksForDay.length} task${tasksForDay.length > 1 ? "s" : ""} on this day`
                : "No tasks on this day"}
            </p>
            <div className="space-y-2">
              {loading
                ? Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-2 p-2 rounded-xl bg-gray-50">
                      <div className="w-8 h-8 rounded-lg bg-gray-200 flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                        <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                  ))
                : tasksForDay.map((todo) => (
                    <div
                      key={todo._id}
                      onClick={() => { navigate(`/task/${todo._id}`); onClose(); }}
                      className="flex gap-2 p-2.5 rounded-xl bg-gray-50 hover:bg-red-50 cursor-pointer transition"
                    >
                      {todo.image ? (
                        <img src={todo.image} alt={todo.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex-shrink-0 flex items-center justify-center">
                          <span className="text-red-400 text-xs font-bold">{todo.title[0]}</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{todo.title}</p>
                        <p className={`text-[11px] font-medium ${
                          todo.priority === "Extreme" ? "text-red-500"
                          : todo.priority === "Moderate" ? "text-orange-500"
                          : "text-green-500"
                        }`}>{todo.priority}</p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarPanel;
