import { 
  Squares2X2Icon, 
  TruckIcon, 
  ClipboardDocumentCheckIcon, 
  QuestionMarkCircleIcon, 
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';

export default function Sidebar({ vista, setVista }) {
  const menuItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: Squares2X2Icon },
    { id: 'CEDIS', label: 'Origin Dispatch', icon: TruckIcon },
    { id: 'TIENDA', label: 'Destination Audit', icon: ClipboardDocumentCheckIcon },
  ];

  return (
    <aside className="w-64 bg-[#f4f7fc] border-r border-[#e2e8f0] flex flex-col justify-between min-h-screen sticky top-0">
      <div>
        {/* LOGO AREA */}
        <div className="p-6 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#002d72] flex items-center justify-center text-white font-black text-base shadow-sm">
              LT
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight leading-none" style={{ color: '#002d72' }}>
                LogiTrust<span className="text-indigo-600 font-bold">Hub</span>
              </h1>
              <span className="text-[9px] text-[#64748b] font-bold uppercase tracking-widest mt-1.5 block">Comando Operativo</span>
            </div>
          </div>
        </div>


        {/* OPERATIONS NAVIGATION */}
        <div className="p-4">
          <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider px-3 block mb-3">
            Operaciones
          </span>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = vista === item.id || (item.id === 'TIENDA' && vista === 'ANOMALIA');
              return (
                <button
                  key={item.id}
                  onClick={() => setVista(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#002d72] text-white shadow-md shadow-[#002d72]/10'
                      : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#e8eef8]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#64748b]'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="p-4 border-t border-[#e2e8f0] space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-[#64748b] hover:text-[#0f172a] hover:bg-[#e8eef8] transition-all duration-200">
          <QuestionMarkCircleIcon className="w-5 h-5 text-[#64748b]" />
          Support
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-[#64748b] hover:text-[#e11d48] hover:bg-red-50 transition-all duration-200">
          <ArrowLeftOnRectangleIcon className="w-5 h-5 text-[#64748b] group-hover:text-red-500" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
