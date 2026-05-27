import * as XLSX from 'xlsx'
import type { Student } from '../types'

const COLUMN_ALIASES: Record<string, keyof Student> = {
  'фио': 'name', 'фамилия': 'name', 'имя': 'name', 'ученик': 'name',
  'класс': 'class',
  'пол': 'gender',
  'дата рождения': 'birthDate', 'дата': 'birthDate',
  'состав семьи': 'familyType', 'семья': 'familyType',
  'предмет': 'subject', 'дисциплина': 'subject',
  'четверть': 'quarter',
  'сор 1': 'sor1', 'сор1': 'sor1', 'sor1': 'sor1',
  'сор 2': 'sor2', 'сор2': 'sor2', 'sor2': 'sor2',
  'сор 3': 'sor3', 'сор3': 'sor3', 'sor3': 'sor3',
  'сор 4': 'sor4', 'сор4': 'sor4', 'sor4': 'sor4',
  'соч': 'soch', 'сoч': 'soch', 'soch': 'soch',
  'учебный год': 'year', 'год': 'year',
}

export function parseExcelFile(file: File): Promise<Student[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const sheet = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' }) as Record<string, unknown>[]

        if (rows.length === 0) {
          reject(new Error('Файл пустой или неверный формат'))
          return
        }

        const students: Student[] = rows.map(row => {
          const mapped: Partial<Student> = {}
          for (const [key, val] of Object.entries(row)) {
            const alias = COLUMN_ALIASES[key.toLowerCase().trim()]
            if (alias) {
              if (['sor1','sor2','sor3','sor4','soch'].includes(alias)) {
                (mapped as Record<string, unknown>)[alias] = Number(val) || 0
              } else if (alias === 'quarter') {
                (mapped as Record<string, unknown>)[alias] = Number(val) as 1|2|3|4
              } else {
                (mapped as Record<string, unknown>)[alias] = String(val)
              }
            }
          }
          return {
            name: mapped.name || 'Неизвестно',
            class: mapped.class || '—',
            gender: (String(mapped.gender).toLowerCase() === 'ж') ? 'Ж' : 'М',
            birthDate: mapped.birthDate,
            familyType: mapped.familyType,
            subject: mapped.subject || '—',
            quarter: (mapped.quarter as 1|2|3|4) || 1,
            sor1: mapped.sor1,
            sor2: mapped.sor2,
            sor3: mapped.sor3,
            sor4: mapped.sor4,
            soch: mapped.soch,
            year: mapped.year || '2024–2025',
          } as Student
        }).filter(s => s.name !== 'Неизвестно' || s.subject !== '—')

        resolve(students)
      } catch (err) {
        reject(new Error('Не удалось прочитать файл: ' + (err as Error).message))
      }
    }
    reader.onerror = () => reject(new Error('Ошибка чтения файла'))
    reader.readAsArrayBuffer(file)
  })
}

export function generateTemplateFile() {
  const template = [
    {
      'ФИО': 'Иванов Иван Иванович',
      'Класс': '9А',
      'Пол': 'М',
      'Дата рождения': '01.01.2009',
      'Состав семьи': 'полная',
      'Предмет': 'Математика',
      'Четверть': 1,
      'СОР 1': 8,
      'СОР 2': 7,
      'СОР 3': 9,
      'СОР 4': 8,
      'СОЧ': 16,
      'Учебный год': '2024–2025',
    },
  ]
  const ws = XLSX.utils.json_to_sheet(template)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Данные')
  XLSX.writeFile(wb, 'шаблон_edustat.xlsx')
}
