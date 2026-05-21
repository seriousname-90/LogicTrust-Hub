import  { useState, useMemo } from 'react';
import { PRODUCTOS_DISPONIBLES } from './Data/mockData';
import Cedi from './cedi';
import Recepcion from './recepcion';

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

  // --- CÁLCULOS GLOBALES (Memoizados para rendimiento) ---
  const statsGlobales = useMemo(() => {
    const totalEnviado = tarimas.reduce((acc, t) => acc + t.productos.reduce((pAcc, p) => p.enviado + pAcc, 0), 0);
    const totalRecibido = tarimas.reduce((acc, t) => acc + t.productos.reduce((pAcc, p) => p.recibido + pAcc, 0), 0);
    const totalDanado = tarimas.reduce((acc, t) => acc + t.productos.reduce((pAcc, p) => p.danado + pAcc, 0), 0);
    return { totalEnviado, totalRecibido, totalDanado };
  }, [tarimas]);

  // --- FUNCIONES MÓDULO CEDIS ---
  const crearNuevaTarima = () => {
    const idNueva = `TARIMA #${String(tarimas.length + 1).padStart(2, '0')}`;
    setTarimas(prev => [...prev, { id: idNueva, productos: [] }]);
    setTarimaDestino(idNueva);
  };

  const añadirProductoATarima = () => {
    const prodBase = PRODUCTOS_DISPONIBLES.find(p => p.id === productoSeleccionado);
    setTarimas(prev => prev.map(tarima => {
      if (tarima.id === tarimaDestino) {
        const existe = tarima.productos.find(p => p.id === productoSeleccionado);
        if (existe) {
          return {
            ...tarima,
            productos: tarima.productos.map(p => 
              p.id === productoSeleccionado 
                ? { ...p, enviado: p.enviado + parseInt(cantidadAñadir), recibido: p.enviado + parseInt(cantidadAñadir) }
                : p
            )
          };
        }
        return {
          ...tarima,
          productos: [...tarima.productos, { ...prodBase, enviado: parseInt(cantidadAñadir), recibido: parseInt(cantidadAñadir), danado: 0 }]
        };
      }
      return tarima;
    }));
  };

  // --- FUNCIONES MÓDULO TIENDA ---
  const ajustarCantidadTienda = (tarimaId, productoId, campo, valor) => {
    setTarimas(prev => prev.map(t => {
      if (t.id !== tarimaId) return t;
      return {
        ...t,
        productos: t.productos.map(p => {
          if (p.id !== productoId) return p;
          const nuevoP = { ...p };
          if (campo === 'recibido' && valor >= 0) nuevoP.recibido = valor;
          if (campo === 'danado' && valor >= 0 && valor <= (campo === 'recibido' ? valor : p.recibido)) nuevoP.danado = valor;
          return nuevoP;
        })
      };
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col md:flex-row">
      
      {/* SIDEBAR DE METADATOS: Información dividida y siempre accesible */}
      <aside className="w-full md:w-80 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 shadow-xl z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200">L</div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">LogiTrust Hub</h1>
        </div>

        <div className="space-y-6">
          <h2 className="text-[11px] font-black uppercase text-indigo-500 tracking-widest border-b border-indigo-50 pb-2">Detalles del Proceso</h2>
          <div className="space-y-4">
            <div className="group">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">N° Tráiler</label>
              <input type="text" value={numeroTrailer} onChange={(e) => setNumeroTrailer(e.target.value)} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"/>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Contenedor</label>
              <input type="text" value={numeroContenedor} onChange={(e) => setNumeroContenedor(e.target.value)} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"/>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Factura Fiscal</label>
              <input type="text" value={numeroFactura} onChange={(e) => setNumeroFactura(e.target.value)} className="w-full mt-1 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-sm font-black text-indigo-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"/>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-2xl">
            <p className="text-[10px] font-bold opacity-50 uppercase mb-3 tracking-widest">Status General</p>
            <div className="flex justify-between text-sm mb-2">
              <span>Enviado:</span> <span className="font-bold">{statsGlobales.totalEnviado} u.</span>
            </div>
            <div className="flex justify-between text-sm border-t border-white/10 pt-2">
              <span>Recibido:</span> <span className="font-bold text-emerald-400">{statsGlobales.totalRecibido} u.</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ÁREA DE TRABAJO PRINCIPAL */}
      <main className="flex-1 p-4 md:p-10 flex flex-col h-screen overflow-y-auto bg-[#FBFBFE]">
        
        {/* NAVEGACIÓN SUPERIOR TIPO TABS */}
        <nav className="flex justify-center mb-10">
          <div className="bg-slate-200/40 p-1.5 rounded-2xl flex gap-2 border border-slate-200/60 shadow-inner">
            <button 
              onClick={() => setVista('CEDIS')}
              className={`flex items-center gap-2 px-8 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${vista === 'CEDIS' ? 'bg-white text-indigo-600 shadow-xl scale-105 ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
            >
              <span className="text-lg">🏭</span> Despacho CEDIS
            </button>
            <button 
              onClick={() => setVista('TIENDA')}
              className={`flex items-center gap-2 px-8 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${vista === 'TIENDA' ? 'bg-white text-indigo-600 shadow-xl scale-105 ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
            >
              <span className="text-lg">🏪</span> Recepción Tienda
            </button>
          </div>
        </nav>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {vista === 'CEDIS' ? (
            <Cedi 
              numeroTrailer={numeroTrailer} setNumeroTrailer={setNumeroTrailer}
              numeroContenedor={numeroContenedor} setNumeroContenedor={setNumeroContenedor}
              numeroFactura={numeroFactura} setNumeroFactura={setNumeroFactura}
              tarimas={tarimas} crearNuevaTarima={crearNuevaTarima}
              tarimaDestino={tarimaDestino} setTarimaDestino={setTarimaDestino}
              productoSeleccionado={productoSeleccionado} setProductoSeleccionado={setProductoSeleccionado}
              cantidadAñadir={cantidadAñadir} setCantidadAñadir={setCantidadAñadir}
              añadirProductoATarima={añadirProductoATarima}
              productosDisponibles={PRODUCTOS_DISPONIBLES}
            />
          ) : (
            <Recepcion 
              tarimas={tarimas}
              numeroFactura={numeroFactura}
              numeroTrailer={numeroTrailer}
              ajustarCantidadTienda={ajustarCantidadTienda}
            />
          )}
        </div>
      </main>
    </div>
  );
}
