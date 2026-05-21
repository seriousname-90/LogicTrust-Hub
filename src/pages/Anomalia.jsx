import { useState, useEffect } from 'react';
import { 
  ArrowLeftIcon, 
  ArrowUpOnSquareIcon, 
  CloudArrowUpIcon,
  BanknotesIcon,
  CheckIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { MOCK_ANOMALIES } from '../Data/mockData';

export default function Anomalia({ anomalyId, setVista }) {
  // Find anomaly details or fallback to default
  const anomaly = MOCK_ANOMALIES.find(a => a.id === anomalyId) || MOCK_ANOMALIES[0];

  // States
  const [unidades, setUnidades] = useState(anomaly.unidadesPerdidas || 14);
  const [valorUnitario, setValorUnitario] = useState(anomaly.valorUnitario || 450);
  const [responsabilidad, setResponsabilidad] = useState(anomaly.responsable || "Logística Tercerizada (3PL)");
  const [prioridad, setPrioridad] = useState(anomaly.prioridad || "URGENTE");
  const [notas, setNotas] = useState(anomaly.observacion || "");

  // Update states if anomalyId changes
  useEffect(() => {
    setUnidades(anomaly.unidadesPerdidas || 14);
    setValorUnitario(anomaly.valorUnitario || 450);
    setResponsabilidad(anomaly.responsable || "Logística Tercerizada (3PL)");
    setPrioridad(anomaly.prioridad || "URGENTE");
    setNotas(anomaly.observacion || "");
  }, [anomalyId]);

  // Calculate total impact
  const totalImpacto = unidades * valorUnitario;

  // Handle save
  const handleSave = () => {
    alert(`Anomalía #${anomaly.id} registrada con éxito. Estado: ${prioridad}, Responsable: ${responsabilidad}, Impacto: $${totalImpacto.toLocaleString()}`);
    setVista('DASHBOARD');
  };

  // Handle discard
  const handleDiscard = () => {
    if (confirm("¿Está seguro de descartar este reporte de anomalía?")) {
      setVista('DASHBOARD');
    }
  };

  return (
    <div className="p-8 space-y-6 bg-[#f8fafc] min-h-[calc(100vh-4rem)]">
      {/* HEADER WITH BACK BUTTON */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setVista('DASHBOARD')}
            className="p-2 bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2" style={{ color: '#0f172a' }}>
              Captura de Anomalía
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              Operational Command
            </p>
          </div>
        </div>
      </div>

      {/* CRITICAL WARNING BANNER */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-rose-500 text-white rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-rose-800">Anomalía Crítica Detectada</h3>
            <p className="text-xs text-rose-600 font-semibold mt-1">
              Se ha reportado una pérdida de integridad en la carga. El protocolo de auditoría externa se ha activado automáticamente.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black bg-rose-500/10 text-rose-700 px-3 py-1.5 rounded-lg border border-rose-200 whitespace-nowrap self-stretch md:self-auto text-center md:text-left">
          {`ID: AN-${anomaly.id}-X`}
        </span>
      </div>

      {/* MAIN TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: VISUAL EVIDENCE & IMPACT */}
        <div className="lg:col-span-2 space-y-8">
          {/* EVIDENCIA VISUAL */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-base font-black text-slate-800">Evidencia Visual</h2>
              <button className="text-xs font-bold text-[#002d72] flex items-center gap-1 hover:underline">
                <ArrowUpOnSquareIcon className="w-4 h-4" />
                Subir Nueva
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* IMAGE SHOWCASE */}
              <div className="bg-slate-900 rounded-xl aspect-[4/3] overflow-hidden relative border border-slate-800 flex items-center justify-center">
                {/* Stylized custom SVG container lock for visual preview */}
                <svg viewBox="0 0 200 150" className="w-full h-full p-4">
                  {/* Metal container background */}
                  <rect x="10" y="10" width="180" height="130" rx="6" fill="#1e293b" />
                  {/* Vertical metal ridges */}
                  <line x1="40" y1="10" x2="40" y2="140" stroke="#334155" strokeWidth="4" />
                  <line x1="70" y1="10" x2="70" y2="140" stroke="#334155" strokeWidth="4" />
                  <line x1="100" y1="10" x2="100" y2="140" stroke="#475569" strokeWidth="6" />
                  <line x1="130" y1="10" x2="130" y2="140" stroke="#334155" strokeWidth="4" />
                  <line x1="160" y1="10" x2="160" y2="140" stroke="#334155" strokeWidth="4" />
                  
                  {/* Broken lock/seal */}
                  <circle cx="100" cy="75" r="14" fill="none" stroke="#ef4444" strokeWidth="3.5" />
                  <line x1="90" y1="65" x2="110" y2="85" stroke="#ef4444" strokeWidth="3.5" />
                  
                  {/* Highlight indicator circle */}
                  <circle cx="100" cy="75" r="24" fill="none" stroke="#e11d48" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>
                <span className="absolute bottom-3 left-3 text-[9px] font-black uppercase text-rose-500 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30 backdrop-blur-sm">
                  Cierre de Seguridad Violado
                </span>
              </div>

              {/* DROPZONE */}
              <div className="border-2 border-dashed border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/10 rounded-xl aspect-[4/3] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all">
                <CloudArrowUpIcon className="w-10 h-10 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-700">Arrastrar archivo aquí</span>
                <span className="text-[10px] text-slate-400 mt-1">Soporta PNG, JPG o PDF de hasta 10MB</span>
              </div>
            </div>
          </div>

          {/* IMPACTO FINANCIERO Y UNIDADES */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-base font-black text-slate-800 border-b pb-3">Impacto Financiero y Unidades</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Pérdida de Unidades
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={unidades}
                    onChange={(e) => setUnidades(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-[#002d72] focus:bg-white transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">
                    Unidades
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold mt-1.5 block">
                  Basado en el manifiesto de carga #772
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Valor Unitario (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-extrabold text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    value={valorUnitario}
                    onChange={(e) => setValorUnitario(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-7 pr-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-[#002d72] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* ESTIMATED TOTAL BOX */}
            <div className="bg-[#002d72] text-white p-5 rounded-2xl flex justify-between items-center shadow-md shadow-[#002d72]/10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                  Impacto Total Estimado
                </p>
                <p className="text-3xl font-black mt-1">
                  {`$${totalImpacto.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </p>
              </div>
              <div className="p-3 bg-white/10 rounded-xl">
                <BanknotesIcon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: RESPONSIBILITY & TIMELINE */}
        <div className="space-y-8">
          
          {/* GESTIÓN DE RESPONSABILIDAD */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
            <h2 className="text-base font-black text-slate-800 border-b pb-3">Gestión de Responsabilidad</h2>
            
            <div className="space-y-4">
              {/* ASIGNAR RESPONSABILIDAD */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Asignar Responsabilidad
                </label>
                <select
                  value={responsabilidad}
                  onChange={(e) => setResponsabilidad(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#002d72]"
                >
                  <option value="Logística Tercerizada (3PL)">Logística Tercerizada (3PL)</option>
                  <option value="Personal de Rampa">Personal de Rampa</option>
                  <option value="Equipo de Seguridad">Equipo de Seguridad</option>
                  <option value="Transporte Interno">Transporte Interno</option>
                </select>
              </div>

              {/* PRIORIDAD DE RESOLUCIÓN */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Prioridad de Resolución
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['ESTÁNDAR', 'URGENTE', 'CRÍTICO'].map((prio) => (
                    <button
                      key={prio}
                      type="button"
                      onClick={() => setPrioridad(prio)}
                      className={`py-2 rounded-xl text-[10px] font-black border transition-all cursor-pointer ${
                        prioridad === prio
                          ? prio === 'CRÍTICO'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                            : prio === 'URGENTE'
                            ? 'bg-[#002d72] text-white border-[#002d72] shadow-sm'
                            : 'bg-slate-700 text-white border-slate-700 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {prio}
                    </button>
                  ))}
                </div>
              </div>

              {/* NOTAS DEL AUDITOR */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Notas del Auditor
                </label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Describa el estado de los sellos, condiciones climáticas y cualquier observación pertinente..."
                  rows={4}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#002d72] focus:bg-white resize-none"
                ></textarea>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleSave}
                className="w-full bg-[#002d72] hover:bg-[#002060] text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <CheckIcon className="w-4.5 h-4.5 stroke-[2.5]" />
                Registrar Anomalía
              </button>
              <button
                onClick={handleDiscard}
                className="w-full bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <TrashIcon className="w-4.5 h-4.5" />
                Descartar Reporte
              </button>
            </div>
          </div>

          {/* HISTORIAL DEL EVENTO */}
          <div className="bg-[#f0f4fa]/70 border border-[#e2e8f0] p-6 rounded-2xl space-y-4">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
              Historial del Evento
            </h2>
            
            <div className="relative border-l-2 border-slate-200 pl-4 space-y-5 ml-1 text-xs">
              {anomaly.historial ? anomaly.historial.map((hist, i) => (
                <div key={i} className="relative">
                  {/* Timeline bullet dot */}
                  <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
                    i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-rose-500' : 'bg-blue-500'
                  }`}></span>
                  <div className="flex justify-between items-baseline gap-2">
                    <p className="font-extrabold text-slate-800">{hist.evento}</p>
                    <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{hist.hora}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">{hist.detalle}</p>
                </div>
              )) : (
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white bg-blue-500"></span>
                  <p className="font-extrabold text-slate-800">Captura Manual Requerida</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">Ahora - Esperando Auditor</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
