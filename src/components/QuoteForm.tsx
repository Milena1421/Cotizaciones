import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quoteService } from '../services/dataService';
import { QuoteType, Modality, UserVolume, LocationType, EnvironmentType, TechPlatformType } from '../types';
import { motion } from 'motion/react';
import { Save, AlertCircle, ChevronRight, Check } from 'lucide-react';

export default function QuoteForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: 'bootcamp' as QuoteType,
    modality: 'presencial' as Modality,
    userVolume: '<50' as UserVolume,
    location: 'metropolitana' as LocationType,
    environment: 'google' as EnvironmentType,
    techPlatform: 'claude' as TechPlatformType,
    clientName: '',
    clientNit: '',
    clientEmail: '',
    clientPhone: '',
    amount: 0,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await quoteService.createQuote(formData);
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const isFormValid = formData.clientName && formData.clientNit && formData.clientEmail && formData.clientPhone;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto"
    >
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Nueva Cotización</h1>
        <p className="text-slate-500 mt-1">Configura los parámetros del servicio para generar el documento.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
        <div className="flex bg-slate-50 p-4 gap-4 border-b border-slate-100">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              <span className={`text-sm font-medium ${step >= s ? 'text-slate-800' : 'text-slate-400'}`}>
                {s === 1 ? 'Parámetros' : 'Datos del Cliente'}
              </span>
              {s === 1 && <ChevronRight className="w-4 h-4 text-slate-300" />}
            </div>
          ))}
        </div>

        <div className="p-10">
          {step === 1 && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">Tipo de Cotización</label>
                  <div className="flex flex-col gap-2">
                    {['bootcamp', 'cursos', 'crea academy'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: type as QuoteType })}
                        className={`text-left px-5 py-3 rounded-xl border-2 transition-all ${
                          formData.type === type ? 'border-blue-600 bg-blue-50 text-blue-700 animate-pulse-subtle' : 'border-slate-100 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <span className="capitalize font-medium">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">Entorno</label>
                  <div className="flex gap-4">
                    {['google', 'microsoft'].map((env) => (
                      <button
                        key={env}
                        type="button"
                        onClick={() => setFormData({ ...formData, environment: env as EnvironmentType })}
                        className={`flex-1 px-5 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                          formData.environment === env ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <span className="capitalize font-bold">{env}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">Tipo de Plataformas</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['claude', 'notebooklm', 'google ai studio', 'otros'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFormData({ ...formData, techPlatform: p as TechPlatformType })}
                        className={`px-4 py-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center ${
                          formData.techPlatform === p ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <span className="capitalize font-bold text-xs">{p}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">Modalidad</label>
                  <select 
                    value={formData.modality}
                    onChange={(e) => setFormData({ ...formData, modality: e.target.value as Modality })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  >
                    <option value="presencial">Presencial</option>
                    <option value="virtual">Virtual</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">Volumen de Usuarios</label>
                  <select 
                    value={formData.userVolume}
                    onChange={(e) => setFormData({ ...formData, userVolume: e.target.value as UserVolume })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  >
                    <option value="<50">&lt; 50 personas</option>
                    <option value=">50">&gt; 50 personas</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">Ubicación</label>
                  <select 
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value as LocationType })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  >
                    <option value="metropolitana">Área Metropolitana</option>
                    <option value="fuera">Fuera del área</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 font-mono tracking-tighter uppercase">Nombre de la Empresa / Cliente</label>
                <input
                  required
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Ej. ACME Corp"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 font-mono tracking-tighter uppercase">NIT de la Empresa</label>
                <input
                  required
                  type="text"
                  value={formData.clientNit}
                  onChange={(e) => setFormData({ ...formData, clientNit: e.target.value })}
                  placeholder="900.000.000-1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 font-mono tracking-tighter uppercase">Correo Electrónico</label>
                  <input
                    required
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder="cliente@ejemplo.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 font-mono tracking-tighter uppercase">Teléfono de Contacto</label>
                  <input
                    required
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    placeholder="+54 9 11 0000-0000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 font-mono tracking-tighter uppercase">Valor de la Cotización</label>
                <div className="relative">
                  <input
                    required
                    type="number"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 font-black text-lg"
                  />
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900">Resumen de Seguimiento</p>
                  <p className="text-xs text-blue-700 mt-1">Al enviar esta cotización, se creará automáticamente una oportunidad de seguimiento en el CRM con alerta de retargeting a los 3 días.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between">
          {step === 2 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-8 py-3 text-slate-600 font-semibold hover:bg-slate-200 rounded-xl transition-colors"
            >
              Atrás
            </button>
          )}
          <div className="ml-auto">
            {step === 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-10 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-10 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 active:scale-95"
              >
                {loading ? 'Procesando...' : (
                  <>
                    <Save className="w-5 h-5" />
                    Guardar Cotización
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </motion.div>
  );
}
