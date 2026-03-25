import { useState, useRef } from "react";
import PageLayout from "../components/PageLayout";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { FaCog, FaUser, FaLock, FaCheck, FaCamera } from "react-icons/fa";

const Settings = () => {
  const { user, saveSession } = useAuth();

  const [profileForm, setProfileForm] = useState({ name: user?.name || "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [profileMsg, setProfileMsg] = useState(null);
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const fileRef = useRef();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return;
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const fd = new FormData();
      fd.append("name", profileForm.name.trim());
      if (avatarFile) fd.append("avatar", avatarFile);

      const res = await API.put("/auth/profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
      setAvatarFile(null);
      if (res.data?.token) saveSession(res.data);
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.message || "Failed to update profile" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      return setPasswordMsg({ type: "error", text: "New passwords do not match" });
    if (passwordForm.newPassword.length < 6)
      return setPasswordMsg({ type: "error", text: "Password must be at least 6 characters" });
    setSavingPassword(true);
    setPasswordMsg(null);
    try {
      await API.put("/auth/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMsg({ type: "success", text: "Password changed successfully!" });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordMsg({ type: "error", text: err.response?.data?.message || "Failed to change password" });
    } finally {
      setSavingPassword(false);
    }
  };

  const displayAvatar =
    avatarPreview ||
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=f87171&color=fff&size=128`;

  return (
    <PageLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
          <FaCog className="text-gray-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Settings</h1>
          <p className="text-xs text-gray-400">Manage your account preferences</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-5">
        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaUser className="text-red-400" />
            <h2 className="font-semibold text-gray-700">Profile</h2>
          </div>

          {/* Avatar picker */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
              <img
                src={displayAvatar}
                alt={user?.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1">
                <FaCamera className="text-white text-lg" />
                <span className="text-white text-[10px] font-semibold">Change</span>
              </div>
              {/* Camera badge */}
              <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-red-500 border-2 border-white flex items-center justify-center shadow">
                <FaCamera className="text-white text-xs" />
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

            <p className="text-xs text-gray-400 mt-2">Click photo to change</p>

            {avatarPreview && (
              <span className="mt-1 text-xs text-green-600 font-medium bg-green-50 px-3 py-0.5 rounded-full">
                New photo selected — save to apply
              </span>
            )}

            {/* User info below avatar */}
            <div className="text-center mt-3">
              <p className="font-semibold text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-500 font-medium capitalize">
                {user?.provider || "local"} account
              </span>
            </div>
          </div>

          {profileMsg && (
            <div className={`mb-4 px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 ${
              profileMsg.type === "success"
                ? "bg-green-50 text-green-600 border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}>
              {profileMsg.type === "success" && <FaCheck className="text-xs" />}
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleProfileSave}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ name: e.target.value })}
              placeholder="Your name"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition mb-4"
            />
            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}
            >
              {savingProfile ? "Saving…" : "Save Profile"}
            </button>
          </form>
        </div>

        {/* Password card — only for local accounts */}
        {user?.provider !== "google" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <FaLock className="text-red-400" />
              <h2 className="font-semibold text-gray-700">Change Password</h2>
            </div>

            {passwordMsg && (
              <div className={`mb-4 px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 ${
                passwordMsg.type === "success"
                  ? "bg-green-50 text-green-600 border border-green-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}>
                {passwordMsg.type === "success" && <FaCheck className="text-xs" />}
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordSave} className="space-y-4">
              {[
                { label: "Current Password", key: "currentPassword" },
                { label: "New Password", key: "newPassword" },
                { label: "Confirm New Password", key: "confirmPassword" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="password"
                    value={passwordForm[key]}
                    onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={savingPassword}
                className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg,#ef4444,#f97316)" }}
              >
                {savingPassword ? "Updating…" : "Update Password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Settings;
