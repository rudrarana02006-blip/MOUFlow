import React from 'react';
import { ArrowLeft, Shield, Bell, Globe, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminSettings() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link to="/admin" className="text-slate-400 hover:text-slate-900 transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight">Settings</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        {[
          { icon: Shield, title: "Security", desc: "Manage password policies and JWT secrets", color: "bg-primary/10 text-primary" },
          { icon: Bell, title: "Notifications", desc: "Configure email alerts for MOU events", color: "bg-amber-100 text-amber-600" },
          { icon: Globe, title: "Organization", desc: "Update company name and branding details", color: "bg-emerald-100 text-emerald-600" },
          { icon: Palette, title: "Appearance", desc: "Customize the platform theme and colors", color: "bg-violet-100 text-violet-600" },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${item.color}`}><item.icon size={22} /></div>
              <div>
                <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Coming Soon</span>
          </div>
        ))}
      </main>
    </div>
  );
}
