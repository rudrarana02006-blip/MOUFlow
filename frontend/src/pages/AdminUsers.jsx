import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Network, LayoutDashboard, Users, FileText, Settings, Search, ChevronRight, CheckCircle2, Clock, Download, Mail, MoreVertical, Loader2, LogOut, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5001/api';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (u) => `${(u.firstName || '')[0] || ''}${(u.lastName || '')[0] || ''}`.toUpperCase();
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  const filtered = users.filter(u => 
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 size={40} className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-slate-400 hover:text-slate-900 transition-colors"><ArrowLeft size={20} /></Link>
            <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight">User Management</h1>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-100 rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-64"
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500"><strong className="text-slate-900">{filtered.length}</strong> registered users</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Company</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Joined</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">MOU Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 font-display font-bold text-xs flex items-center justify-center border border-slate-200/50">
                          {getInitials(user)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.company}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4">
                      {user.mou ? (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.mou.status === 'signed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {user.mou.status === 'signed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {user.mou.status === 'signed' ? 'Signed' : 'Pending'}
                        </span>
                      ) : <span className="text-xs text-slate-400">No MOU</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {user.mou?.status === 'signed' && (
                          <Link to={`/sign-document/${user.mou.secureToken}`} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View MOU">
                            <Download size={16} />
                          </Link>
                        )}
                        {user.mou && user.mou.status !== 'signed' && (
                          <Link to={`/sign-document/${user.mou.secureToken}`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="View Pending">
                            <Mail size={16} />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
