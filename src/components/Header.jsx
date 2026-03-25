import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaBell, FaCalendarAlt } from "react-icons/fa";
import NotificationsPanel from "./NotificationsPanel";
import CalendarPanel from "./CalendarPanel";

const Header = () => {
  const [query, setQuery] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const navigate = useNavigate();

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = today.toLocaleDateString("en-GB");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/tasks?search=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 shadow-sm z-10 relative">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-96 gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your task here..."
            className="flex-1 bg-transparent text-sm text-gray-600 outline-none placeholder-gray-400"
          />
          <button type="submit" className="w-7 h-7 bg-red-500 rounded-md flex items-center justify-center flex-shrink-0 hover:bg-red-600 transition">
            <FaSearch className="text-white text-xs" />
          </button>
        </form>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Bell */}
          <button
            onClick={() => { setShowNotif(true); setShowCalendar(false); }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition ${showNotif ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
          >
            <FaBell className="text-sm" />
          </button>

          {/* Calendar */}
          <button
            onClick={() => { setShowCalendar(true); setShowNotif(false); }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition ${showCalendar ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
          >
            <FaCalendarAlt className="text-sm" />
          </button>

          <div className="text-right ml-1">
            <p className="text-xs font-semibold text-gray-700">{dayName}</p>
            <p className="text-xs text-red-500 font-medium">{dateStr}</p>
          </div>
        </div>
      </div>

      {showNotif && <NotificationsPanel onClose={() => setShowNotif(false)} />}
      {showCalendar && <CalendarPanel onClose={() => setShowCalendar(false)} />}
    </>
  );
};

export default Header;
