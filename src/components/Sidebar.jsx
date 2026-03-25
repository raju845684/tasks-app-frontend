import {
  FaThLarge,
  FaExclamationCircle,
  FaTasks,
  FaListUl,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const navItems = [
  { icon: <FaThLarge />, label: "Dashboard", active: true },
  { icon: <FaExclamationCircle />, label: "Vital Task" },
  { icon: <FaTasks />, label: "My Task" },
  { icon: <FaListUl />, label: "Task Categories" },
  { icon: <FaCog />, label: "Settings" },
  { icon: <FaQuestionCircle />, label: "Help" },
];

const Sidebar = () => {
  return (
    <div className="w-56 min-h-screen bg-red-500 text-white flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-white opacity-80">Dash</span>
          <span className="text-white">board</span>
        </h1>
      </div>

      {/* User Profile */}
      <div className="flex flex-col items-center py-6 px-4 border-b border-red-400">
        <div className="w-16 h-16 rounded-full bg-white overflow-hidden mb-3 border-2 border-white shadow">
          <img
            src="https://ui-avatars.com/api/?name=Sundar+Gurung&background=f87171&color=fff&size=64"
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="font-semibold text-sm">Sundar Gurung</p>
        <p className="text-xs text-red-200 mt-0.5">sundargurung360@gmail.com</p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              item.active
                ? "bg-white text-red-500 shadow"
                : "text-white hover:bg-red-400"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-red-400 transition-all">
          <FaSignOutAlt className="text-base" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
