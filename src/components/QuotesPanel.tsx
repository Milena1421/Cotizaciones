import { useState, useEffect } from 'react';
import { quoteService } from '../services/dataService';
import { Quote } from '../types';
import { motion } from 'motion/react';
import { FileText, Plus, Search, Filter, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export default function QuotesPanel() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filter, setFilter] = useState<string>('todas');
  const navigate = useNavigate();

  useEffect(() => {
    return quoteService.subscribeToQuotes(setQuotes);
  }, []);

  const filteredQuotes = quotes.filter(q => filter === 'todas' || q.status === filter);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <header className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Gestión de Cotizaciones</h1>
          <p className="text-slate-500 mt-1">Crea, edita y envía tus propuestas comerciales.</p>
        </div>
        <button
          onClick={() => navigate('/new-quote')}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Nueva Cotización
        </button>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Buscar cliente..." className="bg-transparent border-none focus:outline-none text-sm w-full" />
          </div>
          <div className="flex gap-2">
            {['todas', 'pendiente', 'enviada', 'aceptada'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                  filter === f ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                <th className="px-8 py-4">Cliente / Contacto</th>
                <th className="px-8 py-4">Servicio</th>
                <th className="px-8 py-4">Detalles</th>
                <th className="px-8 py-4">Estado</th>
                <th className="px-8 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="font-bold text-slate-800 leading-tight">{quote.clientName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{quote.clientEmail}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <span className="capitalize text-sm font-semibold text-slate-700">{quote.type}</span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded uppercase font-bold tracking-tight">{quote.platform}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-xs text-slate-500 leading-relaxed font-medium">
                      <span className="capitalize">{quote.modality}</span> • {quote.userVolume} pers.<br/>
                      <span className="capitalize">{quote.location}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      quote.status === 'enviada' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                      quote.status === 'pendiente' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                      quote.status === 'aceptada' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                      'bg-slate-50 border-slate-100 text-slate-600'
                    }`}>
                      {quote.status === 'enviada' && <Clock className="w-3 h-3" />}
                      {quote.status === 'aceptada' && <CheckCircle className="w-3 h-3" />}
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    {quote.status === 'pendiente' ? (
                      <button 
                        onClick={() => quoteService.updateQuoteStatus(quote.id, 'enviada')}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-600/10 flex items-center gap-2 active:scale-95"
                      >
                        <Send className="w-3 h-3" />
                        Enviar Ahora
                      </button>
                    ) : (
                      <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        Gestionada
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredQuotes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="max-w-xs mx-auto">
                      <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400 font-medium">No se encontraron cotizaciones con este filtro.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
