import  { useState } from 'react';
import { PRODUCTOS_DISPONIBLES } from './Data/mockData';
import Cedi from './cedi.jsx';
import Recepcion from './recepcion.jsx';
import './App.css';

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

  // --- FUNCIONES MÓDULO CEDIS ---
  const crearNuevaTarima = () => {
    const idNueva = `TARIMA #${String(tarimas.length + 1).padStart(2, '0')}`;
    setTarimas([...tarimas, { id: idNueva, productos: [] }]);
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
          if (campo === 'danado' && valor >= 0 && valor <= (nuevoP.recibido || p.recibido)) nuevoP.danado = valor;
          return nuevoP;
        })
      };
    }));
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
      )}

      {/* ================= PANTALLA 2: MODULO TIENDA ================= */}
      {vista === 'TIENDA' && (
        <Recepcion 
          tarimas={tarimas}
          numeroFactura={numeroFactura}
          numeroTrailer={numeroTrailer}
          ajustarCantidadTienda={ajustarCantidadTienda}
        />
      )}

    </div>
  );
}
