import { MagnifyingGlassIcon, BellIcon, Cog8ToothIcon } from '@heroicons/react/24/outline';

export default function Header({ placeholder = "Buscar auditorías, envíos o reportes...", subtitle }) {
  return (
    <header className="h-16 border-b border-[#e2e8f0] bg-white px-8 flex justify-between items-center sticky top-0 z-30">
      {/* SEARCH BAR */}
      <div className="w-96 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002d72] focus:bg-white transition-all"
        />
      </div>

      {/* RIGHT CONTROLS */}
      <div className="flex items-center gap-4">
        {subtitle && (
          <span className="text-xs font-bold bg-[#e8eef8] text-[#002d72] px-3 py-1 rounded-full border border-[#002d72]/10 uppercase tracking-wider">
            {subtitle}
          </span>
        )}
        
        {/* BELL BUTTON */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all">
          <BellIcon className="w-5.5 h-5.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* SETTINGS BUTTON */}
        <button className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all">
          <Cog8ToothIcon className="w-5.5 h-5.5" />
        </button>

        {/* DIVIDER */}
        <div className="h-6 w-px bg-slate-200"></div>

        {/* USER PROFILE */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200">
            {/* Elegant SVG avatar of a handsome professional */}
            <svg viewBox="0 0 100 100" className="w-full h-full bg-[#e0e7ff]">
              <defs>
                <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#avatarGrad)" opacity="0.15" />
              <circle cx="50" cy="35" r="20" fill="url(#avatarGrad)" />
              <path d="M15 85 C 15 60, 85 60, 85 85" fill="url(#avatarGrad)" />
            </svg>
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-black text-slate-900 leading-tight">Admin Principal</p>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Auditor Logístico</span>
          </div>
        </div>
      </div>
    </header>
  );
}
