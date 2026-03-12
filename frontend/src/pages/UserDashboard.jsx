import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Network, FileText, CheckCircle2, Clock, Download, Eye, Plus, Loader2, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({ stats: { totalMous: 0, signedMous: 0, pendingMous: 0 }, mous: [] });
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [creating, setCreating] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [dashRes, tplRes] = await Promise.all([
        axios.get(`${API}/user/dashboard`, { headers }),
        axios.get(`${API}/templates`, { headers })
      ]);
      setData(dashRes.data);
      setTemplates(tplRes.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMou = async (templateId) => {
    setCreating(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post(`${API}/user/mou/create`, { templateId }, { headers });
      navigate(res.data.mouLink);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create MOU.');
    } finally {
      setCreating(false);
      setShowPicker(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 size={40} className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl shadow-sm">
              <Network size={18} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900">MOUFlow</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:block">Hi, <strong className="text-slate-900">{user.firstName}</strong></span>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Welcome + Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">My Documents</h1>
            <p className="text-slate-500 mt-1">View and manage your Memorandums of Understanding.</p>
          </div>
          <button 
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
          >
            <Plus size={18} /> Sign New MOU
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: "Total MOUs", value: data.stats.totalMous, icon: FileText, color: "bg-primary/10 text-primary" },
            { label: "Signed", value: data.stats.signedMous, icon: CheckCircle2, color: "bg-emerald-100 text-emerald-600" },
            { label: "Pending", value: data.stats.pendingMous, icon: Clock, color: "bg-amber-100 text-amber-600" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5"
            >
              <div className={`p-3 rounded-xl ${s.color}`}><s.icon size={24} /></div>
              <div>
                <p className="text-3xl font-display font-black text-slate-900">{s.value}</p>
                <p className="text-sm text-slate-500 font-medium">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* MOU List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="font-display text-lg font-bold text-slate-900">Your MOUs</h2>
          </div>
          {data.mous.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <FileText size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium">No MOUs yet. Click "Sign New MOU" to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data.mous.map((mou) => (
                <div key={mou._id} className="px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-lg ${mou.status === 'signed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {mou.status === 'signed' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{mou.documentTitle}</p>
                      <p className="text-sm text-slate-500">
                        {mou.status === 'signed' ? `Signed ${formatDate(mou.signedAt)}` : `Created ${formatDate(mou.createdAt)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/sign-document/${mou.secureToken}`} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View MOU">
                      <Eye size={18} />
                    </Link>
                    {mou.status === 'signed' && (
                      <button onClick={() => window.print()} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" title="Download">
                        <Download size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* Template Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowPicker(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[80vh] overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="font-display text-xl font-bold text-slate-900">Choose an MOU to Sign</h3>
              <p className="text-sm text-slate-500 mt-1">Select a memorandum template from the list below.</p>
            </div>
            <div className="overflow-y-auto max-h-[50vh] p-4">
              {templates.length === 0 ? (
                <p className="text-center text-slate-400 py-8">No templates available yet. Contact your admin.</p>
              ) : (
                <div className="space-y-3">
                  {templates.map((tpl) => (
                    <button key={tpl._id} onClick={() => handleCreateMou(tpl._id)} disabled={creating}
                      className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      <p className="font-semibold text-slate-900 group-hover:text-primary">{tpl.title}</p>
                      {tpl.description && <p className="text-sm text-slate-500 mt-1">{tpl.description}</p>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <button onClick={() => setShowPicker(false)} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
