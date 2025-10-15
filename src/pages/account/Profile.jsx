
// // src/pages/account/Profile.jsx
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import DashboardLayout from "@/components/Layout/DashboardLayout";
// import { Card, CardContent } from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import toast from "react-hot-toast";
// import { api, useAuthStore } from "@/store/auth";
// import { 
//   User, 
//   Mail, 
//   Camera, 
//   Save, 
//   Loader2, 
//   Lock, 
//   KeyRound, 
//   LogOut,
//   Shield,
//   Calendar,
//   MapPin,
//   Award,
//   CheckCircle,
//   Settings
// } from "lucide-react";

// async function getMe() {
//   const { data } = await api.get("/users/me");
//   return data?.data?.user || data?.data || data?.user || data;
// }
// async function updateMe(payload) {
//   const { data } = await api.put("/users/me", payload);
//   return data?.data?.user || data?.data || data?.user || data;
// }
// async function changePassword(payload) {
//   const { data } = await api.patch("/users/me/password", payload);
//   return data;
// }
// async function uploadAvatar(file) {
//   const fd = new FormData();
//   fd.append("avatar", file);
//   const { data } = await api.post("/users/me/avatar", fd, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return data?.data?.user || data?.data || data?.user || data;
// }

// export default function Profile() {
//   const { user: authUser, logout } = useAuthStore();
//   const setUserInStore = useAuthStore?.getState?.().setUser;
//   const [me, setMe] = useState({ 
//     name: authUser?.name || "", 
//     email: authUser?.email || "", 
//     avatarUrl: authUser?.avatarUrl || "" 
//   });
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [pwSaving, setPwSaving] = useState(false);
//   const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
//   const fileInputRef = useRef(null);
//   const avatarPreview = useMemo(() => me.avatarUrl, [me.avatarUrl]);

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         const u = await getMe();
//         setMe({ 
//           name: u?.name || "", 
//           email: u?.email || "", 
//           avatarUrl: u?.avatarUrl || "" 
//         });
//       } catch {
//         toast.error("Failed to load profile");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const onSave = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const updated = await updateMe({ name: me.name, avatarUrl: me.avatarUrl });
//       setMe((p) => ({ 
//         ...p, 
//         name: updated?.name || p.name, 
//         avatarUrl: updated?.avatarUrl || p.avatarUrl 
//       }));
//       setUserInStore?.({ 
//         ...(authUser || {}), 
//         name: updated?.name, 
//         avatarUrl: updated?.avatarUrl 
//       });
//       toast.success("Profile updated successfully!");
//     } catch {
//       toast.error("Failed to save profile");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const onPickFile = () => fileInputRef.current?.click();
//   const onAvatarChange = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     try {
//       const updated = await uploadAvatar(file);
//       setMe((p) => ({ ...p, avatarUrl: updated?.avatarUrl || p.avatarUrl }));
//       setUserInStore?.({ ...(authUser || {}), avatarUrl: updated?.avatarUrl });
//       toast.success("Avatar updated!");
//     } catch {
//       toast.error("Avatar upload failed");
//     } finally {
//       e.target.value = "";
//     }
//   };

//   const onChangePassword = async (e) => {
//     e.preventDefault();
//     if (!pw.currentPassword || !pw.newPassword) {
//       return toast.error("Please fill in both password fields");
//     }
//     if (pw.newPassword.length < 6) {
//       return toast.error("New password must be at least 6 characters");
//     }
//     setPwSaving(true);
//     try {
//       await changePassword(pw);
//       toast.success("Password changed successfully!");
//       setPw({ currentPassword: "", newPassword: "" });
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Password change failed");
//     } finally {
//       setPwSaving(false);
//     }
//   };

//   const onLogout = async () => {
//     try { 
//       await logout(); 
//     } catch {}
//   };

//   return (
//     <DashboardLayout role={authUser?.role || "traveller"} title="Profile" user={authUser}>
      
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
//             <User className="h-6 w-6 text-white" />
//           </div>
//           My Profile
//         </h1>
//         <p className="text-gray-600 dark:text-gray-400 mt-2">
//           Manage your personal information and account settings
//         </p>
//       </div>

//       {/* Profile Header Card */}
//       <Card className="mb-8 border-0 shadow-lg overflow-hidden">
//         <div className="h-32 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500" />
//         <CardContent className="p-6 -mt-16 relative">
//           <div className="flex flex-col md:flex-row md:items-end gap-6">
//             {/* Avatar */}
//             <div className="relative group">
//               <div className="w-32 h-32 rounded-2xl bg-white dark:bg-gray-800 p-2 shadow-xl">
//                 <img
//                   src={avatarPreview || "/default-avatar.png"}
//                   onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
//                   alt={me.name || "User"}
//                   className="w-full h-full rounded-xl object-cover"
//                 />
//               </div>
//               <button
//                 type="button"
//                 onClick={onPickFile}
//                 className="absolute bottom-2 right-2 p-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-lg transition-all duration-300 hover:scale-110"
//                 title="Change avatar"
//               >
//                 <Camera className="h-4 w-4" />
//               </button>
//               <input 
//                 ref={fileInputRef} 
//                 type="file" 
//                 accept="image/*" 
//                 className="hidden" 
//                 onChange={onAvatarChange} 
//               />
//             </div>

//             {/* User Info */}
//             <div className="flex-1 pb-2">
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
//                 {me.name || "Your Name"}
//               </h2>
//               <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
//                 <span className="inline-flex items-center gap-1.5">
//                   <Mail className="h-4 w-4" />
//                   {me.email}
//                 </span>
//                 <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full font-medium">
//                   <Shield className="h-4 w-4" />
//                   {authUser?.role || "Traveller"}
//                 </span>
//                 <span className="inline-flex items-center gap-1.5">
//                   <Calendar className="h-4 w-4" />
//                   Member since {new Date().getFullYear()}
//                 </span>
//               </div>
//             </div>

//             {/* Logout Button */}
//             <Button 
//               variant="outline" 
//               className="gap-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20" 
//               onClick={onLogout}
//             >
//               <LogOut className="h-4 w-4" />
//               Sign Out
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Forms Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* Personal Info Form */}
//         <form onSubmit={onSave} className="lg:col-span-2">
//           <Card className="border-0 shadow-md">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
//                     <User className="h-5 w-5" />
//                     Personal Information
//                   </h3>
//                   <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                     Update your personal details
//                   </p>
//                 </div>
//                 <Button 
//                   type="submit" 
//                   disabled={saving || loading} 
//                   className="gap-2"
//                   size="sm"
//                 >
//                   {saving ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : (
//                     <Save className="h-4 w-4" />
//                   )}
//                   Save Changes
//                 </Button>
//               </div>

//               {loading ? (
//                 <div className="space-y-4">
//                   <div className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
//                   <div className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
//                 </div>
//               ) : (
//                 <div className="space-y-5">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Full Name
//                     </label>
//                     <div className="relative">
//                       <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                       <input
//                         value={me.name}
//                         onChange={(e) => setMe((p) => ({ ...p, name: e.target.value }))}
//                         className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
//                         placeholder="Enter your full name"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Email Address
//                     </label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                       <input
//                         value={me.email}
//                         disabled
//                         className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-500 cursor-not-allowed"
//                       />
//                     </div>
//                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
//                       Email cannot be changed for security reasons
//                     </p>
//                   </div>

//                   <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
//                     <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
//                       <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
//                       <div>
//                         <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
//                           Profile Verified
//                         </h4>
//                         <p className="text-sm text-blue-700 dark:text-blue-300">
//                           Your profile is complete and verified. Keep your information up to date.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </form>

//         {/* Security Section */}
//         <div className="space-y-6">
          
//           {/* Change Password Card */}
//           <form onSubmit={onChangePassword}>
//             <Card className="border-0 shadow-md">
//               <CardContent className="p-6">
//                 <div className="mb-6">
//                   <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
//                     <Lock className="h-5 w-5" />
//                     Security
//                   </h3>
//                   <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                     Update your password
//                   </p>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Current Password
//                     </label>
//                     <div className="relative">
//                       <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                       <input
//                         type="password"
//                         value={pw.currentPassword}
//                         onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))}
//                         className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                         placeholder="••••••••"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       New Password
//                     </label>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                       <input
//                         type="password"
//                         value={pw.newPassword}
//                         onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))}
//                         className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                         placeholder="Minimum 6 characters"
//                       />
//                     </div>
//                   </div>

//                   <Button 
//                     type="submit" 
//                     disabled={pwSaving} 
//                     className="w-full gap-2"
//                   >
//                     {pwSaving ? (
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                     ) : (
//                       <KeyRound className="h-4 w-4" />
//                     )}
//                     Update Password
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </form>

//           {/* Account Stats Card */}
//           <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-pink-600 text-white">
//             <CardContent className="p-6">
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
//                   <Award className="h-6 w-6" />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-lg">Premium Member</h3>
//                   <p className="text-sm opacity-90">Active since {new Date().getFullYear()}</p>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/20">
//                 <div>
//                   <div className="text-2xl font-bold">12</div>
//                   <div className="text-xs opacity-90">Bookings</div>
//                 </div>
//                 <div>
//                   <div className="text-2xl font-bold">8</div>
//                   <div className="text-xs opacity-90">Places Visited</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Settings Link Card */}
//           <Card className="border-0 shadow-md">
//             <CardContent className="p-6">
//               <Link 
//                 to="/settings"
//                 className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
//               >
//                 <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
//                   <Settings className="h-5 w-5" />
//                 </div>
//                 <div className="flex-1">
//                   <div className="font-medium">Account Settings</div>
//                   <div className="text-sm text-gray-500">Manage preferences</div>
//                 </div>
//                 <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </Link>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { api, useAuthStore } from "@/store/auth";
import { 
  User, 
  Mail, 
  Camera, 
  Save, 
  Loader2, 
  Lock, 
  KeyRound, 
  LogOut,
  Shield,
  Calendar,
  Award,
  CheckCircle,
  Settings
} from "lucide-react";

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

// ✅ New: Fetch user stats
async function getUserStats() {
  try {
    const { data } = await api.get("/users/me/stats");
    return data?.data || data || {};
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { bookingsCount: 0, placesVisited: 0 };
  }
}

export default function Profile() {
  const { user: authUser, logout } = useAuthStore();
  const setUserInStore = useAuthStore?.getState?.().setUser;
  
  const [me, setMe] = useState({ 
    name: authUser?.name || "", 
    email: authUser?.email || "", 
    avatarUrl: authUser?.avatarUrl || "" 
  });
  
  // ✅ New: Real stats state
  const [stats, setStats] = useState({
    bookingsCount: 0,
    placesVisited: 0
  });
  
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
        
        // ✅ Fixed: Fetch both user and stats in parallel
        const [userResult, statsResult] = await Promise.all([
          getMe(),
          getUserStats()
        ]);
        
        setMe({ 
          name: userResult?.name || "", 
          email: userResult?.email || "", 
          avatarUrl: userResult?.avatarUrl || "" 
        });
        
        // ✅ New: Set real stats
        setStats({
          bookingsCount: statsResult?.bookingsCount || statsResult?.totalBookings || 0,
          placesVisited: statsResult?.placesVisited || statsResult?.uniquePlaces || 0
        });
        
      } catch (error) {
        console.error('Error loading profile:', error);
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
      setMe((p) => ({ 
        ...p, 
        name: updated?.name || p.name, 
        avatarUrl: updated?.avatarUrl || p.avatarUrl 
      }));
      setUserInStore?.({ 
        ...(authUser || {}), 
        name: updated?.name, 
        avatarUrl: updated?.avatarUrl 
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error('Save profile error:', error);
      toast.error(error?.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const onPickFile = () => fileInputRef.current?.click();
  
  const onAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      toast.error("Only JPG, PNG, and WEBP images are allowed");
      return;
    }
    
    try {
      const updated = await uploadAvatar(file);
      setMe((p) => ({ ...p, avatarUrl: updated?.avatarUrl || p.avatarUrl }));
      setUserInStore?.({ ...(authUser || {}), avatarUrl: updated?.avatarUrl });
      toast.success("Avatar updated!");
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error(error?.response?.data?.message || "Avatar upload failed");
    } finally {
      e.target.value = "";
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    if (!pw.currentPassword || !pw.newPassword) {
      return toast.error("Please fill in both password fields");
    }
    if (pw.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }
    setPwSaving(true);
    try {
      await changePassword(pw);
      toast.success("Password changed successfully!");
      setPw({ currentPassword: "", newPassword: "" });
    } catch (err) {
      console.error('Password change error:', err);
      toast.error(err?.response?.data?.message || "Password change failed");
    } finally {
      setPwSaving(false);
    }
  };

  const onLogout = async () => {
    try { 
      await logout(); 
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <DashboardLayout role={authUser?.role || "traveller"} title="Profile" user={authUser}>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your personal information and account settings
        </p>
      </div>

      <Card className="mb-8 border-0 shadow-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500" />
        <CardContent className="p-6 -mt-16 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl bg-white dark:bg-gray-800 p-2 shadow-xl">
                <img
                  src={avatarPreview || "/default-avatar.png"}
                  onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                  alt={me.name || "User"}
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
              <button
                type="button"
                onClick={onPickFile}
                className="absolute bottom-2 right-2 p-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-lg transition-all duration-300 hover:scale-110"
                title="Change avatar"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={onAvatarChange} 
              />
            </div>

            <div className="flex-1 pb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {me.name || "Your Name"}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {me.email}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full font-medium">
                  <Shield className="h-4 w-4" />
                  {authUser?.role || "Traveller"}
                </span>
                {authUser?.createdAt && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Member since {new Date(authUser.createdAt).getFullYear()}
                  </span>
                )}
              </div>
            </div>

            <Button 
              variant="outline" 
              className="gap-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20" 
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <form onSubmit={onSave} className="lg:col-span-2">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Update your personal details
                  </p>
                </div>
                <Button 
                  type="submit" 
                  disabled={saving || loading} 
                  className="gap-2"
                  size="sm"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </div>

              {loading ? (
                <div className="space-y-4">
                  <div className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  <div className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        value={me.name}
                        onChange={(e) => setMe((p) => ({ ...p, name: e.target.value }))}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        value={me.email}
                        disabled
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Email cannot be changed for security reasons
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                          Profile Verified
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Your profile is complete and verified. Keep your information up to date.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </form>

        <div className="space-y-6">
          
          <form onSubmit={onChangePassword}>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Security
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Update your password
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={pw.currentPassword}
                        onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        value={pw.newPassword}
                        onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Minimum 6 characters"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={pwSaving} 
                    className="w-full gap-2"
                  >
                    {pwSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <KeyRound className="h-4 w-4" />
                    )}
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>

          {/* ✅ Fixed: Real stats instead of hardcoded */}
          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {authUser?.role === 'admin' ? 'Admin' : 'Member'}
                  </h3>
                  <p className="text-sm opacity-90">
                    Active since {authUser?.createdAt 
                      ? new Date(authUser.createdAt).getFullYear() 
                      : new Date().getFullYear()}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/20">
                <div>
                  <div className="text-2xl font-bold">
                    {loading ? '...' : stats.bookingsCount}
                  </div>
                  <div className="text-xs opacity-90">Bookings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {loading ? '...' : stats.placesVisited}
                  </div>
                  <div className="text-xs opacity-90">Places Visited</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <Link 
                to="/settings"
                className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Settings className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Account Settings</div>
                  <div className="text-sm text-gray-500">Manage preferences</div>
                </div>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}