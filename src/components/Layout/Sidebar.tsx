import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Upload, FileText, Users } from 'lucide-react'

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Дашборд' },
  { to: '/upload', icon: Upload, label: 'Загрузка данных' },
  { to: '/reports', icon: FileText, label: 'Отчёты' },
  { to: '/classes', icon: Users, label: 'Классы' },
]

export default function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-[#0d1f3c] border-r border-[#1e3a5f] flex flex-col py-6">
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-bold text-white">Edu<span className="text-[#FFB300]">Stat</span></h1>
        <p className="text-xs text-slate-400 mt-1">Аналитика успеваемости</p>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-[#1565C0] text-white font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-[#1e3a5f]'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
