import { useDataStore } from '../../store/dataStore'

export default function Header() {
  const { getYears, getClasses, activeYear, activeClass, activeQuarter, setActiveYear, setActiveClass, setActiveQuarter } = useDataStore()
  const years = getYears()
  const classes = getClasses()

  return (
    <header className="h-14 bg-[#0d1f3c] border-b border-[#1e3a5f] flex items-center px-6 gap-4">
      <div className="flex items-center gap-2 ml-auto">
        {years.length > 0 && (
          <select
            value={activeYear}
            onChange={e => setActiveYear(e.target.value)}
            className="bg-[#0a1628] border border-[#1e3a5f] text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#1565C0]"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        )}
        {classes.length > 0 && (
          <select
            value={activeClass}
            onChange={e => setActiveClass(e.target.value)}
            className="bg-[#0a1628] border border-[#1e3a5f] text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#1565C0]"
          >
            <option value="all">Все классы</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        <select
          value={activeQuarter ?? 0}
          onChange={e => setActiveQuarter(Number(e.target.value) || null)}
          className="bg-[#0a1628] border border-[#1e3a5f] text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#1565C0]"
        >
          <option value={0}>Все четверти</option>
          {[1,2,3,4].map(q => <option key={q} value={q}>{q} четверть</option>)}
        </select>
      </div>
    </header>
  )
}
