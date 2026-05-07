import { useState, useEffect } from 'react';
import { quoteService, opportunityService } from '../services/dataService';
import { Quote, Opportunity } from '../types';
import { motion } from 'motion/react';
import { Mail, MessageSquare, AlertTriangle, CheckCircle2, MoreVertical, ExternalLink, Briefcase } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

export default function OpportunitiesPanel() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    const unsubQuotes = quoteService.subscribeToQuotes(setQuotes);
    const unsubOpps = opportunityService.subscribeToOpportunities(setOpportunities);
    return () => {
      unsubQuotes();
      unsubOpps();
    };
  }, []);

  const getQuote = (id: string) => quotes.find(q => q.id === id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'seguimiento': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'ganada': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'perdida': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const handleUpdateStatus = async (id: string, status: 'seguimiento' | 'ganada' | 'perdida') => {
    await opportunityService.updateOpportunityStatus(id, status);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Oportunidades Comerciales</h1>
        <p className="text-slate-500 mt-1">Gestión de seguimiento y flujo de retargeting automático.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {opportunities.map((opp) => {
          const quote = getQuote(opp.quoteId);
          if (!quote) return null;

          const daysSinceLastContact = opp.lastContactAt?.toDate 
            ? differenceInDays(new Date(), opp.lastContactAt.toDate()) 
            : 0;
          const isOverdue = daysSinceLastContact >= 3 && opp.status === 'seguimiento';

          return (
            <motion.div
              layout
              key={opp.id}
              className={`bg-white rounded-3xl p-6 shadow-sm border transition-all ${
                isOverdue ? 'border-orange-200 ring-2 ring-orange-500/10' : 'border-slate-100'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="flex-1 min-w-[240px]">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(opp.status)}`}>
                      {opp.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">ID: {opp.id.slice(-6)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{quote.clientName}</h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-slate-500 text-sm">
                    <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {quote.clientEmail}</span>
                    <span className="flex items-center gap-1 capitalize"><CheckCircle2 className="w-4 h-4" /> {quote.type}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 min-w-[200px] border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-2">Último Contacto</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {opp.lastContactAt?.toDate ? format(opp.lastContactAt.toDate(), "d 'de' MMMM", { locale: es }) : '...'}
                  </p>
                  <p className={`text-xs mt-1 font-medium ${isOverdue ? 'text-orange-600 animate-pulse' : 'text-slate-400'}`}>
                    Hace {daysSinceLastContact} días
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleUpdateStatus(opp.id, 'ganada')}
                    className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-colors border border-transparent hover:border-emerald-100"
                    title="Marcar como Ganada"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </button>
                  <div className="h-8 w-px bg-slate-200 mx-2"></div>
                  <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-colors">
                    <MoreVertical className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {isOverdue && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-6 bg-orange-50 rounded-2xl border border-orange-200 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-100 rounded-xl">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-bold text-orange-900 leading-none">Acción de Retargeting Requerida</p>
                      <p className="text-sm text-orange-700 mt-2">Han pasado más de 3 días sin contacto. El sistema sugiere realizar un seguimiento manual.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <a 
                      href={`mailto:${quote.clientEmail}?subject=Seguimiento Cotización - ${quote.type}&body=Hola ${quote.clientName}, quería saber si pudiste revisar la cotización...`}
                      className="flex items-center gap-2 bg-white text-orange-700 border border-orange-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-100 transition-colors"
                    >
                      <Mail className="w-4 h-4" /> Enviar Correo
                    </a>
                    <a 
                      href={`https://wa.me/${quote.clientPhone.replace(/\D/g,'')}?text=Hola%20${encodeURIComponent(quote.clientName)},%20queria%20saber%20si%20pudiste%20revisar%20la%20cotizacion%20que%20te%20enviamos.`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
                    >
                      <MessageSquare className="w-4 h-4" /> Enviar WhatsApp
                    </a>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
        {opportunities.length === 0 && (
          <div className="bg-white rounded-3xl p-20 text-center border border-slate-100 border-dashed">
            <Briefcase className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800">No hay oportunidades activas</h3>
            <p className="text-slate-400 mt-2">Crea una cotización y cámbiala a estado "Enviada" para iniciar el seguimiento.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
