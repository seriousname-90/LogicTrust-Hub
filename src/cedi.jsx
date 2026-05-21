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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* CONTROL Y METADATOS DEL OPERADOR */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 h-fit">
        <h2 className="text-lg font-bold text-slate-900 border-b pb-2">📋 Datos de Envío</h2>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Número de Tráiler</label>
          <input
            type="text"
            value={numeroTrailer}
            onChange={(e) => setNumeroTrailer(e.target.value)}
            className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Número de Contenedor</label>
          <input
            type="text"
            value={numeroContenedor}
            onChange={(e) => setNumeroContenedor(e.target.value)}
            className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Asociar Factura (Para Tienda)</label>
          <input
            type="text"
            value={numeroFactura}
            onChange={(e) => setNumeroFactura(e.target.value)}
            className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">📦 <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Armado de Tarimas</span></h2>
            <button
              onClick={crearNuevaTarima}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-100 transform active:scale-95"
            >
              + Crear Nueva Tarima
            </button>
          </div>

          {/* Formulario rápido para añadir ítems a palés */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 items-end">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Tarima Destino</label>
              <select
                value={tarimaDestino}
                onChange={(e) => setTarimaDestino(e.target.value)}
                className="w-full mt-1 p-2 bg-white border rounded-lg text-xs font-medium"
              >
                {tarimas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Seleccionar Producto</label>
              <select
                value={productoSeleccionado}
                onChange={(e) => setProductoSeleccionado(e.target.value)}
                className="w-full mt-1 p-2 bg-white border rounded-lg text-xs font-medium"
              >
                {productosDisponibles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} (${p.precio})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Cantidad</label>
              <input
                type="number"
                value={cantidadAñadir}
                onChange={(e) => setCantidadAñadir(e.target.value)}
                className="w-full mt-1 p-1.5 bg-white border rounded-lg text-xs font-bold"
                min="1"
              />
            </div>
            <button
              onClick={añadirProductoATarima}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black uppercase tracking-tighter py-3 rounded-xl transition-all shadow-md active:translate-y-0.5"
            >
              ⚡ Vincular
            </button>
          </div>

          {/* Visualización de las tarimas y su contenido actual */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {tarimas.map((t) => (
              <div key={t.id} className={`border ${t.productos.length > 0 ? 'border-indigo-200' : 'border-slate-200'} rounded-2xl overflow-hidden text-sm transition-all hover:shadow-md card-hover`}>
                <div className="bg-slate-900 p-3 flex justify-between items-center text-white font-bold">
                  <span>{t.id}</span>
                  <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] ${t.productos.length > 0 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-400'}`}>
                    QR-READY
                  </span>
                </div>
                <div className="p-3 divide-y divide-slate-100 bg-white">
                  {t.productos.length === 0 ? (
                    <p className="text-xs text-slate-300 italic text-center py-6">
                      Esperando carga...
                    </p>
                  ) : (
                    t.productos.map((p) => (
                      <div key={p.id} className="py-2.5 px-3 flex justify-between text-[11px] font-bold text-slate-600 bg-slate-50/50 rounded-lg mb-1 last:mb-0">
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400"/> {p.nombre}</span>
                        <span className="text-indigo-600">{p.enviado} u.</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
