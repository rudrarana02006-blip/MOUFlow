import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, FileText, Trash2, Edit3, X, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5001/api';

export default function AdminMous() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', content: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${API}/templates`, { headers: { Authorization: `Bearer ${token}` } });
      setTemplates(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditing(null);
    setForm({ title: '', description: '', content: '' });
    setShowForm(true);
  };

  const openEdit = async (id) => {
    try {
      const res = await axios.get(`${API}/templates/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setEditing(id);
      setForm({ title: res.data.title, description: res.data.description || '', content: res.data.content });
      setShowForm(true);
    } catch (err) {
      alert('Failed to load template.');
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.content) { alert('Title and content are required.'); return; }
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (editing) {
        await axios.put(`${API}/templates/${editing}`, form, { headers });
      } else {
        await axios.post(`${API}/templates`, form, { headers });
      }
      setShowForm(false);
      fetchTemplates();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save template.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      await axios.delete(`${API}/templates/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchTemplates();
    } catch (err) {
      alert('Failed to delete template.');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 size={40} className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-slate-400 hover:text-slate-900 transition-colors"><ArrowLeft size={20} /></Link>
            <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight">MOU Templates</h1>
          </div>
          <button onClick={openNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 text-sm"
          >
            <Plus size={16} /> New Template
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {templates.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
            <FileText size={56} className="mx-auto mb-4 text-slate-200" />
            <h3 className="font-display text-xl font-bold text-slate-900 mb-2">No Templates Yet</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">Create your first MOU template. Users will be able to select and sign these documents.</p>
            <button onClick={openNew} className="px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors">
              <Plus size={16} className="inline mr-2" />Create First Template
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {templates.map((tpl, i) => (
              <motion.div key={tpl._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary"><FileText size={22} /></div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{tpl.title}</h3>
                    {tpl.description && <p className="text-sm text-slate-500 mt-0.5">{tpl.description}</p>}
                    <p className="text-xs text-slate-400 mt-1">Created {formatDate(tpl.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(tpl._id)} className="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDelete(tpl._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-slate-900">{editing ? 'Edit Template' : 'New MOU Template'}</h3>
                <button onClick={() => setShowForm(false)} className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title *</label>
                  <input type="text" placeholder="e.g. Partnership Agreement" value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                  <input type="text" placeholder="Brief summary of the MOU" value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Document Content *</label>
                  <textarea placeholder="Write the full body text of the MOU here..." rows={12} value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none font-mono"
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => setShowForm(false)} className="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving}
                  className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors text-sm disabled:opacity-60 flex items-center gap-2"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                  {editing ? 'Save Changes' : 'Create Template'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
