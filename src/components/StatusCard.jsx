const colorMap = {
  green: { stroke: "#22c55e", dot: "bg-green-500", text: "text-green-600" },
  blue: { stroke: "#3b82f6", dot: "bg-blue-500", text: "text-blue-600" },
  red: { stroke: "#ef4444", dot: "bg-red-400", text: "text-gray-600" },
};

const StatusCard = ({ label, value, color }) => {
  const theme = colorMap[color] || colorMap.green;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(Number(value) || 0, 0), 100);
  const dashArray = `${(pct / 100) * circumference} ${circumference}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          {/* Track */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="7"
          />
          {/* Progress */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={theme.stroke}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={dashArray}
            className="donut-ring"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-800">{pct}%</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`w-2.5 h-2.5 rounded-full ${theme.dot}`} />
        <span className="text-xs text-gray-500 font-medium">{label}</span>
      </div>
    </div>
  );
};

export default StatusCard;
