import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaTimes, FaCopy, FaCheck, FaChevronDown } from "react-icons/fa";

const MOCK_MEMBERS = [
  { name: "Upashna Gurung", email: "uppaeygrg332@gmail.com", role: "Can edit", avatar: "https://ui-avatars.com/api/?name=Upashna+Gurung&background=f9a8d4&color=fff&size=40" },
  { name: "Jeremy Lee",     email: "jerrylee1996@gmail.com", role: "Can edit", avatar: "https://ui-avatars.com/api/?name=Jeremy+Lee&background=93c5fd&color=fff&size=40" },
  { name: "Rachel Takahasi",email: "takahasirae32@gmail.com",role: "Can edit", avatar: "https://ui-avatars.com/api/?name=Rachel+T&background=6ee7b7&color=fff&size=40" },
];

const InviteModal = ({ onClose }) => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const projectLink = window.location.origin;

  const members = [
    {
      name: user?.name || "You",
      email: user?.email || "",
      role: "Owner",
      avatar: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=f87171&color=fff&size=40`,
      isOwner: true,
    },
    ...MOCK_MEMBERS,
  ];

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!email.trim()) return setError("Please enter an email address");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email");
    setError("");
    setSending(true);
    // Simulate sending
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setEmail("");
      setTimeout(() => setSent(false), 3000);
    }, 1000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(projectLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-7 pt-7 pb-2">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Send an invite to a new member</h2>
              <div className="h-0.5 w-20 bg-gradient-to-r from-red-500 to-orange-400 rounded-full mt-2" />
            </div>
            <button
              onClick={onClose}
              className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition flex items-center gap-1 mt-1"
            >
              <FaTimes className="text-xs" /> Go Back
            </button>
          </div>

          <div className="px-7 pb-7 pt-4">
            {/* Email invite */}
            <div className="border border-gray-200 rounded-2xl p-5 mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Email</label>
              <form onSubmit={handleSendInvite} className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="example@gmail.com"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
                />
                <button
                  type="submit"
                  disabled={sending || sent}
                  className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold whitespace-nowrap transition-all disabled:opacity-70 flex items-center gap-2"
                  style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}
                >
                  {sent ? (
                    <><FaCheck className="text-xs" /> Sent!</>
                  ) : sending ? (
                    "Sending…"
                  ) : (
                    "Send Invite"
                  )}
                </button>
              </form>
              {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
              {sent && <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><FaCheck className="text-[10px]" /> Invite sent successfully!</p>}

              {/* Members list */}
              <div className="mt-5">
                <p className="text-sm font-semibold text-gray-700 mb-3">Members</p>
                <div className="space-y-3">
                  {members.map((m) => (
                    <div key={m.email} className="flex items-center gap-3">
                      <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm" />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold text-gray-800 ${m.isOwner ? "underline" : ""}`}>{m.name}</p>
                        <p className="text-xs text-gray-400 truncate">{m.email}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 font-medium cursor-pointer hover:text-gray-800 flex-shrink-0">
                        <span>{m.role}</span>
                        <FaChevronDown className="text-xs text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Project link */}
            <div className="border border-gray-200 rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">Project Link</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={projectLink}
                  readOnly
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500 outline-none cursor-default"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2"
                  style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}
                >
                  {copied ? (
                    <><FaCheck className="text-xs" /> Copied!</>
                  ) : (
                    <><FaCopy className="text-xs" /> Copy Link</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InviteModal;
