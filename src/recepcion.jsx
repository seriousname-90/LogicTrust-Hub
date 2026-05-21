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
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Factura Esperado</p>
          <p className="text-3xl font-black text-slate-900 mt-1">${montoTotalFactura.toLocaleString()}</p>
          <span className="text-[10px] text-slate-400 font-medium">Factura: {numeroFactura}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Monto Neto Recibido</p>
          <p className="text-3xl font-black text-emerald-600 mt-1">${montoTotalRecibido.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-500 font-medium">✓ Mercancía apta</span>
        </div>
        <div className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${totalPerdidaGlobal > 0 ? 'border-rose-500 bg-rose-50/10' : 'border-slate-200'}`}>
          <p className="text-xs font-bold uppercase tracking-wider text-rose-600">Pérdida Financiera</p>
          <p className={`text-3xl font-black mt-1 ${totalPerdidaGlobal > 0 ? 'text-rose-600' : 'text-slate-400'}`}>-${totalPerdidaGlobal.toLocaleString()}</p>
          <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
            <span>Daños: ${totalPerdidaDanados}</span>
            <span>Faltantes: ${totalPerdidaFaltantes}</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">📦 Auditoría por Tarima</h2>
          {tarimas.map(t => (
            <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-900 px-4 py-3 flex justify-between items-center text-white text-sm font-bold">
                <span>{t.id} (Tráiler: {numeroTrailer})</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono">CONTEO ACTIVO</span>
              </div>
              <div className="p-4 divide-y divide-slate-100">
                {t.productos.map(p => (
                  <div key={p.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs">
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-sm">{p.nombre}</p>
                      <p className="text-slate-400 font-medium">Unitario: ${p.precio} | Declarado: {p.enviado} u.</p>
                    </div>
                    <div className="flex gap-4 items-center justify-between sm:justify-end">
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-bold uppercase text-slate-400 mb-1">Recibidos</span>
                        <div className="flex items-center border rounded-lg bg-slate-50 overflow-hidden">
                          <button onClick={() => ajustarCantidadTienda(t.id, p.id, 'recibido', p.recibido - 1)} className="px-2 py-1 hover:bg-slate-200">-</button>
                          <span className="px-3 font-bold text-slate-700">{p.recibido}</span>
                          <button onClick={() => ajustarCantidadTienda(t.id, p.id, 'recibido', p.recibido + 1)} className="px-2 py-1 hover:bg-slate-200">+</button>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-bold uppercase text-rose-500 mb-1">Dañados</span>
                        <div className="flex items-center border border-rose-200 rounded-lg bg-rose-50/50 overflow-hidden">
                          <button onClick={() => ajustarCantidadTienda(t.id, p.id, 'danado', p.danado - 1)} className="px-2 py-1 text-rose-600 hover:bg-rose-100">-</button>
                          <span className="px-3 font-bold text-rose-700">{p.danado}</span>
                          <button onClick={() => ajustarCantidadTienda(t.id, p.id, 'danado', p.danado + 1)} className="px-2 py-1 text-rose-600 hover:bg-rose-100">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">📑 Evidencias</h2>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[300px] flex flex-col justify-between">
            {listaDiscrepancias.length === 0 ? (
              <p className="text-xs text-slate-400 text-center my-auto">Carga 100% Conciliada</p>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-[300px]">
                {listaDiscrepancias.map((disc, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border text-xs flex justify-between">
                    <span>{disc.producto} ({disc.tipo})</span>
                    <span className="font-bold text-rose-600">-{disc.costo}</span>
                  </div>
                ))}
              </div>
            )}
            <button className="w-full mt-4 bg-slate-900 text-white py-3 rounded-xl font-bold text-xs uppercase">Finalizar Recibo</button>
          </div>
        </div>
      </div>
    </div>
  );
}
