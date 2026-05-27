import { useState } from 'react'
import { FileText, Download, FileSpreadsheet } from 'lucide-react'
import { useDataStore } from '../store/dataStore'
import { exportPerformanceExcel, exportSorExcel, exportClassCompositionExcel } from '../utils/excelExport'
import { exportPerformanceWord } from '../utils/wordExport'

const REPORT_TYPES = [
  { id: 'performance', label: 'Отчёт об успеваемости', desc: 'Сводка по классам и предметам за выбранный период' },
  { id: 'sor', label: 'Отчёт по СОР', desc: 'Баллы всех учеников за каждый СОР' },
  { id: 'class-composition', label: 'Состав классов', desc: 'Социальный портрет: пол, состав семьи, численность' },
  { id: 'quarterly', label: 'Квартальный отчёт', desc: 'Комплексный отчёт по итогам четверти' },
]

export default function ReportsPage() {
  const { getFilteredStudents, activeClass, activeYear } = useDataStore()
  const students = getFilteredStudents()
  const [selected, setSelected] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  const generate = async (format: 'xlsx' | 'docx') => {
    if (!selected || !students.length) return
    setGenerating(true)
    const cls = activeClass === 'all' ? 'Все классы' : activeClass
    try {
      if (format === 'xlsx') {
        if (selected === 'performance') exportPerformanceExcel(students, { class: cls, year: activeYear })
        else if (selected === 'sor') exportSorExcel(students, cls, activeYear)
        else if (selected === 'class-composition') exportClassCompositionExcel(students, activeYear)
        else exportPerformanceExcel(students, { class: cls, year: activeYear })
      } else {
        await exportPerformanceWord(students, cls, activeYear)
      }
    } finally {
      setGenerating(false)
    }
  }

  const empty = !students.length

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <h2 className="text-xl font-semibold text-white">Генерация отчётов</h2>

      {empty && (
        <div className="bg-[#1e3a5f]/30 border border-[#1e3a5f] rounded-xl px-5 py-4 text-sm text-slate-400">
          Данные не загружены. Перейдите в «Загрузку данных» и загрузите Excel-файл.
        </div>
      )}

      <div className="grid gap-3">
        {REPORT_TYPES.map(rt => (
          <button
            key={rt.id}
            onClick={() => setSelected(rt.id)}
            disabled={empty}
            className={`text-left p-4 rounded-xl border transition-all ${
              selected === rt.id
                ? 'border-[#1565C0] bg-[#1565C0]/15'
                : 'border-[#1e3a5f] bg-[#0d1f3c] hover:border-[#1565C0]/50'
            } ${empty ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-3">
              <FileText size={18} className={selected === rt.id ? 'text-[#1565C0]' : 'text-slate-500'}/>
              <div>
                <p className="text-sm font-medium text-white">{rt.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{rt.desc}</p>
              </div>
              {selected === rt.id && (
                <div className="ml-auto w-4 h-4 rounded-full bg-[#1565C0] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"/>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5 space-y-4">
          <p className="text-sm text-slate-400">
            Формирование: <span className="text-white font-medium">{REPORT_TYPES.find(r => r.id === selected)?.label}</span>
            {' · '}{activeClass === 'all' ? 'все классы' : activeClass}
            {activeYear ? ` · ${activeYear}` : ''}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => generate('xlsx')}
              disabled={generating}
              className="flex items-center gap-2 bg-[#1565C0] hover:bg-[#1976D2] disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              <FileSpreadsheet size={16}/>
              {generating ? 'Формирую…' : 'Скачать Excel'}
            </button>
            <button
              onClick={() => generate('docx')}
              disabled={generating}
              className="flex items-center gap-2 bg-[#0d1f3c] hover:bg-[#1e3a5f] border border-[#1e3a5f] disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              <Download size={16}/>
              {generating ? 'Формирую…' : 'Скачать Word'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
