

export default function Cedi({ 
  numeroTrailer, setNumeroTrailer, 
  
  numeroFactura, setNumeroFactura,
  tarimas, crearNuevaTarima,
  tarimaDestino, setTarimaDestino,
  productoSeleccionado, setProductoSeleccionado,
  añadirProductoATarima,
  productosDisponibles 
}) {
  // Cálculo de totales para el resumen de carga
  const totalItems = tarimas.reduce((acc, t) => acc + t.productos.reduce((pAcc, p) => p.enviado + pAcc, 0), 0);
  const valorTotalEnvio = tarimas.reduce((acc, t) => acc + t.productos.reduce((pAcc, p) => (p.enviado * p.precio) + pAcc, 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* COLUMNA IZQUIERDA: CONFIGURACIÓN */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
            📋 Datos del Despacho
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Número de Tráiler</label>
              <input type="text" value={numeroTrailer} onChange={(e) => setNumeroTrailer(e.target.value)} className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none text-sm"/>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Sello de Seguridad</label>
              <input type="text" placeholder="S-99234" className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none text-sm"/>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Factura Asociada</label>
              <input type="text" value={numeroFactura} onChange={(e) => setNumeroFactura(e.target.value)} className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"/>
            </div>
          </div>
        </div>

        {/* NUEVA SECCIÓN: CHECKLIST DE CALIDAD */}
        <div className="bg-indigo-900 p-6 rounded-2xl shadow-sm text-white">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-80">Checklist de Salida</h3>
          <div className="space-y-3">
            {['Tarimas Emplayadas', 'Peso Verificado', 'Fotos de Carga Tomadas', 'Documentación Firmada'].map((item, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/10 checked:bg-emerald-500" />
                <span className="text-sm font-medium group-hover:text-emerald-300 transition-colors">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* COLUMNA DERECHA: ARMADO VIRTUAL */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">📦 Consolidación de Tarimas</h2>
              <p className="text-xs text-slate-400 font-medium">Total: {totalItems} unidades | Value: ${valorTotalEnvio.toLocaleString()}</p>
            </div>
            <button onClick={crearNuevaTarima} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-200">
              + Nueva Tarima
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 items-end">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Tarima</label>
              <select value={tarimaDestino} onChange={(e) => setTarimaDestino(e.target.value)} className="w-full mt-1 p-2 bg-white border rounded-lg text-xs font-bold">
                {tarimas.map(t => <option key={t.id} value={t.id}>{t.id}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Producto</label>
              <select value={productoSeleccionado} onChange={(e) => setProductoSeleccionado(e.target.value)} className="w-full mt-1 p-2 bg-white border rounded-lg text-xs font-bold">
                {productosDisponibles.map(p => <option key={p.id} value={p.id}>{p.nombre} (${p.precio})</option>)}
              </select>
            </div>
            <button onClick={añadirProductoATarima} className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-lg transition-all">Asignar</button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {tarimas.map(t => (
              <div key={t.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-indigo-300 transition-colors">
                <div className="bg-slate-900 p-3 flex justify-between items-center text-white text-xs font-bold tracking-tight">
                  <span>{t.id}</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[9px] uppercase">Listo para QR</span>
                </div>
                <div className="p-4 space-y-2">
                  {t.productos.length === 0 ? <p className="text-[10px] text-slate-300 italic text-center py-4">Sin productos asignados</p> : 
                    t.productos.map(p => (
                      <div key={p.id} className="flex justify-between items-center text-[11px] font-semibold text-slate-600 bg-slate-50 p-2 rounded-lg">
                        <span>{p.nombre}</span>
                        <span className="text-slate-900">{p.enviado} u.</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}