export const PRODUCTOS_DISPONIBLES = [
  { id: "P1", nombre: 'Pantalla Smart TV 32"', precio: 150 },
  { id: "P2", nombre: "Licuadora Profesional", precio: 50 },
  { id: "P3", nombre: "Soporte de TV de Pared", precio: 30 },
  { id: "P4", nombre: "Audífonos Bluetooth", precio: 40 },
  { id: "P5", nombre: "Cámara de Seguridad WiFi", precio: 85 },
  { id: "P6", nombre: "Laptop Oficina Pro", precio: 650 },
];

export const MOCK_ANOMALIES = [
  {
    id: "LT-8821",
    ubicacion: "Warehouse Alpha",
    operacion: "Recepción de Carga Pesada",
    estado: "Discrepancy",
    fecha: "24/05 10:45 AM",
    unidadesPerdidas: 14,
    valorUnitario: 450,
    responsable: "Logística Tercerizada (3PL)",
    prioridad: "URGENTE",
    observacion: "Se detectó que el sello del contenedor CONT-551-B fue violado y faltan 14 unidades de Laptop Oficina Pro.",
    evidenciaImg: "lock_damaged",
    historial: [
      { hora: "10:42 AM", evento: "Escaneo de Entrada", detalle: "Sensor de Puerta" },
      { hora: "10:45 AM", evento: "Alerta de Discrepancia", detalle: "Sistema Automático" },
      { hora: "Ahora", evento: "Captura Manual Requerida", detalle: "Esperando Auditor" }
    ]
  },
  {
    id: "LT-8819",
    ubicacion: "Ruta Troncal Sur",
    operacion: "Transporte de Perecederos",
    estado: "Unplanned Departure",
    fecha: "24/05 09:12 AM",
    unidadesPerdidas: 0,
    valorUnitario: 0,
    responsable: "Transporte Interno",
    prioridad: "ESTÁNDAR",
    observacion: "El camión desvió de la ruta geocercada planificada por 45 minutos. Chofer reporta tráfico pesado.",
    evidenciaImg: "route_deviation",
    historial: [
      { hora: "08:30 AM", evento: "Salida de CEDIS", detalle: "Registrado" },
      { hora: "09:12 AM", evento: "Desvío de Ruta", detalle: "Alerta GPS Geocerca" },
      { hora: "09:57 AM", evento: "Retorno a Ruta", detalle: "GPS Activo" }
    ]
  },
  {
    id: "LT-8804",
    ubicacion: "Muelle 12 - Export",
    operacion: "Control de Sellos",
    estado: "Audit Failure",
    fecha: "24/05 06:30 AM",
    unidadesPerdidas: 5,
    valorUnitario: 150,
    responsable: "Equipo de Seguridad",
    prioridad: "CRÍTICO",
    observacion: "Auditoría física no aprobada. La numeración del sello no coincide con el manifiesto original.",
    evidenciaImg: "seal_mismatch",
    historial: [
      { hora: "06:15 AM", evento: "Llegada a Muelle", detalle: "Camión TR-8849" },
      { hora: "06:30 AM", evento: "Falla de Auditoría", detalle: "Numeración de Sello Incorrecta" }
    ]
  }
];

export const INITIAL_PALLETS = [
  {
    id: "PLT-2041",
    nombre: "Componentes Electrónicos",
    peso: "450kg",
    estado: "OK", // "OK", "DAÑADO", "FALTANTE", "VERIFICADO", "EN PROCESO"
    productos: [
      { id: "P1", nombre: 'Pantalla Smart TV 32"', precio: 150, enviado: 10, recibido: 10, danado: 0 }
    ]
  },
  {
    id: "PLT-2042",
    nombre: "Repuestos Maquinaria",
    peso: "820kg",
    estado: "EN PROCESO",
    productos: [
      { id: "P6", nombre: "Laptop Oficina Pro", precio: 650, enviado: 5, recibido: 3, danado: 2 }
    ]
  },
  {
    id: "PLT-2043",
    nombre: "Textiles Premium",
    peso: "120kg",
    estado: "VERIFICADO",
    productos: [
      { id: "P2", nombre: "Licuadora Profesional", precio: 50, enviado: 20, recibido: 20, danado: 0 }
    ]
  },
  {
    id: "PLT-2044",
    nombre: "Papelería Industrial",
    peso: "2,100kg",
    estado: "OK",
    productos: [
      { id: "P3", nombre: "Soporte de TV de Pared", precio: 30, enviado: 100, recibido: 100, danado: 0 }
    ]
  },
  {
    id: "PLT-2045",
    nombre: "Herramientas Manuales",
    peso: "65kg",
    estado: "OK",
    productos: [
      { id: "P4", nombre: "Audífonos Bluetooth", precio: 40, enviado: 50, recibido: 50, danado: 0 }
    ]
  }
];
