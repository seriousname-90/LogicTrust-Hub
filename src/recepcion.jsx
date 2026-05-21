export default function Recepcion({ tarimas, numeroFactura, numeroTrailer, ajustarCantidadTienda }) {
  // Lógica financiera calculada localmente para este componente
  let montoTotalFactura = 0;
  let montoTotalRecibido = 0;
  let totalPerdidaDanados = 0;
  let totalPerdidaFaltantes = 0;
  const listaDiscrepancias = [];

  tarimas.forEach(tarima => {
    tarima.productos.forEach(p => {
      const faltantes = p.enviado - p.recibido;
      const sobrantes = p.recibido - p.enviado;
      montoTotalFactura += p.enviado * p.precio;
      montoTotalRecibido += (p.recibido - p.danado) * p.precio;
      
      if (p.danado > 0) {
        totalPerdidaDanados += p.danado * p.precio;
        listaDiscrepancias.push({ tarima: tarima.id, producto: p.nombre, tipo: "🚨 Artículo Dañado", cant: p.danado, costo: p.danado * p.precio });
      }
      if (faltantes > 0) {
        totalPerdidaFaltantes += faltantes * p.precio;
        listaDiscrepancias.push({ tarima: tarima.id, producto: p.nombre, tipo: "🟡 Faltante", cant: faltantes, costo: faltantes * p.precio });
      }
      if (sobrantes > 0) {
        listaDiscrepancias.push({ tarima: tarima.id, producto: p.nombre, tipo: "🔵 Sobrante", cant: sobrantes, costo: 0 });
      }
    });
  });

  const totalPerdidaGlobal = totalPerdidaDanados + totalPerdidaFaltantes;

  return (
    <div>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"/>
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Total Factura</p>
          <p className="text-3xl font-black text-slate-900 mt-1 tracking-tighter">${montoTotalFactura.toLocaleString()}</p>
          <span className="text-[10px] text-slate-400 font-medium">Factura: {numeroFactura}</span>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"/>
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-emerald-600">Monto Neto OK</p>
          <p className="text-3xl font-black text-emerald-600 mt-1 tracking-tighter">${montoTotalRecibido.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-500 font-black uppercase">✓ Listo para stock</span>
        </div>
        <div className={`bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden transition-all ${totalPerdidaGlobal > 0 ? 'bg-rose-50/30' : ''}`}>
          <div className={`absolute top-0 left-0 w-1.5 h-full ${totalPerdidaGlobal > 0 ? 'bg-rose-500' : 'bg-slate-200'}`}/>
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-rose-600">Merma Detectada</p>
          <p className={`text-3xl font-black mt-1 tracking-tighter ${totalPerdidaGlobal > 0 ? 'text-rose-600' : 'text-slate-400'}`}>-${totalPerdidaGlobal.toLocaleString()}</p>
          <p className="text-[9px] text-slate-400 font-bold uppercase">Impacto en margen de utilidad</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">🛒 <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Auditoría en Piso</span></h2>
          {tarimas.map(t => (
            <div key={t.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden card-hover">
              <div className="bg-slate-900 px-5 py-3.5 flex justify-between items-center text-white text-xs font-black tracking-widest uppercase">
                <span>{t.id} (Tráiler: {numeroTrailer})</span>
                <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[9px]">En Proceso</span>
              </div>
              <div className="p-4 divide-y divide-slate-100">
                {t.productos.map(p => {
                  const tieneError = p.recibido !== p.enviado || p.danado > 0;
                  return (
                  <div key={p.id} className={`py-4 px-2 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs transition-colors rounded-xl ${tieneError ? 'bg-rose-50/40' : 'hover:bg-slate-50'}`}>
                    <div className="flex-1">
                      <p className={`font-black text-sm ${tieneError ? 'text-rose-700' : 'text-slate-900'}`}>{p.nombre}</p>
                      <p className="text-slate-400 font-medium">Unitario: ${p.precio} | Declarado: {p.enviado} u.</p>
                    </div>
                    <div className="flex gap-4 items-center justify-between sm:justify-end">
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-black uppercase text-slate-400 mb-1">Carga Física</span>
                        <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                          <button onClick={() => ajustarCantidadTienda(t.id, p.id, 'recibido', p.recibido - 1)} className="px-3 py-1.5 hover:bg-slate-100 text-slate-400 font-bold">-</button>
                          <span className="px-4 font-black text-slate-900 bg-slate-50/50">{p.recibido}</span>
                          <button onClick={() => ajustarCantidadTienda(t.id, p.id, 'recibido', p.recibido + 1)} className="px-3 py-1.5 hover:bg-slate-100 text-slate-400 font-bold">+</button>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-black uppercase text-rose-500 mb-1">Dañados</span>
                        <div className="flex items-center border border-rose-200 rounded-xl bg-white shadow-sm overflow-hidden">
                          <button onClick={() => ajustarCantidadTienda(t.id, p.id, 'danado', p.danado - 1)} className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 font-bold">-</button>
                          <span className="px-4 font-black text-rose-700 bg-rose-50/50">{p.danado}</span>
                          <button onClick={() => ajustarCantidadTienda(t.id, p.id, 'danado', p.danado + 1)} className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 font-bold">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-black text-slate-900">📑 Acta Legal</h2>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 min-h-[400px] flex flex-col">
            {listaDiscrepancias.length === 0 ? (
              <div className="my-auto text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                <p className="text-xs font-black text-slate-900 uppercase">Todo en orden</p>
                <p className="text-[10px] text-slate-400 mt-1">Carga 100% Conciliada</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[400px] mb-6">
                {listaDiscrepancias.map((disc, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] flex justify-between items-center group hover:bg-white hover:border-indigo-200 transition-all">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-black text-slate-800">{disc.producto}</span>
                      <span className="text-[9px] font-bold text-rose-500 uppercase">{disc.tipo} ({disc.cant})</span>
                    </div>
                    <span className="font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">-${disc.costo}</span>
                  </div>
                ))}
              </div>
            )}
            <button className="w-full mt-auto bg-gradient-to-r from-slate-900 to-slate-800 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:shadow-indigo-100 transition-all active:scale-95">
              Firmar Recepción
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
