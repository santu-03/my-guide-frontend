<<<<<<< HEAD
import { useState, useMemo, useEffect } from "react";
import axios from "axios";

import DashboardLayout from "@/components/Layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Search,
  Filter,
=======
// import { useState, useMemo } from "react";
// import DashboardLayout from "@/components/Layout/DashboardLayout";
// import Button from "@/components/ui/Button";
// import { Card, CardContent } from "@/components/ui/Card";
// import { 
//   Search, 
//   Filter, 
//   MoreVertical,
//   Mail,
//   Calendar,
//   Shield,
//   UserCheck,
//   UserX,
//   Edit,
//   Trash2
// } from "lucide-react";
// import { useSampleDataStore } from "@/store/sampleData";
// import { useAuthStore } from "@/store/auth";
// import toast from "react-hot-toast";

// export default function UsersList() {
//   const { user } = useAuthStore();
//   const { users, updateUser, deleteUser } = useSampleDataStore();
  
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterRole, setFilterRole] = useState("all");
//   const [sortBy, setSortBy] = useState("name");

//   // Filter and search users
//   const filteredUsers = useMemo(() => {
//     let filtered = users;

//     // Search filter
//     if (searchTerm) {
//       filtered = filtered.filter(user =>
//         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Role filter
//     if (filterRole !== "all") {
//       filtered = filtered.filter(user => user.role === filterRole);
//     }

//     // Sort
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case "name":
//           return a.name.localeCompare(b.name);
//         case "email":
//           return a.email.localeCompare(b.email);
//         case "role":
//           return a.role.localeCompare(b.role);
//         case "created":
//           return new Date(b.createdAt) - new Date(a.createdAt);
//         default:
//           return 0;
//       }
//     });

//     return filtered;
//   }, [users, searchTerm, filterRole, sortBy]);

//   const roleColors = {
//     admin: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
//     advisor: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
//     guide: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
//     instructor: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
//     traveller: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
//   };

//   const handleDeleteUser = (userToDelete) => {
//     if (userToDelete.role === 'admin') {
//       toast.error("Cannot delete admin users");
//       return;
//     }
    
//     if (confirm(`Are you sure you want to delete ${userToDelete.name}?`)) {
//       deleteUser(userToDelete.id);
//       toast.success("User deleted successfully");
//     }
//   };

//   const toggleUserStatus = (userToUpdate) => {
//     const newStatus = userToUpdate.status === 'active' ? 'suspended' : 'active';
//     updateUser(userToUpdate.id, { status: newStatus });
//     toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'}`);
//   };

//   return (
//     <DashboardLayout role="admin" title="Users Management" user={user}>
      
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             Manage user accounts and permissions
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <div className="text-sm text-gray-600 dark:text-gray-400">
//             Total: {users.length} users
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <Card className="mb-6">
//         <CardContent className="p-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
//             {/* Search */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search users..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
//               />
//             </div>

//             {/* Role Filter */}
//             <div className="relative">
//               <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <select
//                 value={filterRole}
//                 onChange={(e) => setFilterRole(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 appearance-none"
//               >
//                 <option value="all">All Roles</option>
//                 <option value="admin">Admin</option>
//                 <option value="advisor">Advisor</option>
//                 <option value="guide">Guide</option>
//                 <option value="instructor">Instructor</option>
//                 <option value="traveller">Traveller</option>
//               </select>
//             </div>

//             {/* Sort */}
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
//             >
//               <option value="name">Sort by Name</option>
//               <option value="email">Sort by Email</option>
//               <option value="role">Sort by Role</option>
//               <option value="created">Sort by Created Date</option>
//             </select>

//             {/* Stats */}
//             <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
//               Showing {filteredUsers.length} of {users.length}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Users Table */}
//       <Card>
//         <CardContent className="p-0 overflow-x-auto">
//           <table className="min-w-full">
//             <thead className="bg-gray-50 dark:bg-gray-800">
//               <tr>
//                 <th className="text-left p-4 font-medium text-gray-900 dark:text-white">User</th>
//                 <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Role</th>
//                 <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Joined</th>
//                 <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Status</th>
//                 <th className="text-right p-4 font-medium text-gray-900 dark:text-white">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//               {filteredUsers.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">
//                     No users found matching your criteria
//                   </td>
//                 </tr>
//               ) : (
//                 filteredUsers.map((userItem) => (
//                   <tr key={userItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    
//                     {/* User Info */}
//                     <td className="p-4">
//                       <div className="flex items-center gap-3">
//                         <img
//                           src={userItem.avatar}
//                           alt={userItem.name}
//                           className="w-10 h-10 rounded-full object-cover"
//                         />
//                         <div>
//                           <h4 className="font-medium text-gray-900 dark:text-white">
//                             {userItem.name}
//                           </h4>
//                           <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
//                             <Mail className="h-3 w-3" />
//                             {userItem.email}
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Role */}
//                     <td className="p-4">
//                       <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full capitalize ${roleColors[userItem.role] || roleColors.traveller}`}>
//                         <Shield className="h-3 w-3" />
//                         {userItem.role}
//                       </span>
//                     </td>

//                     {/* Joined Date */}
//                     <td className="p-4">
//                       <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
//                         <Calendar className="h-4 w-4" />
//                         {new Date(userItem.createdAt).toLocaleDateString()}
//                       </div>
//                     </td>

//                     {/* Status */}
//                     <td className="p-4">
//                       <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
//                         (userItem.status || 'active') === 'active'
//                           ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
//                           : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
//                       }`}>
//                         {(userItem.status || 'active') === 'active' ? (
//                           <UserCheck className="h-3 w-3" />
//                         ) : (
//                           <UserX className="h-3 w-3" />
//                         )}
//                         {(userItem.status || 'active') === 'active' ? 'Active' : 'Suspended'}
//                       </span>
//                     </td>

//                     {/* Actions */}
//                     <td className="p-4">
//                       <div className="flex items-center justify-end gap-1">
//                         <button
//                           onClick={() => toggleUserStatus(userItem)}
//                           disabled={userItem.role === 'admin'}
//                           className={`p-2 rounded-lg transition-colors ${
//                             userItem.role === 'admin'
//                               ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
//                               : (userItem.status || 'active') === 'active'
//                                 ? "text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
//                                 : "text-gray-400 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20"
//                           }`}
//                           title={
//                             userItem.role === 'admin' 
//                               ? "Cannot modify admin" 
//                               : (userItem.status || 'active') === 'active' 
//                                 ? "Suspend user" 
//                                 : "Activate user"
//                           }
//                         >
//                           {(userItem.status || 'active') === 'active' ? (
//                             <UserX className="h-4 w-4" />
//                           ) : (
//                             <UserCheck className="h-4 w-4" />
//                           )}
//                         </button>
                        
//                         <button
//                           onClick={() => handleDeleteUser(userItem)}
//                           disabled={userItem.role === 'admin'}
//                           className={`p-2 rounded-lg transition-colors ${
//                             userItem.role === 'admin'
//                               ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
//                               : "text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
//                           }`}
//                           title={userItem.role === 'admin' ? "Cannot delete admin" : "Delete user"}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </CardContent>
//       </Card>

//       {/* Role Statistics */}
//       <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
//         {['admin', 'advisor', 'guide', 'instructor', 'traveller'].map(role => {
//           const count = users.filter(u => u.role === role).length;
//           const percentage = users.length > 0 ? Math.round((count / users.length) * 100) : 0;
          
//           return (
//             <Card key={role}>
//               <CardContent className="p-4 text-center">
//                 <div className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {count}
//                 </div>
//                 <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
//                   {role}s
//                 </div>
//                 <div className="text-xs text-gray-500">
//                   {percentage}% of total
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>
//     </DashboardLayout>
//   );
// }

import { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  Search, 
  Filter, 
  MoreVertical,
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
  Mail,
  Calendar,
  Shield,
  UserCheck,
  UserX,
<<<<<<< HEAD
  Trash2,
  RefreshCw,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

/* ---------------- API client (robust auth) ---------------- */
const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const TOKEN_KEYS = [
  "token","accessToken","jwt","adminToken",
  "superadminToken","vendorToken","managerToken","userToken",
];

function getStoredToken() {
  for (const k of TOKEN_KEYS) {
    const raw = localStorage.getItem(k);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "string") return parsed;
      return parsed?.token || parsed?.accessToken || parsed?.data?.token || parsed?.data?.accessToken || null;
    } catch {
      return raw; // plain string
    }
  }
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.token || user?.accessToken || null;
  } catch { return null; }
}

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});


/* ---------------- API helpers ---------------- */
async function getUsers(params = {}) {
  const { data } = await api.get("/users", { params });
  // Normalized server returns an array
  return Array.isArray(data)
    ? data
    : (data?.users || data?.data?.users || data?.docs || data?.results || []);
}

async function updateUserStatus(id, status) {
  return api.patch(`/users/${id}`, { status });
}

async function deleteUser(id) {
  return api.delete(`/users/${id}`);
}

/* ---------------- local user shim ---------------- */
function useAuthStore() {
  try {
    return { user: JSON.parse(localStorage.getItem("user") || "null") };
  } catch {
    return { user: null };
  }
}

/* ---------------- Component ---------------- */

=======
  Edit,
  Trash2,
  RefreshCw,
  Loader2
} from "lucide-react";
// Replace sampleData store with API calls
import { getUsers, updateUser, deleteUser, updateUserStatus } from "@/lib/users";
import { useAuthStore } from "@/store/auth";
import toast from "react-hot-toast";

>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
export default function UsersList() {
  const { user } = useAuthStore();
  
  // Local state for data and filters
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build API params
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterRole !== "all") params.role = filterRole;
      params.sortBy = sortBy;
      params.limit = 100; // Adjust as needed
      
      const response = await getUsers(params);
      const usersData = response.data || response.users || response;
      
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and refetch when filters change
  useEffect(() => {
    fetchUsers();
  }, [searchTerm, filterRole, sortBy]);

  const roleColors = {
    admin: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
    advisor: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
    guide: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    instructor: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    traveller: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
  };

  const handleDeleteUser = async (userToDelete) => {
    if (userToDelete.role === 'admin') {
      toast.error("Cannot delete admin users");
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete ${userToDelete.name}?`)) {
      return;
    }

    try {
      await deleteUser(userToDelete._id || userToDelete.id);
      setUsers(prev => prev.filter(u => (u._id || u.id) !== (userToDelete._id || userToDelete.id)));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const toggleUserStatus = async (userToUpdate) => {
    if (userToUpdate.role === 'admin') {
      toast.error("Cannot modify admin users");
      return;
    }

    const currentStatus = userToUpdate.status || 'active';
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    
    try {
      await updateUserStatus(userToUpdate._id || userToUpdate.id, newStatus);
      setUsers(prev => prev.map(u => 
        (u._id || u.id) === (userToUpdate._id || userToUpdate.id)
          ? { ...u, status: newStatus }
          : u
      ));
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'}`);
    } catch (error) {
      console.error('Update user status error:', error);
      toast.error(error.response?.data?.message || "Failed to update user status");
    }
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  // Role statistics
  const roleStats = useMemo(() => {
    return ['admin', 'advisor', 'guide', 'instructor', 'traveller'].map(role => {
      const count = users.filter(u => u.role === role).length;
      const percentage = users.length > 0 ? Math.round((count / users.length) * 100) : 0;
      
      return {
        role,
        count,
        percentage
      };
    });
  }, [users]);

  if (error) {
    return (
      <DashboardLayout role="admin" title="Users Management" user={user}>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-600 mb-4">Error loading users: {error}</p>
          <Button onClick={handleRefresh} className="inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin" title="Users Management" user={user}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleRefresh} 
            variant="outline"
            disabled={loading}
            className="inline-flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total: {users.length} users
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 appearance-none"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="advisor">Advisor</option>
                <option value="guide">Guide</option>
                <option value="instructor">Instructor</option>
                <option value="traveller">Traveller</option>
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
            >
              <option value="createdAt">Sort by Created Date</option>
              <option value="name">Sort by Name</option>
              <option value="email">Sort by Email</option>
              <option value="role">Sort by Role</option>
            </select>

            {/* Stats */}
            <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </span>
              ) : (
                `Showing ${users.length} users`
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="mb-8">
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">User</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Role</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Joined</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Status</th>
                  <th className="text-right p-4 font-medium text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No users found matching your criteria
                    </td>
                  </tr>
                ) : (
                  users.map((userItem) => (
                    <tr key={userItem._id || userItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      
                      {/* User Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={userItem.avatar || '/default-avatar.png'}
                            alt={userItem.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => e.target.src = '/default-avatar.png'}
                          />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {userItem.name}
                            </h4>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                              <Mail className="h-3 w-3" />
                              {userItem.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full capitalize ${roleColors[userItem.role] || roleColors.traveller}`}>
                          <Shield className="h-3 w-3" />
                          {userItem.role}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          {userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString() : 'Unknown'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                          (userItem.status || 'active') === 'active'
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                        }`}>
                          {(userItem.status || 'active') === 'active' ? (
                            <UserCheck className="h-3 w-3" />
                          ) : (
                            <UserX className="h-3 w-3" />
                          )}
                          {(userItem.status || 'active') === 'active' ? 'Active' : 'Suspended'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => toggleUserStatus(userItem)}
                            disabled={userItem.role === 'admin'}
                            className={`p-2 rounded-lg transition-colors ${
                              userItem.role === 'admin'
                                ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                : (userItem.status || 'active') === 'active'
                                  ? "text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                                  : "text-gray-400 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20"
                            }`}
                            title={
                              userItem.role === 'admin' 
                                ? "Cannot modify admin" 
                                : (userItem.status || 'active') === 'active' 
                                  ? "Suspend user" 
                                  : "Activate user"
                            }
                          >
                            {(userItem.status || 'active') === 'active' ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteUser(userItem)}
                            disabled={userItem.role === 'admin'}
                            className={`p-2 rounded-lg transition-colors ${
                              userItem.role === 'admin'
                                ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                : "text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                            }`}
                            title={userItem.role === 'admin' ? "Cannot delete admin" : "Delete user"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Role Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {roleStats.map(({ role, count, percentage }) => (
          <Card key={role}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {count}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {role}s
              </div>
              <div className="text-xs text-gray-500">
                {percentage}% of total
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}