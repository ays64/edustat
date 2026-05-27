import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import type { Student } from '../types'
import { getClassStats, getSubjectStats, getQuarterStats } from './analytics'

export function exportPerformanceExcel(students: Student[], params: { class: string; year: string }) {
  const wb = XLSX.utils.book_new()

  const classStats = getClassStats(students)
  const summaryData = classStats.map(c => ({
    'Класс': c.className,
    'Учеников': c.total,
    'М': c.boys,
    'Д': c.girls,
    'Средний балл': c.avgScore,
    'Отличники': c.excellent,
    'Хорошисты': c.good,
    'Успеваемость (%)': c.successRate,
    'Группа риска': c.riskGroup,
  }))
  const wsSummary = XLSX.utils.json_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Сводная')

  const subjectStats = getSubjectStats(students)
  const subjectData = subjectStats.map(s => ({
    'Предмет': s.subject,
    'Средний балл': s.avgScore,
    'СОР (сред.)': s.sorAvg,
    'СОЧ (сред.)': s.sochAvg,
  }))
  const wsSubjects = XLSX.utils.json_to_sheet(subjectData)
  XLSX.utils.book_append_sheet(wb, wsSubjects, 'По предметам')

  const quarterData = getQuarterStats(students).map(q => ({
    'Четверть': q.quarter,
    'Средний балл': q.avgScore,
    'Отличники': q.excellent,
    'Успеваемость (%)': q.successRate,
  }))
  const wsQuarters = XLSX.utils.json_to_sheet(quarterData)
  XLSX.utils.book_append_sheet(wb, wsQuarters, 'По четвертям')

  const fileName = `${params.class}_Успеваемость_${params.year}.xlsx`.replace(/\s+/g, '_')
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), fileName)
}

export function exportSorExcel(students: Student[], cls: string, year: string) {
  const wb = XLSX.utils.book_new()

  const quarters = [1, 2, 3, 4] as const
  quarters.forEach(q => {
    const ss = students.filter(s => s.quarter === q)
    if (!ss.length) return
    const data = ss.map(s => ({
      'ФИО': s.name,
      'Класс': s.class,
      'Предмет': s.subject,
      'СОР 1': s.sor1 ?? '',
      'СОР 2': s.sor2 ?? '',
      'СОР 3': s.sor3 ?? '',
      'СОР 4': s.sor4 ?? '',
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, `${q} четверть`)
  })

  const fileName = `${cls}_СОР_${year}.xlsx`.replace(/\s+/g, '_')
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), fileName)
}

export function exportClassCompositionExcel(students: Student[], year: string) {
  const classStats = getClassStats(students)
  const data = classStats.map(c => ({
    'Класс': c.className,
    'Всего': c.total,
    'Мальчики': c.boys,
    'Девочки': c.girls,
    'Средний балл': c.avgScore,
    'Отличники': c.excellent,
    'Успеваемость (%)': c.successRate,
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Состав классов')

  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), `Состав_классов_${year}.xlsx`)
}
