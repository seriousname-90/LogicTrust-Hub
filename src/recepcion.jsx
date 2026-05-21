import { useState } from 'react';
import { 
  QrCodeIcon, 
  ArrowDownTrayIcon, 
  CheckIcon,
  ExclamationTriangleIcon,
  FolderMinusIcon,
  PhotoIcon,
  CameraIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { INITIAL_PALLETS } from './Data/mockData';

export default function Recepcion({ tarimas: appTarimas, numeroFactura, numeroTrailer, ajustarCantidadTienda }) {
  // Convert appTarimas (e.g. TARIMA #01) to the PLT format if they are created dynamically,
  // or merge them with our rich INITIAL_PALLETS list.
  const [pallets, setPallets] = useState(() => {
    // If there are dynamic tarimas in App state that aren't in INITIAL_PALLETS, add them
    const list = [...INITIAL_PALLETS];
    appTarimas.forEach(at => {
      if (!list.some(p => p.id === at.id)) {
        list.push({
          id: at.id,
          nombre: `Pallet Carga CEDIS`,
          peso: "350kg",
          estado: "OK",
          productos: at.productos
        });
      }
    });
    return list;
  });

  // Selected pallet ID for the detailed right side panel
  const [selectedPalletId, setSelectedPalletId] = useState('PLT-2042');
  const [filterMode, setFilterMode] = useState('Todos'); // 'Todos' or 'Pendientes'
  const [inspectionNotes, setInspectionNotes] = useState('');

  // Handle pallet action toggles
  const handlePalletStatus = (id, type) => {
    setPallets(prev => prev.map(p => {
      if (p.id === id) {
        let newStatus = p.estado;
        if (type === 'danado') {
          newStatus = p.estado === 'DAÑADO' ? 'OK' : 'DAÑADO';
        } else if (type === 'faltante') {
          newStatus = p.estado === 'FALTANTE' ? 'OK' : 'FALTANTE';
        }
        return { ...p, estado: newStatus };
      }
      return p;
    }));
  };

  const activePallet = pallets.find(p => p.id === selectedPalletId) || pallets[0];

  // Derived metrics
  const totalPallets = pallets.length;
  const verifiedCount = pallets.filter(p => p.estado === 'OK' || p.estado === 'VERIFICADO').length;
  const issueCount = pallets.filter(p => p.estado === 'DAÑADO' || p.estado === 'FALTANTE').length;
  const pendingCount = totalPallets - verifiedCount - issueCount;

  // Filter list
  const filteredPallets = pallets.filter(p => {
    if (filterMode === 'Pendientes') {
      return p.estado === 'EN PROCESO';
    }
    return true;
  });

  const handleFinalize = () => {
    alert(`Recepción Finalizada.\nTotal Pallets: ${totalPallets}\nConfirmados OK: ${verifiedCount}\nReportados Daño/Faltante: ${issueCount}`);
  };

  return (
    <div className="p-8 space-y-6 bg-[#f8fafc] min-h-[calc(100vh-4rem)]">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3.5">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: '#0f172a' }}>Auditoría de Llegada</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              Operational Command
            </p>
          </div>
          <span className="text-xs font-bold bg-[#e8eef8] text-[#002d72] px-3.5 py-1.5 rounded-full border border-[#002d72]/15 uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Envío: #{numeroTrailer || "TRK-8829-XL"}
          </span>
        </div>

        {/* Action Header Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => alert("Escáner de cámara activado... (Simulado)")}
            className="flex-1 md:flex-none px-4 py-2.5 bg-[#002d72] hover:bg-[#002060] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#002d72]/10 cursor-pointer"
          >
            <QrCodeIcon className="w-4.5 h-4.5 stroke-[2.5]" />
            Escanear QR
          </button>
          <button 
            onClick={() => alert("Descargando informe en PDF... (Simulado)")}
            className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <ArrowDownTrayIcon className="w-4.5 h-4.5" />
            Descargar Informe
          </button>
        </div>
      </div>

      {/* MANIFEST INFO ROW */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">
            Manifiesto de Carga: M-9042
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            {verifiedCount + issueCount}/{totalPallets} Pallets Verificados
          </p>
        </div>
        <div className="w-full md:w-80 flex items-center gap-3">
          <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
              style={{ width: `${((verifiedCount + issueCount) / totalPallets) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold text-slate-700">
            {Math.round(((verifiedCount + issueCount) / totalPallets) * 100)}%
          </span>
        </div>
      </div>

      {/* TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Detalle de Pallets */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between min-h-[460px]">
            <div>
              {/* Card Header & Tabs */}
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-[#fafbfc]">
                <h2 className="text-base font-black text-slate-800 uppercase tracking-wide">
                  Detalle de Pallets
                </h2>
                
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                  {['Todos', 'Pendientes'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilterMode(tab)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        filterMode === tab 
                          ? 'bg-white text-[#002d72] shadow-sm' 
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pallet Cards List */}
              <div className="p-5 divide-y divide-slate-100">
                {filteredPallets.map((p) => {
                  const isSelected = selectedPalletId === p.id;
                  
                  return (
                    <div 
                      key={p.id}
                      onClick={() => setSelectedPalletId(p.id)}
                      className={`py-4 px-3 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all duration-200 cursor-pointer rounded-xl border-2 my-1 ${
                        isSelected 
                          ? 'border-[#002d72] bg-[#f0f4fa]/30' 
                          : 'border-transparent hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Icon Block */}
                        <div className={`p-2.5 rounded-xl ${
                          p.estado === 'DAÑADO' 
                            ? 'bg-rose-50 text-rose-500' 
                            : p.estado === 'FALTANTE' 
                            ? 'bg-amber-50 text-amber-500' 
                            : p.estado === 'OK' || p.estado === 'VERIFICADO'
                            ? 'bg-emerald-50 text-emerald-500'
                            : 'bg-indigo-50 text-indigo-500'
                        }`}>
                          {p.estado === 'DAÑADO' ? (
                            <ExclamationTriangleIcon className="w-5.5 h-5.5" />
                          ) : p.estado === 'FALTANTE' ? (
                            <FolderMinusIcon className="w-5.5 h-5.5" />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5.5 h-5.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                            </svg>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-800 text-sm">{p.id}</span>
                            
                            {/* Badges */}
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wide border ${
                              p.estado === 'DAÑADO'
                                ? 'bg-rose-50 text-rose-600 border-rose-100'
                                : p.estado === 'FALTANTE'
                                ? 'bg-amber-50 text-amber-600 border-amber-100'
                                : p.estado === 'OK'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                : p.estado === 'VERIFICADO'
                                ? 'bg-slate-50 text-slate-600 border-slate-200'
                                : 'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                              {p.estado}
                            </span>
                          </div>
                          <p className="text-slate-400 font-semibold text-[10px] mt-0.5">
                            {p.nombre} - {p.peso}
                          </p>
                        </div>
                      </div>

                      {/* Right Action buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
                        {p.estado === 'VERIFICADO' ? (
                          <div className="flex items-center gap-1 text-emerald-600 font-extrabold text-[11px] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl shadow-sm">
                            <CheckIcon className="w-4 h-4 stroke-[3]" />
                            Verificado
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handlePalletStatus(p.id, 'danado')}
                              className={`px-3 py-1.5 rounded-xl border text-[11px] font-black transition-all cursor-pointer ${
                                p.estado === 'DAÑADO'
                                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                              }`}
                            >
                              ⚠️ Daño
                            </button>
                            <button
                              onClick={() => handlePalletStatus(p.id, 'faltante')}
                              className={`px-3 py-1.5 rounded-xl border text-[11px] font-black transition-all cursor-pointer ${
                                p.estado === 'FALTANTE'
                                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200'
                              }`}
                            >
                              ✕ Faltante
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Camera evidence & Final summary */}
        <div className="space-y-6">
          
          {/* EVIDENCIA FOTOGRÁFICA PANEL */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b pb-2 flex items-center gap-1.5">
              <PhotoIcon className="w-4 h-4 text-indigo-600" />
              Evidencia Fotográfica
            </h2>

            {/* Photo Preview based on active pallet */}
            {activePallet.estado === 'DAÑADO' ? (
              <div className="space-y-3">
                {/* Collapsed boxes drawing */}
                <div className="bg-slate-900 rounded-xl aspect-[16/10] relative overflow-hidden border border-slate-800 flex items-center justify-center p-2">
                  <svg viewBox="0 0 160 100" className="w-full h-full opacity-80">
                    <rect x="20" y="40" width="50" height="50" fill="#a16207" rx="3" />
                    {/* Collapsed cardboard box */}
                    <path d="M 80 90 L 130 90 L 140 70 L 90 60 Z" fill="#78350f" />
                    <line x1="80" y1="90" x2="105" y2="75" stroke="#451a03" strokeWidth="2" />
                    
                    {/* Crack indicator */}
                    <path d="M 100 80 L 110 70 L 105 65" fill="none" stroke="#ef4444" strokeWidth="2" />
                  </svg>
                  <span className="absolute bottom-2 left-2 text-[8px] font-black uppercase text-rose-500 bg-rose-950/80 px-2 py-0.5 rounded">
                    PLT-2042: Daño Reportado
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-xl aspect-[16/10] relative overflow-hidden border border-slate-800 flex items-center justify-center p-2 text-center text-slate-500">
                <svg viewBox="0 0 160 100" className="w-full h-full p-4">
                  {/* Styled plastic wrapped pallet */}
                  <rect x="35" y="25" width="90" height="55" fill="#e2e8f0" fillOpacity="0.1" rx="4" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                  <rect x="40" y="30" width="38" height="22" fill="#78350f" rx="2" />
                  <rect x="82" y="30" width="38" height="22" fill="#78350f" rx="2" />
                  <rect x="40" y="55" width="38" height="22" fill="#78350f" rx="2" />
                  <rect x="82" y="55" width="38" height="22" fill="#78350f" rx="2" />
                  {/* Wooden pallet base */}
                  <rect x="30" y="80" width="100" height="6" fill="#a16207" rx="1" />
                </svg>
                <span className="absolute bottom-2 left-2 text-[8px] font-black uppercase text-emerald-400 bg-slate-950/80 px-2 py-0.5 rounded">
                  {activePallet.id}: Carga Segura
                </span>
              </div>
            )}

            {/* Photo Grid upload controls */}
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => alert("Activando cámara para tomar foto... (Simulado)")}
                className="border border-dashed border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/10 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all aspect-[4/3]"
              >
                <CameraIcon className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-[10px] font-bold text-slate-700">AÑADIR</span>
              </div>
              <div className="bg-slate-100 rounded-xl relative border overflow-hidden aspect-[4/3] flex items-center justify-center">
                {/* Secondary mockup picture */}
                <svg viewBox="0 0 100 75" className="w-full h-full opacity-60">
                  <rect width="100" height="75" fill="#475569" />
                  <circle cx="50" cy="37" r="10" fill="#334155" />
                </svg>
              </div>
            </div>

            {/* Inspections notes */}
            <div>
              <textarea
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
                placeholder="Notas de la inspección (opcional)..."
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#002d72] focus:bg-white resize-none"
              ></textarea>
            </div>
          </div>

          {/* RESUMEN FINAL PANEL */}
          <div className="bg-[#f0f4fa]/70 border border-[#e2e8f0] p-5 rounded-2xl space-y-4">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Resumen Final</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Revise todos los puntos antes de finalizar.
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between font-semibold border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Pallets Totales:</span>
                <span className="text-slate-800 font-bold">{totalPallets}</span>
              </div>
              <div className="flex justify-between font-semibold border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Confirmados OK:</span>
                <span className="text-emerald-600 font-black">{verifiedCount}</span>
              </div>
              <div className="flex justify-between font-semibold border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Reportados Daño/Faltante:</span>
                <span className="text-rose-600 font-black">{issueCount}</span>
              </div>
            </div>

            <button
              onClick={handleFinalize}
              className="w-full bg-[#002d72] hover:bg-[#002060] text-white text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#002d72]/15 cursor-pointer"
            >
              <CheckIcon className="w-4.5 h-4.5 stroke-[2.5]" />
              Finalizar Recepción
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
