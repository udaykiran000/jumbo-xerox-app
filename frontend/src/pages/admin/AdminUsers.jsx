import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Users,
  Mail,
  Calendar,
  Shield,
  Search,
  UserCheck,
  Trash2,
} from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch (e) {
      toast.error("Users load failed");
    }
  };

  const handleDelete = async (id, role) => {
    if (role === "admin")
      return toast.error("Admin account cannot be deleted!");
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/user/${id}`);
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (e) {
        toast.error(e.response?.data?.message || "Delete failed");
      }
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <Users className="text-cyan-400" /> User Management
          </h2>
          <p className="text-slate-500 text-sm">
            Directory of all registered customers and staff.
          </p>
        </div>
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search users..."
            className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 w-full md:w-80 transition-all placeholder:text-slate-600 shadow-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  {" "}
                  Identity{" "}
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  {" "}
                  Email Access{" "}
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  {" "}
                  Authority{" "}
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  {" "}
                  Membership{" "}
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">
                  {" "}
                  Actions{" "}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((u) => (
                <tr
                  key={u._id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="p-6 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-[1px] shadow-lg shadow-blue-500/10">
                        <div className="w-full h-full bg-slate-900 rounded-[15px] flex items-center justify-center font-black text-white text-xs">
                          {u.name.charAt(0)}
                        </div>
                      </div>
                      <span className="text-slate-100 font-bold">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Mail size={14} className="text-slate-600" /> {u.email}
                    </div>
                  </td>
                  <td className="p-6">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        u.role === "admin"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      <Shield size={10} /> {u.role}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Calendar size={14} className="text-slate-700" />{" "}
                      {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    {u.role !== "admin" && (
                      <button
                        onClick={() => handleDelete(u._id, u.role)}
                        className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-20 text-center">
              <UserCheck className="mx-auto mb-4 text-slate-700" size={40} />
              <p className="text-slate-500 font-bold italic">
                {" "}
                No user records found.{" "}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
