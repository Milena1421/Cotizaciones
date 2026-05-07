import { useState, useEffect } from 'react';
import { quoteService, opportunityService } from '../services/dataService';
import { Quote, Opportunity } from '../types';
import { motion } from 'motion/react';
import { FileText, Clock, TrendingUp, Users, Plus, Search, Filter, XCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubQuotes = quoteService.subscribeToQuotes(setQuotes);
    const unsubOpps = opportunityService.subscribeToOpportunities(setOpportunities);
    return () => {
      unsubQuotes();
      unsubOpps();
    };
  }, []);

  const stats = [
    { 
      label: 'TOTAL COTIZACIONES', 
      value: quotes.length, 
      isCount: true,
      icon: FileText, 
      color: 'bg-blue-50 text-blue-500' 
    },
    { 
      label: 'ACEPTADA', 
      value: quotes.filter(q => q.status === 'aceptada').reduce((sum, q) => sum + (q.amount || 0), 0), 
      icon: CheckCircle, 
      color: 'bg-emerald-50 text-emerald-500' 
    },
    { 
      label: 'RECHAZADA', 
      value: quotes.filter(q => q.status === 'rechazada').reduce((sum, q) => sum + (q.amount || 0), 0), 
      icon: XCircle, 
      color: 'bg-red-50 text-red-500' 
    },
    { 
      label: 'PENDIENTE', 
      value: quotes.filter(q => q.status === 'pendiente' || q.status === 'enviada').reduce((sum, q) => sum + (q.amount || 0), 0), 
      icon: Clock, 
      color: 'bg-amber-50 text-amber-500' 
    },
  ];

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-[1400px] mx-auto pb-20"
    >
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por cliente o cotización..." 
            className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg py-3 pl-12 pr-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 text-xs font-medium"
          />
        </div>
        <div className="flex gap-1.5">
          <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-lg shadow-sm text-[10px] font-black text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-colors uppercase">
            <Clock className="w-3 h-3" /> Todos los meses
          </button>
          <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-lg shadow-sm text-[10px] font-black text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-colors uppercase">
            <Users className="w-3 h-3" /> Todos los clientes
          </button>
          <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-lg shadow-sm text-[10px] font-black text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-colors uppercase">
            <Filter className="w-3 h-3" /> Todos los estados
          </button>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 text-left">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={stat.label}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-5"
          >
            <div className={`${stat.color} p-3 rounded-xl`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{stat.label}</p>
              <p className="text-xl font-black text-[#0b1426] leading-none">
                {stat.isCount ? stat.value : formatNumber(Number(stat.value))}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-8">
        {quotes.map((quote) => (
          <div key={quote.id} className="bg-white rounded-xl border-t-[4px] border-red-500 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black text-[#1e293b] tracking-tight truncate max-w-md uppercase">{quote.clientName}</h2>
                  {quote.clientNit && (
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">NIT: {quote.clientNit}</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <span className="bg-[#f1f5f9] text-slate-500 text-[10px] font-bold px-4 py-1.5 rounded-md border border-slate-200">{quote.createdAt?.toDate ? format(quote.createdAt.toDate(), 'yyyy-MM-dd') : '...'}</span>
                    <span className="bg-[#f1f5f9] text-slate-500 text-[10px] font-black px-4 py-1.5 rounded-md border border-slate-200 uppercase">COT{quote.id.slice(-4).toUpperCase()}</span>
                    <span className="bg-[#f1f5f9] text-slate-500 text-[10px] font-bold px-4 py-1.5 rounded-md border border-slate-200 uppercase">VIGENCIA 15 DÍAS</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 text-blue-500 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors transition-transform active:scale-95"><FileText className="w-4 h-4" /></button>
                  <button className="p-2.5 text-red-500 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors transition-transform active:scale-95"><XCircle className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">DETALLE SERVICIO</p>
                <div className="border-l-2 border-slate-200 pl-4 py-1">
                  <p className="text-[11px] text-slate-500 font-bold leading-relaxed italic uppercase opacity-80">
                    Suministro y configuración de solución {quote.type.toUpperCase()} en entorno {quote.environment?.toUpperCase()} bajo plataforma {quote.techPlatform?.toUpperCase()} para {quote.userVolume} usuarios. Modalidad {quote.modality.toUpperCase()} en ubicación {quote.location.toUpperCase()}.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2 p-7 bg-[#f8fafc] rounded-xl border border-slate-200">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">VALORES BASE</p>
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500 uppercase">SUBTOTAL</span>
                      <span className="text-slate-800">{formatNumber(quote.amount || 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500 uppercase">IMPUESTOS</span>
                      <span className="text-slate-800">0</span>
                    </div>
                    <div className="pt-6 border-t border-slate-300 flex justify-between items-baseline mt-4">
                      <span className="text-sm font-black text-[#1e293b] uppercase tracking-widest">TOTAL</span>
                      <span className="text-4xl font-black text-blue-600">{formatNumber(quote.amount || 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-7 bg-[#f8fafc] rounded-xl border border-slate-200">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">RETENCIONES</p>
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500 uppercase">R. FUENTE</span>
                      <span className="text-slate-800">$ 0,00</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500 uppercase">R. IVA</span>
                      <span className="text-slate-800">$ 0,00</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500 uppercase">R. ICA</span>
                      <span className="text-slate-800">$ 0,00</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-xl overflow-hidden flex flex-col">
                  <div className="p-6 flex-1 border-b border-slate-50">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">ESTADO</p>
                        <span className={`inline-block px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded border ${
                          quote.status === 'aceptada' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          quote.status === 'rechazada' ? 'bg-red-50 text-red-600 border-red-100' :
                          'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>{quote.status}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">VALOR BRUTO</p>
                        <p className="text-xl font-black text-slate-800 leading-none">{formatNumber(quote.amount || 0)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex justify-between items-end bg-slate-50/30">
                    <div>
                      <p className="text-[9px] font-bold text-[#10b981] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> ÚLTIMO CONTACTO
                      </p>
                      <p className="text-xs font-bold text-slate-400 italic">Hoy</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 justify-end">
                         PROBABILIDAD
                      </p>
                      <p className="text-xl font-black text-slate-300 leading-none">80%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {quotes.length === 0 && (
          <div className="py-20 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No hay registros para mostrar</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

