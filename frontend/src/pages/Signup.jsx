import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Network, ShieldCheck, Zap, Mail, Lock, User, Building, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5001/api';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await axios.post(`${API}/auth/signup`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setStatus({ type: 'success', message: res.data.message });
      
      // Redirect to the MOU signing page after a brief delay
      setTimeout(() => {
        navigate(res.data.mouLink);
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setStatus({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Pane - Branding & Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface flex-col justify-between p-12 lg:p-16 text-slate-100">
        
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30rem] h-[30rem] bg-accent/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-20 hover:opacity-80 transition-opacity w-fit">
            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl shadow-lg shadow-primary/20">
              <Network size={28} className="text-white" />
            </div>
            <span className="font-display text-3xl font-bold tracking-tight text-white">MOUFlow</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <h1 className="font-display text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Accelerate your <span className="text-gradient">partnerships.</span>
            </h1>
            <p className="text-slate-400 text-lg mb-12 max-w-md leading-relaxed">
              Experience the next generation of automated licensing. Secure, verifiable, and instantly accessible.
            </p>

            <div className="space-y-6">
              {[
                { icon: Zap, title: "Zero Friction Workflow", desc: "Automated document generation and routing." },
                { icon: ShieldCheck, title: "Military-grade Security", desc: "End-to-end encryption for all your agreements." }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <div className="bg-primary/20 p-2 rounded-lg text-primary-light h-fit shrink-0">
                    <feature.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1 font-display">{feature.title}</h3>
                    <p className="text-sm text-slate-400">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        <div className="relative z-10 text-sm text-slate-500 flex justify-between items-center mt-12">
          <span>© 2026 MOUFlow Systems</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
          </div>
        </div>
      </div>

      {/* Right Pane - Interactive Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative bg-slate-50">
        
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[440px] relative z-10"
        >
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
             <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl shadow-lg">
              <Network size={24} className="text-white" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-slate-900">MOUFlow</span>
          </div>

          <div className="text-center lg:text-left mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">Create an account</h2>
            <p className="text-slate-500">Join top-tier enterprises managing secure MOUs.</p>
          </div>

          {/* Status Message */}
          {status.message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${
                status.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {status.type === 'success' ? <CheckCircle size={18} /> : <span>⚠️</span>}
              {status.message}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" name="firstName" placeholder="First Name" required
                  value={formData.firstName} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder:text-slate-400"
                />
              </div>
              <div className="relative group">
                 <input 
                  type="text" name="lastName" placeholder="Last Name" required
                  value={formData.lastName} onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <Building size={18} />
              </div>
              <input 
                type="text" name="company" placeholder="Company Name" required
                value={formData.company} onChange={handleChange}
                className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder:text-slate-400"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <Mail size={18} />
              </div>
              <input 
                type="email" name="email" placeholder="name@company.com" required
                value={formData.email} onChange={handleChange}
                className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder:text-slate-400"
              />
            </div>

            <div className="relative group pb-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type="password" name="password" placeholder="Create a password (min 8 chars)" required minLength={8}
                value={formData.password} onChange={handleChange}
                className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder:text-slate-400"
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 group disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Start using MOUFlow
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
