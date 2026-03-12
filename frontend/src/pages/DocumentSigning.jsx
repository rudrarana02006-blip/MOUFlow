import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Network, ArrowLeft, PenTool, CheckCircle, Send, ShieldCheck, Download, Loader2, AlertCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function DocumentSigning() {
  const { token } = useParams();
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mou, setMou] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      fetchMou();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchMou = async () => {
    try {
      const res = await axios.get(`${API}/mou/${token}`);
      setMou(res.data);
      if (res.data.isSigned) {
        setSubmitted(true);
        setIsSigned(true);
        setHasAgreed(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load the MOU document.');
    } finally {
      setLoading(false);
    }
  };

  const handleSign = () => {
    if (!submitted) setIsSigned(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSigned || !hasAgreed || isSubmitting || submitted) return;
    
    setIsSubmitting(true);
    try {
      const signerName = mou?.user?.name || 'User';
      await axios.post(`${API}/mou/${token}/sign`, {
        signatureData: 'digital-signature-data',
        signerName
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit signature.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Document Not Found</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <Link to="/signup" className="text-primary font-semibold hover:text-primary-hover transition-colors">← Back to Signup</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-primary/20 selection:text-primary pb-48">
      
      {/* Minimalist Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between relative">
           <div className="absolute top-0 left-0 h-[2px] bg-primary transition-all" style={{ width: submitted ? '100%' : isSigned ? '66%' : '33%' }}></div>
           
           <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2 -ml-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors group">
              <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-primary to-accent p-1.5 rounded-lg shadow-sm">
                <Network size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-slate-900 tracking-tight hidden sm:block">MOUFlow</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Status:</span>
            {submitted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                <CheckCircle size={12} /> Signed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Action Required
              </span>
            )}
          </div>
        </div>
      </header>
      
      {/* Success Banner */}
      {submitted && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border-b border-emerald-200 py-4 px-6 text-center"
        >
          <p className="text-emerald-800 font-semibold flex items-center justify-center gap-2">
            <CheckCircle size={18} /> This MOU has been successfully signed and recorded!
          </p>
        </motion.div>
      )}
      
      {/* Main Document */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <motion.article 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/60 overflow-hidden relative"
        >
          <div className="h-2 w-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 border-b border-slate-200/60"></div>

          <div className="p-8 sm:p-16">
            <header className="mb-14 text-center border-b border-slate-100 pb-10">
              <div className="inline-flex items-center justify-center p-4 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
                <ShieldCheck size={32} className="text-primary" />
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
                Memorandum of Understanding
              </h1>
              {mou?.user && (
                <p className="text-xl text-slate-500 font-medium">
                  Prepared for {mou.user.name} — {mou.user.company}
                </p>
              )}
              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400 font-medium">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Token: {token?.slice(0, 8)}...</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Date: {new Date(mou?.createdAt).toLocaleDateString()}</span>
              </div>
            </header>
            
            <div className="space-y-8 prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed marker:text-primary">
              <p className="lead text-xl text-slate-600">
                This document outlines the mutual agreement and understanding between the participating entities (hereafter referred to as "the Parties") regarding the proposed collaboration for technological integration and shared resource allocation.
              </p>
              
              <h3 className="font-display text-2xl font-bold text-slate-900 tracking-tight pt-4">1. Purpose and Scope</h3>
              <p>
                The purpose of this Memorandum of Understanding (MOU) is to establish a framework of cooperation and facilitate collaboration between the Parties on a non-exclusive basis in areas of mutual interest.
              </p>
              <ul className="bg-slate-50 rounded-xl p-6 border border-slate-100 shadow-inner">
                <li className="font-medium text-slate-800">Joint development of API endpoints for data synchronization.</li>
                <li className="font-medium text-slate-800">Shared marketing initiatives targeting enterprise clients.</li>
                <li className="font-medium text-slate-800">Co-hosting of bi-annual technical summits.</li>
              </ul>

              <h3 className="font-display text-2xl font-bold text-slate-900 tracking-tight pt-6">2. Roles and Responsibilities</h3>
              <p>
                Each party agrees to designate a primary contact person who will be responsible for overseeing the implementation of this MOU. The Parties shall meet at least quarterly to review progress.
              </p>

              <h3 className="font-display text-2xl font-bold text-slate-900 tracking-tight pt-6">3. Confidentiality & Termination</h3>
              <p>
                Both Parties agree to maintain the strict confidentiality of exchanged information. This MOU shall become effective upon signature and will remain in effect until terminated by a 30-day written notice.
              </p>
            </div>
          </div>
        </motion.article>
      </main>
      
      {/* Sticky Action Footer */}
      {!submitted && (
        <motion.div 
          initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.8 }}
          className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-2xl border-t border-slate-200/60 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]"
        >
          <div className="max-w-4xl mx-auto px-6 py-6 sm:py-8 flex flex-col gap-6">
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-5 gap-8 items-end">
                 
                 {/* Signature Area */}
                 <div className="md:col-span-3 flex flex-col gap-3">
                    <div className="flex justify-between items-end">
                      <label className="font-semibold text-slate-700 text-sm tracking-wide uppercase">Signature Required</label>
                      {isSigned && (
                         <button onClick={() => setIsSigned(false)} type="button" className="text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors">
                            Clear Signature
                         </button>
                      )}
                    </div>
                    
                    <div 
                      onClick={handleSign}
                      className={`h-24 w-full rounded-xl flex items-center justify-center cursor-pointer transition-all border-2 ${
                        isSigned 
                          ? 'bg-emerald-50/50 border-emerald-200 shadow-inner' 
                          : 'bg-slate-50 border-dashed border-slate-300 hover:border-primary/50 hover:bg-white'
                      }`}
                    >
                      {isSigned ? (
                         <div className="flex flex-col items-center">
                            <span className="font-display text-3xl font-bold text-slate-800 italic transform -rotate-2">{mou?.user?.name || 'User'}</span>
                            <span className="text-[10px] text-emerald-600 font-semibold mt-1">Verified Digital Signature</span>
                         </div>
                      ) : (
                         <div className="flex flex-col items-center text-slate-400">
                            <PenTool size={24} className="mb-2" />
                            <span className="text-sm font-medium">Click to draw your signature</span>
                         </div>
                      )}
                    </div>
                 </div>

                 {/* Acknowledge & Submit */}
                 <div className="md:col-span-2 flex flex-col gap-4">
                    <label className="flex items-start gap-3 cursor-pointer group select-none">
                      <div className="relative flex items-center mt-0.5 shrink-0">
                        <input 
                          type="checkbox" 
                          checked={hasAgreed}
                          onChange={(e) => setHasAgreed(e.target.checked)}
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 bg-white checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all" 
                        />
                        <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 flex items-center justify-center">
                          <CheckCircle size={14} className="stroke-[3]" />
                        </span>
                      </div>
                      <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors leading-snug">
                        I legally acknowledge and agree to the terms of this MOU.
                      </span>
                    </label>
                    
                    <button 
                      type="submit"
                      disabled={!isSigned || !hasAgreed || isSubmitting}
                      className="w-full h-12 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover focus:ring-4 focus:ring-primary/20 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:shadow-none"
                    >
                      {isSubmitting ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>Sign & Finalize <Send size={18} /></>
                      )}
                    </button>
                 </div>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
}
