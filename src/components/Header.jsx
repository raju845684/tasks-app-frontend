import { FaSearch, FaBell, FaCalendarAlt } from "react-icons/fa";

const Header = () => {
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = today.toLocaleDateString("en-GB").replace(/\//g, "/");

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 shadow-sm">
      {/* Search */}
      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-96 gap-2">
        <input
          type="text"
          placeholder="Search your task here..."
          className="flex-1 bg-transparent text-sm text-gray-600 outline-none placeholder-gray-400"
        />
        <button className="w-7 h-7 bg-red-500 rounded-md flex items-center justify-center flex-shrink-0">
          <FaSearch className="text-white text-xs" />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
          <FaBell className="text-gray-500 text-sm" />
        </button>
        <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
          <FaCalendarAlt className="text-gray-500 text-sm" />
        </button>
        <div className="text-right ml-1">
          <p className="text-xs font-semibold text-gray-700">{dayName}</p>
          <p className="text-xs text-red-500 font-medium">{dateStr}</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
