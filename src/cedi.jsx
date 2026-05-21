import { useState } from 'react';
import { 
  ClipboardIcon, 
  QrCodeIcon, 
  ClockIcon, 
  PlusIcon,
  CheckCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function Cedi({
  numeroTrailer,
  setNumeroTrailer,
  numeroContenedor,
  setNumeroContenedor,
  numeroFactura,
  setNumeroFactura,
  tarimas,
  crearNuevaTarima,
  tarimaDestino,
  setTarimaDestino,
  productoSeleccionado,
  setProductoSeleccionado,
  cantidadAñadir,
  setCantidadAñadir,
  añadirProductoATarima,
  productosDisponibles
}) {
  const [driverName, setDriverName] = useState('Juan Pérez Rodríguez');
  const [loadingDock, setLoadingDock] = useState('Dock A-12');
  const [qrScanInput, setQrScanInput] = useState('');

  // Count metrics
  const totalPallets = tarimas.length;
  // Calculate total items sent
  const totalItems = tarimas.reduce((acc, t) => acc + t.productos.reduce((sum, p) => sum + p.enviado, 0), 0);

  // Handle Quick QR Scan
  const handleQrScan = (e) => {
    e.preventDefault();
    if (!qrScanInput) return;
    
    // Quick scan code: if we match a product code, we add it to the active tarima
    const matchedProduct = productosDisponibles.find(
      p => p.id.toLowerCase() === qrScanInput.toLowerCase() || p.nombre.toLowerCase().includes(qrScanInput.toLowerCase())
    );

    if (matchedProduct) {
      setProductoSeleccionado(matchedProduct.id);
      alert(`Producto escaneado: ${matchedProduct.nombre}. Haga clic en 'Asignar Ítem' o se asignará automáticamente 1 unidad.`);
      
      // Auto assign 1 unit to the active destination tarima
      if (tarimas.length > 0) {
        setQrScanInput('');
        // Trigger assign logic or state helper
        setCantidadAñadir(1);
        setTimeout(() => {
          añadirProductoATarima();
        }, 100);
      } else {
        alert("Primero debe agregar una tarima virtual para recibir los productos.");
      }
    } else {
      alert(`Código QR "${qrScanInput}" no reconocido. Intente con: P1, P2, P3, P4, P5, P6`);
    }
  };

  return (
    <div className="p-8 space-y-6 bg-[#f8fafc] min-h-[calc(100vh-4rem)]">
      {/* PAGE TITLE */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: '#0f172a' }}>Despacho de Origen (CEDIS)</h1>
        <p className="text-sm text-slate-500 font-medium mt-1.5">
          Registro de salida y consolidación de carga crítica.
        </p>
      </div>

      {/* TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Travel Info & Metrics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* INFORMACIÓN DEL VIAJE CARD */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-[#e8eef8] px-6 py-4 border-b border-slate-150">
              <h2 className="text-base font-extrabold text-[#002d72]">Información del Viaje</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trailer ID */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Trailer ID
                  </label>
                  <input
                    type="text"
                    value={numeroTrailer}
                    onChange={(e) => setNumeroTrailer(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#002d72] focus:bg-white transition-all"
                  />
                </div>
                {/* Container ID */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Container ID
                  </label>
                  <input
                    type="text"
                    value={numeroContenedor}
                    onChange={(e) => setNumeroContenedor(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#002d72] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Invoice Number */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Número de Factura / Remisión
                </label>
                <input
                  type="text"
                  value={numeroFactura}
                  onChange={(e) => setNumeroFactura(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#002d72] focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Driver Name */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Nombre del Conductor
                  </label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#002d72] focus:bg-white transition-all"
                  />
                </div>
                {/* Loading Dock */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Muelle de Carga
                  </label>
                  <select
                    value={loadingDock}
                    onChange={(e) => setLoadingDock(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#002d72]"
                  >
                    <option value="Dock A-12">Dock A-12</option>
                    <option value="Dock B-05">Dock B-05</option>
                    <option value="Dock C-09">Dock C-09</option>
                    <option value="Dock D-15">Dock D-15</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* LOWER TRIP METRICS */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#e8eef8]/50 border border-[#ccd9ed] p-5 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
              <ClipboardIcon className="w-5 h-5 text-[#002d72] mb-1.5" />
              <span className="text-2xl font-black text-[#0f172a]">{totalPallets}</span>
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mt-0.5">Pallets Totales</span>
            </div>
            <div className="bg-[#e8eef8]/50 border border-[#ccd9ed] p-5 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
              <QrCodeIcon className="w-5 h-5 text-emerald-600 mb-1.5" />
              <span className="text-2xl font-black text-[#0f172a]">{totalItems}</span>
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mt-0.5">QRs Escaneados</span>
            </div>
            <div className="bg-[#e8eef8]/50 border border-[#ccd9ed] p-5 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
              <ClockIcon className="w-5 h-5 text-rose-500 mb-1.5" />
              <span className="text-2xl font-black text-[#0f172a]">00:15</span>
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mt-0.5">Tiempo Carga</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Virtual Pallets Control */}
        <div className="space-y-6">
          
          {/* PALLETS VIRTUALES PANEL */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col min-h-[420px] justify-between overflow-hidden">
            <div>
              {/* PANEL HEADER */}
              <div className="bg-[#e8eef8] px-5 py-4 border-b border-slate-150 flex justify-between items-center">
                <h2 className="text-base font-extrabold text-[#002d72]">Pallets Virtuales</h2>
                <button 
                  onClick={crearNuevaTarima}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 transition-all shadow-sm shadow-emerald-600/10 cursor-pointer"
                >
                  <PlusIcon className="w-3.5 h-3.5 stroke-[3]" />
                  Agregar Pallet
                </button>
              </div>

              {/* PALLET LIST OR EMPTY STATE */}
              <div className="p-4 overflow-y-auto max-h-[300px] space-y-3">
                {tarimas.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-slate-300 mb-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                    </svg>
                    <p className="text-xs font-bold text-slate-600">No hay pallets registrados aún.</p>
                    <p className="text-[10px] text-slate-400 mt-1">Cree un pallet con el botón de arriba.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Add Items to Selected Pallet Form inside the list to make it fully functional! */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-3">
                      <p className="text-[9px] font-black uppercase text-indigo-600 tracking-wider">Añadir Ítems a Pallet</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <label className="text-[8px] font-bold text-slate-400 block mb-1">Pallet Destino</label>
                          <select 
                            value={tarimaDestino} 
                            onChange={(e) => setTarimaDestino(e.target.value)}
                            className="w-full p-1.5 bg-white border border-slate-200 rounded font-medium"
                          >
                            {tarimas.map(t => <option key={t.id} value={t.id}>{t.id}</option>)}
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-[8px] font-bold text-slate-400 block mb-1">Producto</label>
                          <select 
                            value={productoSeleccionado} 
                            onChange={(e) => setProductoSeleccionado(e.target.value)}
                            className="w-full p-1.5 bg-white border border-slate-200 rounded font-medium"
                          >
                            {productosDisponibles.map(p => <option key={p.id} value={p.id}>{p.nombre} (${p.precio})</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-2 items-end">
                        <div className="w-1/2">
                          <label className="text-[8px] font-bold text-slate-400 block mb-1">Cantidad</label>
                          <input 
                            type="number" 
                            value={cantidadAñadir} 
                            onChange={(e) => setCantidadAñadir(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full p-1 bg-white border border-slate-200 rounded text-xs font-bold text-center"
                            min="1"
                          />
                        </div>
                        <button 
                          onClick={añadirProductoATarima}
                          className="w-1/2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold py-1.5 rounded transition-all cursor-pointer"
                        >
                          Asignar Ítem
                        </button>
                      </div>
                    </div>

                    {/* Pallet Cards */}
                    <div className="space-y-2.5">
                      {tarimas.map(t => (
                        <div key={t.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                          <div className="bg-slate-900 px-3 py-2 flex justify-between items-center text-white text-[11px] font-bold">
                            <span>{t.id}</span>
                            <span className="text-[9px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-indigo-400 font-mono">QR-READY</span>
                          </div>
                          <div className="p-3 divide-y divide-slate-100 bg-white text-xs">
                            {t.productos.length === 0 ? (
                              <p className="text-[10px] text-slate-400 text-center py-2">Vacío. Asigne productos arriba.</p>
                            ) : (
                              t.productos.map(p => (
                                <div key={p.id} className="py-1.5 flex justify-between text-[11px] font-medium text-slate-600">
                                  <span>{p.nombre}</span>
                                  <span className="font-bold text-slate-900">{p.enviado} unidades</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* QUICK SCAN AREA */}
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                Escaneo rápido de QR
              </span>
              <form onSubmit={handleQrScan} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Scan QR Code..."
                  value={qrScanInput}
                  onChange={(e) => setQrScanInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#002d72]"
                />
                <button 
                  type="submit"
                  className="bg-[#002d72] hover:bg-[#002060] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Escanear
                </button>
              </form>
            </div>

          </div>

          {/* FINAL DESPACHO BUTTON */}
          <button 
            onClick={() => {
              if (tarimas.length === 0) {
                alert("Debe agregar al menos un pallet para finalizar el despacho.");
                return;
              }
              alert(`Despacho finalizado con éxito.\nTrailer: ${numeroTrailer}\nFactura: ${numeroFactura}\nTotal Pallets: ${tarimas.length}`);
            }}
            className="w-full bg-[#002d72] hover:bg-[#002060] text-white text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#002d72]/10 cursor-pointer"
          >
            <CheckCircleIcon className="w-5 h-5 stroke-[2]" />
            Finalizar Despacho
          </button>
          
        </div>

      </div>
    </div>
  );
}
