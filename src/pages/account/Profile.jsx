import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { api, useAuthStore } from "@/store/auth";
import { User, Mail, Camera, Save, Loader2, Lock, KeyRound, LogOut } from "lucide-react";

async function getMe() {
  const { data } = await api.get("/users/me");
  return data?.data?.user || data?.data || data?.user || data;
}
async function updateMe(payload) {
  const { data } = await api.put("/users/me", payload);
  return data?.data?.user || data?.data || data?.user || data;
}
async function changePassword(payload) {
  const { data } = await api.patch("/users/me/password", payload);
  return data;
}
async function uploadAvatar(file) {
  const fd = new FormData();
  fd.append("avatar", file);
  const { data } = await api.post("/users/me/avatar", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data?.data?.user || data?.data || data?.user || data;
}

export default function Profile() {
  const { user: authUser, logout } = useAuthStore();
  const setUserInStore = useAuthStore?.getState?.().setUser;
  const [me, setMe] = useState({ name: authUser?.name || "", email: authUser?.email || "", avatarUrl: authUser?.avatarUrl || "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const fileInputRef = useRef(null);
  const avatarPreview = useMemo(() => me.avatarUrl, [me.avatarUrl]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const u = await getMe();
        setMe({ name: u?.name || "", email: u?.email || "", avatarUrl: u?.avatarUrl || "" });
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateMe({ name: me.name, avatarUrl: me.avatarUrl });
      setMe((p) => ({ ...p, name: updated?.name || p.name, avatarUrl: updated?.avatarUrl || p.avatarUrl }));
      setUserInStore?.({ ...(authUser || {}), name: updated?.name, avatarUrl: updated?.avatarUrl });
      toast.success("Profile updated");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onPickFile = () => fileInputRef.current?.click();
  const onAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const updated = await uploadAvatar(file);
      setMe((p) => ({ ...p, avatarUrl: updated?.avatarUrl || p.avatarUrl }));
      setUserInStore?.({ ...(authUser || {}), avatarUrl: updated?.avatarUrl });
      toast.success("Avatar updated");
    } catch {
      toast.error("Avatar upload failed");
    } finally {
      e.target.value = "";
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    if (!pw.currentPassword || !pw.newPassword) return toast.error("Fill both password fields");
    if (pw.newPassword.length < 6) return toast.error("New password min 6 chars");
    setPwSaving(true);
    try {
      await changePassword(pw);
      toast.success("Password changed");
      setPw({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Password change failed");
    } finally {
      setPwSaving(false);
    }
  };

  const onLogout = async () => {
    try { await logout(); } catch {}
  };

  return (
    <DashboardLayout role={authUser?.role || "traveller"} title="Profile" user={authUser}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={avatarPreview || "/default-avatar.png"}
              onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
              alt={me.name || "User"}
              className="w-20 h-20 rounded-2xl object-cover ring-1 ring-gray-200 dark:ring-gray-700"
            />
            <button
              type="button"
              onClick={onPickFile}
              className="absolute -bottom-2 -right-2 p-2 rounded-full bg-white dark:bg-gray-900 shadow ring-1 ring-gray-200 dark:ring-gray-700 hover:bg-gray-50"
              title="Change avatar"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="h-5 w-5" /> {me.name || "Your Name"}
            </h1>
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <Mail className="h-4 w-4" /> {me.email}
            </div>
          </div>
          <div className="ml-auto">
            <Button variant="destructive" className="inline-flex items-center gap-2" onClick={onLogout}>
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={onSave} className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Info</h2>
            <Button type="submit" disabled={saving || loading} className="inline-flex items-center gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </Button>
          </div>
          {loading ? (
            <div className="h-32 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  value={me.name}
                  onChange={(e) => setMe((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Email</label>
                <input
                  value={me.email}
                  disabled
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 text-gray-500"
                />
              </div>
            </div>
          )}
        </form>

        <form onSubmit={onChangePassword} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h2>
            <Button type="submit" disabled={pwSaving} className="inline-flex items-center gap-2">
              {pwSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              Update
            </Button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Current Password</label>
              <input
                type="password"
                value={pw.currentPassword}
                onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">New Password</label>
              <input
                type="password"
                value={pw.newPassword}
                onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white"
                placeholder="At least 6 characters"
              />
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}