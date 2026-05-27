import { useDataStore } from '../store/dataStore'
import KPICard from '../components/Dashboard/KPICard'
import { getKPIs, getSubjectStats, getQuarterStats } from '../utils/analytics'
import { Users, Star, TrendingUp, AlertTriangle } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts'

const COLORS = ['#1565C0', '#2196F3', '#00BCD4', '#FFB300', '#FF6B6B']

export default function DashboardPage() {
  const { getFilteredStudents } = useDataStore()
  const students = getFilteredStudents()

  if (!students.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 opacity-40">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        <p className="text-lg">Нет данных для отображения</p>
        <p className="text-sm mt-1">Загрузите Excel-файл в разделе «Загрузка данных»</p>
      </div>
    )
  }

  const kpi = getKPIs(students)
  const subjectStats = getSubjectStats(students).slice(0, 8)
  const quarterStats = getQuarterStats(students)

  const pieData = [
    { name: 'Отличники', value: kpi.excellent },
    { name: 'Группа риска', value: kpi.riskGroup },
    { name: 'Остальные', value: kpi.totalStudents - kpi.excellent - kpi.riskGroup },
  ].filter(d => d.value > 0)

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold text-white">Дашборд</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Учеников" value={kpi.totalStudents} sub="в выборке" icon={<Users size={22}/>} color="#1565C0"/>
        <KPICard label="Средний балл" value={kpi.avgScore} sub="по всем предметам" icon={<Star size={22}/>} color="#FFB300"/>
        <KPICard label="Успеваемость" value={`${kpi.successRate}%`} sub="сдали на 3 и выше" icon={<TrendingUp size={22}/>} color="#00BCD4"/>
        <KPICard label="Группа риска" value={kpi.riskGroup} sub="неуспевающих" icon={<AlertTriangle size={22}/>} color="#FF6B6B"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject chart */}
        <div className="lg:col-span-2 bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Средний балл по предметам</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={subjectStats} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f"/>
              <XAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} angle={-20} textAnchor="end" height={50}/>
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 5]}/>
              <Tooltip contentStyle={{ background: '#0d1f3c', border: '1px solid #1e3a5f', borderRadius: 8 }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#94a3b8' }}/>
              <Bar dataKey="avgScore" name="Балл" fill="#1565C0" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Состав по успеваемости</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="45%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0)*100).toFixed(0)}%`} labelLine={false}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Pie>
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quarter chart */}
      <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Динамика по четвертям</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={quarterStats.filter(q => q.avgScore > 0)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f"/>
            <XAxis dataKey="quarter" tickFormatter={q => `${q} четв.`} tick={{ fill: '#94a3b8', fontSize: 12 }}/>
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 5]}/>
            <Tooltip contentStyle={{ background: '#0d1f3c', border: '1px solid #1e3a5f', borderRadius: 8 }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#94a3b8' }}/>
            <Line type="monotone" dataKey="avgScore" name="Ср. балл" stroke="#FFB300" strokeWidth={2} dot={{ fill: '#FFB300', r: 4 }}/>
            <Line type="monotone" dataKey="successRate" name="Успев. %" stroke="#00BCD4" strokeWidth={2} dot={{ fill: '#00BCD4', r: 4 }}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
