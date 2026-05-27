import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, HeadingLevel, AlignmentType, WidthType, BorderStyle,
} from 'docx'
import { saveAs } from 'file-saver'
import type { Student } from '../types'
import { getClassStats, getSubjectStats } from './analytics'

const border = {
  top: { style: BorderStyle.SINGLE, size: 1, color: '1565C0' },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: '1565C0' },
  left: { style: BorderStyle.SINGLE, size: 1, color: '1565C0' },
  right: { style: BorderStyle.SINGLE, size: 1, color: '1565C0' },
}

function cell(text: string, bold = false, shade = false) {
  return new TableCell({
    borders: border,
    shading: shade ? { fill: '1565C0' } : undefined,
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({
        text,
        bold,
        color: shade ? 'FFFFFF' : '0A1628',
        size: 20,
      })],
    })],
  })
}

export async function exportPerformanceWord(students: Student[], cls: string, year: string) {
  const classStats = getClassStats(students)
  const subjectStats = getSubjectStats(students)

  const classRows = classStats.map(c => new TableRow({
    children: [
      cell(c.className), cell(String(c.total)), cell(String(c.boys)),
      cell(String(c.girls)), cell(String(c.avgScore)), cell(String(c.excellent)),
      cell(`${c.successRate}%`), cell(String(c.riskGroup)),
    ],
  }))

  const subjectRows = subjectStats.map(s => new TableRow({
    children: [
      cell(s.subject), cell(String(s.avgScore)),
      cell(String(s.sorAvg)), cell(String(s.sochAvg)),
    ],
  }))

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: 'EduStat — Отчёт об успеваемости', bold: true, size: 32, color: '0A1628' })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `Класс: ${cls} | Учебный год: ${year}`, size: 24, color: '1565C0' })],
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: 'Успеваемость по классам', bold: true, size: 26, color: '0A1628' })],
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              tableHeader: true,
              children: ['Класс','Уч-ков','М','Д','Ср. балл','Отличники','Успев. %','Риск'].map(h => cell(h, true, true)),
            }),
            ...classRows,
          ],
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: 'Успеваемость по предметам', bold: true, size: 26, color: '0A1628' })],
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              tableHeader: true,
              children: ['Предмет','Ср. балл','СОР (сред.)','СОЧ (сред.)'].map(h => cell(h, true, true)),
            }),
            ...subjectRows,
          ],
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: `Дата формирования: ${new Date().toLocaleDateString('ru-RU')}`, size: 18, color: '64748B' })],
        }),
      ],
    }],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, `${cls}_Успеваемость_${year}.docx`.replace(/\s+/g, '_'))
}
