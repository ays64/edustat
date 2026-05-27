interface Props {
  label: string
  value: string | number
  sub?: string
  color?: string
  icon: React.ReactNode
}

export default function KPICard({ label, value, sub, color = '#1565C0', icon }: Props) {
  return (
    <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}22` }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
