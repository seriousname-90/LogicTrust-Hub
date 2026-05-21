import { 
  ArrowUpRightIcon, 
  ArrowDownRightIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClipboardDocumentListIcon,
  MapIcon,
  ArrowRightIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { MOCK_ANOMALIES } from '../Data/mockData';

export default function Dashboard({ setVista, setSelectedAnomalyId }) {
  // Handler to view an anomaly
  const handleViewEvidence = (id) => {
    setSelectedAnomalyId(id);
    setVista('ANOMALIA');
  };

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-[calc(100vh-4rem)]">
      {/* PAGE HEADER */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: '#0f172a' }}>Panel Ejecutivo</h1>
        <p className="text-sm text-slate-500 font-medium mt-1.5">
          Resumen operativo de LogiTrust Hub para hoy, 24 de Mayo.
        </p>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SHRINKAGE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-start card-hover transition-all">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Shrinkage Today</p>
            <p className="text-3xl font-black text-slate-900 mt-2">$12,450.00</p>
            <div className="flex items-center gap-1 mt-2 text-rose-600 font-bold text-xs">
              <ArrowUpRightIcon className="w-3.5 h-3.5" />
              <span>+2.4% vs promedio diario</span>
            </div>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl text-rose-500">
            <ArrowDownRightIcon className="w-6 h-6 rotate-90" />
          </div>
        </div>

        {/* EFFICIENCY GAIN */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-start card-hover transition-all">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Efficiency Gain</p>
            <p className="text-3xl font-black text-[#0f172a] mt-2">84.2%</p>
            <div className="flex items-center gap-1 mt-2 text-emerald-600 font-bold text-xs">
              <CheckCircleIcon className="w-3.5 h-3.5" />
              <span>Meta alcanzada (80%)</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500">
            <CheckCircleIcon className="w-6 h-6" />
          </div>
        </div>

        {/* PENDING CLAIMS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-start card-hover transition-all">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Claims</p>
            <p className="text-3xl font-black text-slate-900 mt-2">18</p>
            <div className="flex items-center gap-1 mt-2 text-indigo-600 font-bold text-xs">
              <ExclamationCircleIcon className="w-3.5 h-3.5" />
              <span>5 requieren atención urgente</span>
            </div>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl text-[#002d72]">
            <ClipboardDocumentListIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* RECENT ANOMALIES TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#fafbfc]">
          <h2 className="text-lg font-bold text-slate-900">Recent Anomalies</h2>
          <button className="text-xs font-bold text-[#002d72] hover:text-[#002060] flex items-center gap-1 hover:underline">
            Exportar Todo
            <ShareIcon className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100">
                <th className="px-6 py-3.5">ID AUDITORÍA</th>
                <th className="px-6 py-3.5">UBICACIÓN / OPERACIÓN</th>
                <th className="px-6 py-3.5">ESTADO</th>
                <th className="px-6 py-3.5">FECHA / HORA</th>
                <th className="px-6 py-3.5 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_ANOMALIES.map((anomaly) => (
                <tr key={anomaly.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{`#${anomaly.id}`}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{anomaly.ubicacion}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{anomaly.operacion}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wide ${
                      anomaly.estado === 'Discrepancy' 
                        ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                        : anomaly.estado === 'Unplanned Departure' 
                        ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {anomaly.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-500">{anomaly.fecha}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleViewEvidence(anomaly.id)}
                      className="px-3.5 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                    >
                      View Evidence
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTTOM SECTION: MAP & FLEET */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CRITICAL LOCATIONS (Map) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-indigo-600" />
              Ubicaciones Críticas
            </h2>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              Mapa de Calor Operativo
            </span>
          </div>

          {/* FUTURISTIC MAP INTERACTIVE MOCK (SVG) */}
          <div className="bg-slate-900 rounded-xl overflow-hidden aspect-[16/9] relative border border-slate-800">
            <svg viewBox="0 0 800 450" className="w-full h-full opacity-80">
              {/* Grid Background */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.3" />
                </pattern>
                <radialGradient id="alertGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="#0f172a" />
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Waterway */}
              <path d="M-100 150 C300 150, 400 300, 900 300" fill="none" stroke="#1e293b" strokeWidth="60" opacity="0.5" />
              <path d="M-100 150 C300 150, 400 300, 900 300" fill="none" stroke="#38bdf8" strokeWidth="6" opacity="0.4" />

              {/* Streets / Routes */}
              <path d="M 50 0 L 50 450 M 200 0 L 200 450 M 350 0 L 350 450 M 500 0 L 500 450 M 650 0 L 650 450 M 800 0 L 800 450" stroke="#1e293b" strokeWidth="3" opacity="0.5" />
              <path d="M 0 80 L 800 80 M 0 200 L 800 200 M 0 320 L 800 320" stroke="#1e293b" strokeWidth="3" opacity="0.5" />
              
              {/* Secondary Diagonal Streets */}
              <path d="M -100 -100 L 900 450 M 900 -100 L -100 450" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />

              {/* Green / Normal Nodes */}
              <circle cx="200" cy="80" r="6" fill="#10b981" opacity="0.8" />
              <circle cx="500" cy="200" r="6" fill="#10b981" opacity="0.8" />
              <circle cx="650" cy="320" r="6" fill="#10b981" opacity="0.8" />
              <circle cx="350" cy="320" r="6" fill="#3b82f6" opacity="0.8" /> {/* In Audit */}

              {/* RED/ALERT CRITICAL NODE */}
              <g className="animate-pulse">
                <circle cx="350" cy="200" r="45" fill="url(#alertGlow)" />
                <circle cx="350" cy="200" r="12" fill="#ef4444" fillOpacity="0.3" />
                <circle cx="350" cy="200" r="6" fill="#ef4444" />
              </g>
              
              {/* Labels */}
              <text x="212" y="84" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Muelle 04</text>
              <text x="512" y="204" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Warehouse Beta</text>
              <text x="662" y="324" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Peaje Norte</text>
            </svg>

            {/* Warning Callout Box Overlay */}
            <div className="absolute top-1/4 left-[46%] bg-slate-950/90 border border-rose-500/50 p-3 rounded-lg shadow-xl text-left backdrop-blur-sm pointer-events-none">
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Terminal Central</p>
              <h3 className="text-xs font-black text-white mt-0.5">Nivel de Alerta: Alto</h3>
              <p className="text-[9px] text-slate-400 mt-1 font-medium">12 Anomalías reportadas</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-semibold mt-4 text-center">
            ⚠️ Se detectó un incremento de discrepancias del <span className="text-rose-600 font-extrabold">15%</span> en la <span className="text-slate-800 font-bold">Terminal Central</span> durante el turno nocturno.
          </p>
        </div>

        {/* FLEET DISTRIBUTION */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900">Distribución de Flotas</h2>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Estado en tiempo real
              </span>
            </div>

            {/* PROGRESS BARS */}
            <div className="space-y-6">
              {/* En Ruta */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">En Ruta (Seguro)</span>
                  <span className="text-[#002d72]">72%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: '72%' }}></div>
                </div>
              </div>

              {/* En Auditoria */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">En Auditoría</span>
                  <span className="text-slate-600">18%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#002d72] rounded-full transition-all duration-500" style={{ width: '18%' }}></div>
                </div>
              </div>

              {/* En Incidencia */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">En Incidencia</span>
                  <span className="text-rose-600">10%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full mt-6 bg-[#002d72] hover:bg-[#002060] text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm">
            Ver Reporte Detallado de Flotas
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
