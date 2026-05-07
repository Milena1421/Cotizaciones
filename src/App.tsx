import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FilePlus, Briefcase, Calculator, FileText } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import Dashboard from './components/Dashboard';
import QuotesPanel from './components/QuotesPanel';
import QuoteForm from './components/QuoteForm';
import OpportunitiesPanel from './components/OpportunitiesPanel';

function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Panel Control' },
    { path: '/quotes', icon: FileText, label: 'Cotizaciones' },
    { path: '/opportunities', icon: Briefcase, label: 'Oportunidades' },
  ];

  return (
    <div className="w-64 h-screen bg-[#0d1526] text-white flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3 mb-8">
        <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-600/20">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-xl leading-none tracking-tighter">COTIZAPRO</span>
          <span className="text-[9px] text-blue-400 font-black uppercase tracking-[0.2em] mt-1">Ingeniería 365</span>
        </div>
      </div>
      
      <div className="px-3 mb-6">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' 
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'group-hover:text-slate-200'}`} />
                <span className="font-bold text-xs uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-3 flex-1">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-4 mb-4">OPERACIONES</p>
        <nav className="space-y-1">
          <Link to="/new-quote" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 rounded-lg transition-all group">
            <FilePlus className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs uppercase tracking-wider">Nueva Cotización</span>
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 rounded-lg transition-all group">
            <Briefcase className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs uppercase tracking-wider">Importar Datos</span>
          </button>
        </nav>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-50 font-sans">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/quotes" element={<QuotesPanel />} />
              <Route path="/new-quote" element={<QuoteForm />} />
              <Route path="/opportunities" element={<OpportunitiesPanel />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </BrowserRouter>
  );
}
