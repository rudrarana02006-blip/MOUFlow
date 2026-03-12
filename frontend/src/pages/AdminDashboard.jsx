import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, LayoutDashboard, Users, FileText, Settings, 
  Bell, Search, MoreVertical, CheckCircle2, Clock,
  Menu, X, ChevronRight, Download, Mail, LogOut, Loader2
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function AdminDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0, pendingMous: 0, signedMous: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [statsRes, usersRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, { headers }),
        axios.get(`${API}/admin/users`, { headers })
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const statCards = [
    { title: "Total Signups", value: stats.totalUsers, color: "bg-primary/10 text-primary", icon: Users },
    { title: "Pending Signatures", value: stats.pendingMous, color: "bg-amber-100 text-amber-600", icon: Clock },
    { title: "Completed MOUs", value: stats.signedMous, color: "bg-emerald-100 text-emerald-600", icon: CheckCircle2 },
  ];

  const NavLinks = () => (
    <>
      {[
        { name: 'Overview', icon: LayoutDashboard, path: '/admin' },
        { name: 'Users', icon: Users, path: '/admin/users' },
        { name: 'MOUs', icon: FileText, path: '/admin/mous' },
        { name: 'Settings', icon: Settings, path: '/admin/settings' },
      ].map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              isActive 
                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-surface-hover'
            }`}
          >
            <item.icon size={20} className={isActive ? "text-white" : "text-slate-400"} />
            {item.name}
          </Link>
        )
      })}
    </>
  );

  const getInitials = (user) => {
    return `${(user.firstName || '')[0] || ''}${(user.lastName || '')[0] || ''}`.toUpperCase();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-surface text-white flex-col border-r border-slate-800/50 shadow-2xl z-20">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-accent p-2.5 rounded-xl shadow-lg shadow-primary/20">
              <Network size={22} className="text-white" />
            </div>
            <div>
               <h1 className="font-display text-xl font-bold tracking-tight">MOUFlow</h1>
               <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Admin Portal</span>
            </div>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-8 pl-4 pr-6 space-y-2">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>
          <NavLinks />
        </div>

        <div className="p-6 border-t border-white/5 bg-slate-800/20">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 mb-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-display font-bold shadow-inner text-sm">
              {getInitials(currentUser)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-white leading-tight truncate">{currentUser.firstName} {currentUser.lastName}</span>
              <span className="text-xs text-slate-400 truncate">{currentUser.email}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        
        <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-primary/5 rounded-full filter blur-[100px] pointer-events-none -translate-y-1/2"></div>
        
        {/* Header */}
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-200/50 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Overview</h2>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:flex relative group">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" placeholder="Search MOUs or users..." 
                className="pl-10 pr-4 py-2 w-64 bg-slate-100 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-full text-sm transition-all focus:shadow-md"
              />
            </div>
            <button className="relative p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              {stats.pendingMous > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>}
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6 sm:p-10 z-0">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={40} className="animate-spin text-primary" />
            </div>
          ) : (
          <div className="max-w-7xl mx-auto space-y-8 pb-12">
            
            {/* Welcome Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="glass rounded-3xl p-8 bg-gradient-to-br from-white to-slate-50/50 border border-white relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-display font-bold text-slate-900 mb-2">Welcome back, {currentUser.firstName || 'Admin'}! 👋</h3>
                <p className="text-slate-500 max-w-2xl text-lg">Here's what's happening with your MOU licensing platform today. You have <strong className="text-primary font-semibold">{stats.pendingMous} pending signature{stats.pendingMous !== 1 ? 's' : ''}</strong> requiring attention.</p>
              </div>
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {statCards.map((stat, i) => (
                 <motion.div 
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 + (i * 0.1) }}
                    whileHover={{ y: -4 }}
                    className="glass bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all"
                 >
                   <div className="flex justify-between items-start mb-6">
                      <div className={`p-4 rounded-2xl ${stat.color} shadow-inner`}>
                        <stat.icon size={28} strokeWidth={2.5} />
                      </div>
                   </div>
                   <div>
                     <p className="text-4xl font-display font-black text-slate-900 tracking-tight mb-1">{stat.value}</p>
                     <p className="text-slate-500 font-medium">{stat.title}</p>
                   </div>
                 </motion.div>
              ))}
            </div>

            {/* Main Table */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
              className="glass bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-900">Recent Registrations</h3>
                  <p className="text-sm text-slate-500 mt-1">Users who recently signed up and their MOU status.</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-widest">User Details</th>
                      <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-widest">Signup Date</th>
                      <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-widest">MOU Status</th>
                      <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-12 text-center text-slate-400">
                          No users yet. They'll appear here once someone signs up.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-display font-bold text-sm flex items-center justify-center shadow-inner border border-slate-200/50 group-hover:bg-white transition-colors">
                                {getInitials(user)}
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                                 <p className="text-sm text-slate-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-600 font-medium">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-8 py-5 whitespace-nowrap">
                            {user.mou ? (
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                                user.mou.status === 'signed' 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                                  : 'bg-amber-50 text-amber-700 border border-amber-200/50'
                              }`}>
                                {user.mou.status === 'signed' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                {user.mou.status === 'signed' ? 'Signed' : 'Pending'}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">No MOU</span>
                            )}
                          </td>
                          <td className="px-8 py-5 whitespace-nowrap text-right text-sm">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {user.mou && user.mou.status === 'signed' ? (
                                 <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Download MOU">
                                   <Download size={18} />
                                 </button>
                              ) : user.mou ? (
                                 <Link to={`/sign-document/${user.mou.secureToken}`} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="View MOU Link">
                                   <Mail size={18} />
                                 </Link>
                              ) : null}
                              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                <MoreVertical size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
          )}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsMobileMenuOpen(false)}
               className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
               initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", bounce: 0, duration: 0.4 }}
               className="fixed inset-y-0 left-0 w-72 bg-surface text-white flex flex-col z-50 shadow-2xl"
            >
              <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                <Link to="/" className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl">
                    <Network size={20} className="text-white" />
                  </div>
                  <span className="font-display text-xl font-bold tracking-tight">MOUFlow</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-lg">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
                <NavLinks />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
