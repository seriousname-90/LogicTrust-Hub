
import  { useState } from 'react';
import { PRODUCTOS_DISPONIBLES } from './Data/mockData';

export default function App() {
  // --- ESTADOS PRINCIPALES ---
  const [vista, setVista] = useState('CEDIS'); // 'CEDIS' o 'TIENDA'
  const [numeroTrailer, setNumeroTrailer] = useState('TR-8849');
  const [numeroContenedor, setNumeroContenedor] = useState('CONT-9932');
  const [numeroFactura, setNumeroFactura] = useState('FAC-10294');
  
  // Estado que almacena las tarimas creadas en CEDIS y auditadas en Tienda
  const [tarimas, setTarimas] = useState([
    {
      id: "TARIMA #01",
      productos: [
        { id: "P1", nombre: 'Pantalla Smart TV 32"', precio: 150, enviado: 10, recibido: 10, danado: 0 },
        { id: "P2", nombre: "Licuadora Profesional", precio: 50, enviado: 20, recibido: 20, danado: 0 },
      ]
    }
  ]);

  // Variables para la creación de nuevos productos/tarimas en CEDIS
  const [productoSeleccionado, setProductoSeleccionado] = useState('P1');
  const [cantidadAñadir, setCantidadAñadir] = useState(5);
  const [tarimaDestino, setTarimaDestino] = useState('TARIMA #01');

  // --- LÓGICA DE FINANZAS (Cálculos en tiempo real para el Jurado) ---
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
      
      // El valor neto real que le queda a la tienda libre de daños
      montoTotalRecibido += (p.recibido - p.danado) * p.precio;
      
      if (p.danado > 0) totalPerdidaDanados += p.danado * p.precio;
      if (faltantes > 0) totalPerdidaFaltantes += faltantes * p.precio;

      // Registrar anomalías en la lista ejecutiva
      if (p.danado > 0) {
        listaDiscrepancias.push({ tarima: tarima.id, producto: p.nombre, tipo: "🚨 Artículo Dañado", cant: p.danado, costo: p.danado * p.precio });
      }
      if (faltantes > 0) {
        listaDiscrepancias.push({ tarima: tarima.id, producto: p.nombre, tipo: "🟡 Faltante", cant: faltantes, costo: faltantes * p.precio });
      }
      if (sobrantes > 0) {
        listaDiscrepancias.push({ tarima: tarima.id, producto: p.nombre, tipo: "🔵 Sobrante", cant: sobrantes, costo: 0 }); // El sobrante no se cuenta como pérdida
      }
    });
  });

  const totalPerdidaGlobal = totalPerdidaDanados + totalPerdidaFaltantes;

  // --- FUNCIONES MÓDULO CEDIS ---
  const crearNuevaTarima = () => {
    const idNueva = `TARIMA #${String(tarimas.length + 1).padStart(2, '0')}`;
    setTarimas([...tarimas, { id: idNueva, productos: [] }]);
    setTarimaDestino(idNueva);
  };

  const añadirProductoATarima = () => {
    const prodBase = PRODUCTOS_DISPONIBLES.find(p => p.id === productoSeleccionado);
    const nuevasTarimas = tarimas.map(tarima => {
      if (tarima.id === tarimaDestino) {
        const existe = tarima.productos.find(p => p.id === productoSeleccionado);
        if (existe) {
          existe.enviado += parseInt(cantidadAñadir);
          existe.recibido = existe.enviado; // Se inicializa igual para el conteo por excepción
        } else {
          tarima.productos.push({
            ...prodBase,
            enviado: parseInt(cantidadAñadir),
            recibido: parseInt(cantidadAñadir),
            danado: 0
          });
        }
      }
      return tarima;
    });
    setTarimas(nuevasTarimas);
  };

  // --- FUNCIONES MÓDULO TIENDA ---
  const ajustarCantidadTienda = (tarimaId, productoId, campo, valor) => {
    const nuevasTarimas = tarimas.map(t => {
      if (t.id === tarimaId) {
        t.productos = t.productos.map(p => {
          if (p.id === productoId) {
            if (campo === 'recibido' && valor >= 0) p.recibido = valor;
            if (campo === 'danado' && valor >= 0 && valor <= p.recibido) p.danado = valor;
          }
          return p;
        });
      }
      return t;
    });
    setTarimas(nuevasTarimas);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6">
      
      {/* HEADER PRINCIPAL */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Vite + React MVP</span>
          <h1 className="text-3xl font-black text-slate-900 mt-2">LogiTrust Hub</h1>
          <p className="text-sm text-slate-500">Conciliación de facturas y control financiero de mermas.</p>
        </div>
        
        {/* INTERRUPTOR DE VISTAS (Ideal para la demo ante jueces) */}
        <div className="mt-4 md:mt-0 flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button 
            onClick={() => setVista('CEDIS')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${vista === 'CEDIS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            🏭 Vista CEDIS (Carga)
          </button>
          <button 
            onClick={() => setVista('TIENDA')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${vista === 'TIENDA' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            🏪 Vista Tienda (Recibo)
          </button>
        </div>
      </header>

      {/* ================= PANTALLA 1: MODULO CEDIS ================= */}
      {vista === 'CEDIS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 h-fit">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-2">📋 Datos de Envío</h2>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Número de Tráiler</label>
              <input type="text" value={numeroTrailer} onChange={(e) => setNumeroTrailer(e.target.value)} className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none text-sm"/>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Número de Contenedor</label>
              <input type="text" value={numeroContenedor} onChange={(e) => setNumeroContenedor(e.target.value)} className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none text-sm"/>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Asociar Factura (Para Tienda)</label>
              <input type="text" value={numeroFactura} onChange={(e) => setNumeroFactura(e.target.value)} className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"/>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-900">📦 Armado de Tarimas Virtuales</h2>
                <button onClick={crearNuevaTarima} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all">+ Crear Nueva Tarima</button>
              </div>

              {/* Formulario rápido para añadir ítems a palés */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 items-end">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Tarima Destino</label>
                  <select value={tarimaDestino} onChange={(e) => setTarimaDestino(e.target.value)} className="w-full mt-1 p-2 bg-white border rounded-lg text-xs font-medium">
                    {tarimas.map(t => <option key={t.id} value={t.id}>{t.id}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Seleccionar Producto</label>
                  <select value={productoSeleccionado} onChange={(e) => setProductoSeleccionado(e.target.value)} className="w-full mt-1 p-2 bg-white border rounded-lg text-xs font-medium">
                    {PRODUCTOS_DISPONIBLES.map(p => <option key={p.id} value={p.id}>{p.nombre} (${p.precio})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Cantidad</label>
                  <input type="number" value={cantidadAñadir} onChange={(e) => setCantidadAñadir(e.target.value)} className="w-full mt-1 p-1.5 bg-white border rounded-lg text-xs font-bold" min="1"/>
                </div>
                <button onClick={añadirProductoATarima} className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg transition-all">Asignar Ítem</button>
              </div>

              {/* Visualización de las tarimas y su contenido actual */}
              <div className="mt-6 space-y-4">
                {tarimas.map(t => (
                  <div key={t.id} className="border border-slate-200 rounded-xl overflow-hidden text-sm">
                    <div className="bg-slate-900 p-3 flex justify-between items-center text-white font-bold">
                      <span>{t.id}</span>
                      <span className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-indigo-400 font-mono">QR-READY</span>
                    </div>
                    <div className="p-3 divide-y divide-slate-100 bg-white">
                      {t.productos.length === 0 ? <p className="text-xs text-slate-400 text-center py-2">Tarima vacía. Asigna productos arriba.</p> : 
                        t.productos.map(p => (
                          <div key={p.id} className="py-2 flex justify-between text-xs font-medium text-slate-600">
                            <span>{p.nombre}</span>
                            <span className="font-bold text-slate-900">{p.enviado} unidades</span>
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
      )}

      {/* ================= PANTALLA 2: MODULO TIENDA ================= */}
      {vista === 'TIENDA' && (
        <div>
          {/* SECCIÓN DE RESUMEN EJECUTIVO FINANCIERO */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Factura Esperado</p>
              <p className="text-3xl font-black text-slate-900 mt-1">${montoTotalFactura.toLocaleString()}</p>
              <span className="text-[10px] text-slate-400 font-medium">Buscado bajo Factura: {numeroFactura}</span>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Monto Neto Recibido</p>
              <p className="text-3xl font-black text-emerald-600 mt-1">${montoTotalRecibido.toLocaleString()}</p>
              <span className="text-[10px] text-emerald-500 font-medium">✓ Mercancía lista para piso de venta</span>
            </div>
            <div className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 transition-all ${totalPerdidaGlobal > 0 ? 'border-rose-500 bg-rose-50/10' : 'border-slate-200'}`}>
              <p className="text-xs font-bold uppercase tracking-wider text-rose-600">Pérdida Financiera Total</p>
              <p className={`text-3xl font-black mt-1 ${totalPerdidaGlobal > 0 ? 'text-rose-600' : 'text-slate-400'}`}>-${totalPerdidaGlobal.toLocaleString()}</p>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                <span>Por Daños: ${totalPerdidaDanados}</span>
                <span>Por Faltantes: ${totalPerdidaFaltantes}</span>
              </div>
            </div>
          </section>

          {/* AUDITORÍA Y CONTEO POR EXCEPCIÓN */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">📦 Auditoría y Desglose por Tarima</h2>
              
              {tarimas.map(t => (
                <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="bg-slate-900 px-4 py-3 flex justify-between items-center text-white text-sm font-bold">
                    <span>{t.id} (Asociada a Tráiler: {numeroTrailer})</span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono">CONTEO ACTIVO</span>
                  </div>
                  <div className="p-4 divide-y divide-slate-100">
                    {t.productos.map(p => (
                      <div key={p.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs">
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 text-sm">{p.nombre}</p>
                          <p className="text-slate-400 font-medium mt-0.5">Precio Unitario: ${p.precio} | Declarado en CEDIS: <span className="font-bold text-slate-700">{p.enviado} u.</span></p>
                        </div>
                        
                        {/* CONTROLES DE FLUJO DINÁMICO */}
                        <div className="flex gap-4 items-center justify-between sm:justify-end">
                          <div className="flex flex-col items-center">
                            <span className="text-[9px] font-bold uppercase text-slate-400 mb-1">Recibidos</span>
                            <div className="flex items-center border rounded-lg bg-slate-50 overflow-hidden">
                              <button onClick={() => ajustarCantidadTienda(t.id, p.id, 'recibido', p.recibido - 1)} className="px-2 py-1 hover:bg-slate-200 font-bold">-</button>
                              <span className="px-3 font-bold text-slate-700">{p.recibido}</span>
                              <button onClick={() => ajustarCantidadTienda(t.id, p.id, 'recibido', p.recibido + 1)} className="px-2 py-1 hover:bg-slate-200 font-bold">+</button>
                            </div>
                          </div>

                          <div className="flex flex-col items-center">
                            <span className="text-[9px] font-bold uppercase text-rose-500 mb-1">⚠️ Dañados</span>
                            <div className="flex items-center border border-rose-200 rounded-lg bg-rose-50/50 overflow-hidden">
                              <button onClick={() => ajustarCantidadTienda(t.id, p.id, 'danado', p.danado - 1)} className="px-2 py-1 text-rose-600 hover:bg-rose-100 font-bold">-</button>
                              <span className="px-3 font-bold text-rose-700">{p.danado}</span>
                              <button onClick={() => ajustarCantidadTienda(t.id, p.id, 'danado', p.danado + 1)} className="px-2 py-1 text-rose-600 hover:bg-rose-100 font-bold">+</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* TABLA DE DISCREPANCIAS Y INCIDENCIAS LEGALES */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">📑 Evidencias Generadas</h2>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between min-h-[300px]">
                {listaDiscrepancias.length === 0 ? (
                  <div className="text-center my-auto py-8">
                    <p className="text-3xl">🎉</p>
                    <p className="text-xs font-bold text-slate-700 mt-2">Carga 100% Conciliada</p>
                    <p className="text-[11px] text-slate-400 mt-1">Las cantidades físicas coinciden perfectamente con la factura.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Afectación financiera detectada:</p>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {listaDiscrepancias.map((disc, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-slate-800">{disc.producto}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{disc.tarima} • <span className="font-semibold text-rose-600">{disc.tipo} ({disc.cant} u.)</span></p>
                          </div>
                          {disc.costo > 0 && <span className="font-bold text-slate-700 bg-white px-2 py-1 rounded border border-slate-100">-${disc.costo}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={() => alert('Acta y evidencias fotográficas enviadas a la aseguradora corporativa con éxito.')}
                  className={`w-full mt-6 py-3 font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-sm ${listaDiscrepancias.length > 0 ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                >
                  {listaDiscrepancias.length > 0 ? '🚨 Emitir Acta de Reclamación' : '✓ Finalizar Recibo sin Novedad'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

import React from 'react'

function App() {
  
  return (
    <div>
      
    </div>
  )
}

export default App

