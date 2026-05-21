

export default function Recepcion({ tarimas, ajustarCantidadTienda }) {
  let montoTotalFactura = 0;
  let montoTotalRecibido = 0;
  let totalPerdidaDanados = 0;
  let totalPerdidaFaltantes = 0;
  const listaDiscrepancias = [];

  tarimas.forEach(tarima => {
    tarima.productos.forEach(p => {
      const faltantes = Math.max(0, p.enviado - p.recibido);
      const sobrantes = Math.max(0, p.recibido - p.enviado);
      
      montoTotalFactura += p.enviado * p.precio;
      montoTotalRecibido += (p.recibido - p.danado) * p.precio;
      
      if (p.danado > 0) {
        totalPerdidaDanados += p.danado * p.precio;
        listaDiscrepancias.push({ tarima: tarima.id, producto: p.nombre, tipo: "Dañado", cant: p.danado, costo: p.danado * p.precio });
      }
      if (faltantes > 0) {
        totalPerdidaFaltantes += faltantes * p.precio;
        listaDiscrepancias.push({ tarima: tarima.id, producto: p.nombre, tipo: "Faltante", cant: faltantes, costo: faltantes * p.precio });
      }
      if (sobrantes > 0) {
        // Los sobrantes se registran pero con costo 0 ya que no son pérdida
        listaDiscrepancias.push({ tarima: tarima.id, producto: p.nombre, tipo: "Sobrante", cant: sobrantes, costo: 0 });
      }
    });
  });

  const totalPerdidaGlobal = totalPerdidaDanados + totalPerdidaFaltantes;
  const porcentajeImpacto = montoTotalFactura > 0 ? ((totalPerdidaGlobal / montoTotalFactura) * 100).toFixed(2) : 0;

  return (
    <div className="space-y-8">
      {/* RESUMEN FINANCIERO CON INDICADORES DE IMPACTO */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border-t-4 border-indigo-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Facturado</p>
          <p className="text-2xl font-black text-slate-900">${montoTotalFactura.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border-t-4 border-emerald-500">
          <p className="text-[10px] font-bold text-emerald-600 uppercase">Recibido Neto</p>
          <p className="text-2xl font-black text-emerald-600">${montoTotalRecibido.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border-t-4 border-rose-500">
          <p className="text-[10px] font-bold text-rose-500 uppercase">Merma Total</p>
          <p className="text-2xl font-black text-rose-600">-${totalPerdidaGlobal.toLocaleString()}</p>
        </div>
        <div className={`p-5 rounded-2xl shadow-sm border-t-4 ${porcentajeImpacto > 5 ? 'bg-rose-600 border-rose-700 text-white' : 'bg-slate-900 border-slate-800 text-white'}`}>
          <p className="text-[10px] font-bold uppercase opacity-70">Impacto Financiero</p>
          <p className="text-2xl font-black">{porcentajeImpacto}%</p>
          <p className="text-[9px] mt-1 font-medium opacity-80">{porcentajeImpacto > 5 ? '⚠️ Excede límite permitido' : '✓ Dentro del margen'}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* VALIDACIÓN DE SEGURIDAD */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 space-y-1">
              <h3 className="font-bold text-slate-900">Validación de Sellos</h3>
              <p className="text-xs text-slate-400 font-medium">Verificar integridad física del contenedor.</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <input type="text" placeholder="N° Sello Físico" className="bg-slate-50 border rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
              <select className="bg-slate-50 border rounded-xl px-4 py-2 text-xs font-bold">
                <option>Sello Intacto</option>
                <option className="text-rose-600 font-bold">⚠️ Sello Violentado</option>
              </select>
            </div>
          </div>

          {/* TABLA DE AUDITORÍA */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">🛒 Conteo por Excepción</h3>
            {tarimas.map(t => (
              <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                  Contenido de {t.id}
                </div>
                <div className="divide-y divide-slate-100">
                  {t.productos.map(p => (
                    <div key={p.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{p.nombre}</p>
                        <p className="text-[10px] text-slate-400 font-bold">ESPERADO: {p.enviado} u.</p>
                      </div>
                      <div className="flex gap-6">
                        <div className="text-center">
                          <span className="block text-[9px] font-bold text-slate-400 mb-1">RECIBIDOS</span>
                          <div className="flex items-center bg-slate-100 rounded-lg">
                            <button onClick={() => ajustarCantidadTienda(t.id, p.id, 'recibido', p.recibido - 1)} className="px-2 py-1 text-xs hover:bg-slate-200">-</button>
                            <span className="px-2 text-xs font-black w-8">{p.recibido}</span>
                            <button onClick={() => ajustarCantidadTienda(t.id, p.id, 'recibido', p.recibido + 1)} className="px-2 py-1 text-xs hover:bg-slate-200">+</button>
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="block text-[9px] font-bold text-rose-400 mb-1">DAÑADOS</span>
                          <div className="flex items-center bg-rose-50 border border-rose-100 rounded-lg">
                            <button onClick={() => ajustarCantidadTienda(t.id, p.id, 'danado', p.danado - 1)} className="px-2 py-1 text-xs text-rose-600">-</button>
                            <span className="px-2 text-xs font-black text-rose-700 w-8">{p.danado}</span>
                            <button onClick={() => ajustarCantidadTienda(t.id, p.id, 'danado', p.danado + 1)} className="px-2 py-1 text-xs text-rose-600">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BARRA LATERAL: EVIDENCIAS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit space-y-6 sticky top-6">
          <h3 className="font-bold text-slate-900 border-b pb-2">📑 Acta de Recepción</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {listaDiscrepancias.length === 0 ? <p className="text-xs text-slate-300 italic text-center py-4">Sin novedades detectadas</p> :
              listaDiscrepancias.map((d) => (
                <div key={d.id} className="text-[11px] bg-slate-50 border border-slate-100 p-3 rounded-xl flex justify-between items-center">
                  <span>
                    <b className={d.tipo === 'Sobrante' ? 'text-indigo-600' : 'text-rose-600'}>{d.tipo}</b>: {d.producto} 
                    <span className="text-slate-400 ml-1">({d.cant} u.)</span>
                  </span>
                  <span className={`font-bold ${d.costo > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {d.costo > 0 ? `-$${d.costo.toLocaleString()}` : '+$0'}
                  </span>
                </div>
              ))
            }
          </div>
          <textarea placeholder="Observaciones de la auditoría..." className="w-full bg-slate-50 border rounded-xl p-3 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500 h-24" />
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all">
            Cerrar Conciliación
          </button>
        </div>
      </div>
    </div>
  );
}