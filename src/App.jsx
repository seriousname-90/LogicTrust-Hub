import { useState } from 'react';
import { PRODUCTOS_DISPONIBLES } from './Data/mockData';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Cedi from './cedi';
import Recepcion from './recepcion';
import Anomalia from './pages/Anomalia';

export default function App() {
  // --- ESTADOS PRINCIPALES ---
  const [vista, setVista] = useState('DASHBOARD'); // 'DASHBOARD', 'CEDIS', 'TIENDA', 'ANOMALIA'
  const [numeroTrailer, setNumeroTrailer] = useState('TR-8849');
  const [numeroContenedor, setNumeroContenedor] = useState('CONT-9932');
  const [numeroFactura, setNumeroFactura] = useState('FAC-10294');
  const [selectedAnomalyId, setSelectedAnomalyId] = useState('LT-8821');
  
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
    const nuevasTarimas = tarimas.map(tarima => {
      if (tarima.id === tarimaDestino) {
        const existe = tarima.productos.find(p => p.id === productoSeleccionado);
        if (existe) {
          // Creación de una nueva referencia de objeto para forzar actualización de estado
          return {
            ...tarima,
            productos: tarima.productos.map(p => {
              if (p.id === productoSeleccionado) {
                const env = p.enviado + parseInt(cantidadAñadir);
                return { ...p, enviado: env, recibido: env };
              }
              return p;
            })
          };
        } else {
          return {
            ...tarima,
            productos: [
              ...tarima.productos,
              {
                ...prodBase,
                enviado: parseInt(cantidadAñadir),
                recibido: parseInt(cantidadAñadir),
                danado: 0
              }
            ]
          };
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
        return {
          ...t,
          productos: t.productos.map(p => {
            if (p.id === productoId) {
              const updatedProduct = { ...p };
              if (campo === 'recibido' && valor >= 0) updatedProduct.recibido = valor;
              if (campo === 'danado' && valor >= 0 && valor <= updatedProduct.recibido) updatedProduct.danado = valor;
              return updatedProduct;
            }
            return p;
          })
        };
      }
      return t;
    });
    setTarimas(nuevasTarimas);
  };

  // Custom Header details based on view
  const getHeaderDetails = () => {
    switch (vista) {
      case 'DASHBOARD':
        return { placeholder: "Buscar auditorías, envíos o reportes...", subtitle: null };
      case 'CEDIS':
        return { placeholder: "Buscar expedición...", subtitle: "CEDIS Módulo" };
      case 'TIENDA':
        return { placeholder: "Buscar manifiesto...", subtitle: "Audit Destino" };
      case 'ANOMALIA':
        return { placeholder: "Buscar evidencia...", subtitle: "Evidencia Crítica" };
      default:
        return { placeholder: "Buscar...", subtitle: null };
    }
  };

  const headerProps = getHeaderDetails();

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      {/* SIDEBAR NAVIGATION */}
      <Sidebar vista={vista} setVista={setVista} />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER SECTION */}
        <Header placeholder={headerProps.placeholder} subtitle={headerProps.subtitle} />

        {/* ACTIVE VIEW RENDERING */}
        <main className="flex-1 overflow-y-auto">
          {vista === 'DASHBOARD' && (
            <Dashboard 
              setVista={setVista} 
              setSelectedAnomalyId={setSelectedAnomalyId} 
            />
          )}

          {vista === 'CEDIS' && (
            <Cedi 
              numeroTrailer={numeroTrailer} 
              setNumeroTrailer={setNumeroTrailer}
              numeroContenedor={numeroContenedor} 
              setNumeroContenedor={setNumeroContenedor}
              numeroFactura={numeroFactura} 
              setNumeroFactura={setNumeroFactura}
              tarimas={tarimas} 
              crearNuevaTarima={crearNuevaTarima}
              tarimaDestino={tarimaDestino} 
              setTarimaDestino={setTarimaDestino}
              productoSeleccionado={productoSeleccionado} 
              setProductoSeleccionado={setProductoSeleccionado}
              cantidadAñadir={cantidadAñadir} 
              setCantidadAñadir={setCantidadAñadir}
              añadirProductoATarima={añadirProductoATarima}
              productosDisponibles={PRODUCTOS_DISPONIBLES}
            />
          )}

          {vista === 'TIENDA' && (
            <Recepcion 
              tarimas={tarimas}
              numeroFactura={numeroFactura}
              numeroTrailer={numeroTrailer}
              ajustarCantidadTienda={ajustarCantidadTienda}
            />
          )}

          {vista === 'ANOMALIA' && (
            <Anomalia 
              anomalyId={selectedAnomalyId} 
              setVista={setVista} 
            />
          )}
        </main>
      </div>
    </div>
  );
}
