import { useDataStore } from '../store/dataStore'
import { getClassStats } from '../utils/analytics'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function ClassesPage() {
  const { getFilteredStudents } = useDataStore()
  const students = getFilteredStudents()
  const classStats = getClassStats(students)

  if (!students.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <p className="text-lg">Нет данных</p>
        <p className="text-sm mt-1">Загрузите файл в разделе «Загрузка данных»</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold text-white">Классы</h2>

      {/* Summary table */}
      <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e3a5f] text-slate-400">
              {['Класс','Учеников','М','Д','Ср. балл','Отличники','Успев. %','Риск'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3a5f]">
            {classStats.map(c => (
              <tr key={c.className} className="hover:bg-[#1e3a5f]/30 transition-colors">
                <td className="px-4 py-3 text-white font-medium">{c.className}</td>
                <td className="px-4 py-3 text-slate-300">{c.total}</td>
                <td className="px-4 py-3 text-blue-400">{c.boys}</td>
                <td className="px-4 py-3 text-pink-400">{c.girls}</td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${c.avgScore >= 4 ? 'text-green-400' : c.avgScore >= 3 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {c.avgScore}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">{c.excellent}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-[#1e3a5f] overflow-hidden">
                      <div className="h-full rounded-full bg-[#00BCD4]" style={{ width: `${c.successRate}%`}}/>
                    </div>
                    <span className="text-slate-300">{c.successRate}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${c.riskGroup > 0 ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>
                    {c.riskGroup}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Per-class gender charts */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {classStats.map(c => (
          <div key={c.className} className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-4">
            <p className="text-sm font-semibold text-white mb-2">{c.className}</p>
            <p className="text-xs text-slate-500 mb-2">{c.total} учеников</p>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={[{name:'М',value:c.boys},{name:'Д',value:c.girls}]} cx="50%" cy="50%" innerRadius={28} outerRadius={46} dataKey="value">
                  <Cell fill="#1565C0"/>
                  <Cell fill="#FFB300"/>
                </Pie>
                <Tooltip contentStyle={{ background:'#0d1f3c', border:'1px solid #1e3a5f', borderRadius:6, fontSize:12 }} itemStyle={{ color:'#94a3b8' }}/>
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: '#94a3b8' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  )
}
