import type { Student, ClassStats, SubjectStats, QuarterStats } from '../types'

function sorAvg(s: Student): number {
  const vals = [s.sor1, s.sor2, s.sor3, s.sor4].filter(v => v !== undefined && v > 0) as number[]
  if (!vals.length) return 0
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

function score(s: Student): number {
  const sor = sorAvg(s)
  const soch = s.soch ?? 0
  if (!sor && !soch) return 0
  const sorPct = sor / 10
  const sochPct = soch / 20
  return (sorPct * 0.6 + sochPct * 0.4) * 5
}

export function getClassStats(students: Student[]): ClassStats[] {
  const byClass = new Map<string, Student[]>()
  students.forEach(s => {
    const arr = byClass.get(s.class) ?? []
    arr.push(s)
    byClass.set(s.class, arr)
  })

  return [...byClass.entries()].map(([cls, ss]) => {
    const uniqueNames = [...new Set(ss.map(s => s.name))]
    const boys = uniqueNames.filter(n => {
      const student = ss.find(s => s.name === n)
      return student?.gender === 'М'
    }).length
    const girls = uniqueNames.length - boys
    const scores = uniqueNames.map(n => {
      const records = ss.filter(s => s.name === n)
      const avg = records.map(score).reduce((a, b) => a + b, 0) / records.length
      return avg
    })
    const avg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1)
    const excellent = scores.filter(s => s >= 4.5).length
    const good = scores.filter(s => s >= 3.5 && s < 4.5).length
    const satisfactory = scores.filter(s => s >= 2.5 && s < 3.5).length
    const failing = scores.filter(s => s < 2.5).length
    return {
      className: cls,
      total: uniqueNames.length,
      boys,
      girls,
      avgScore: parseFloat(avg.toFixed(2)),
      excellent,
      good,
      satisfactory,
      failing,
      successRate: parseFloat(((uniqueNames.length - failing) / (uniqueNames.length || 1) * 100).toFixed(1)),
      riskGroup: failing + satisfactory,
    }
  }).sort((a, b) => a.className.localeCompare(b.className))
}

export function getSubjectStats(students: Student[]): SubjectStats[] {
  const bySubject = new Map<string, Student[]>()
  students.forEach(s => {
    const arr = bySubject.get(s.subject) ?? []
    arr.push(s)
    bySubject.set(s.subject, arr)
  })

  return [...bySubject.entries()].map(([subject, ss]) => {
    const sorAvgs = ss.map(sorAvg).filter(v => v > 0)
    const sochAvgs = ss.map(s => s.soch ?? 0).filter(v => v > 0)
    const allScores = ss.map(score).filter(v => v > 0)
    return {
      subject,
      avgScore: parseFloat((allScores.reduce((a, b) => a + b, 0) / (allScores.length || 1)).toFixed(2)),
      sorAvg: parseFloat((sorAvgs.reduce((a, b) => a + b, 0) / (sorAvgs.length || 1)).toFixed(2)),
      sochAvg: parseFloat((sochAvgs.reduce((a, b) => a + b, 0) / (sochAvgs.length || 1)).toFixed(2)),
    }
  }).sort((a, b) => b.avgScore - a.avgScore)
}

export function getQuarterStats(students: Student[]): QuarterStats[] {
  return [1, 2, 3, 4].map(q => {
    const ss = students.filter(s => s.quarter === q)
    const scores = ss.map(score).filter(v => v > 0)
    const avg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1)
    const excellent = scores.filter(s => s >= 4.5).length
    const failing = scores.filter(s => s < 2.5).length
    return {
      quarter: q,
      avgScore: parseFloat(avg.toFixed(2)),
      excellent,
      successRate: parseFloat(((scores.length - failing) / (scores.length || 1) * 100).toFixed(1)),
    }
  })
}

export function getKPIs(students: Student[]) {
  const uniqueNames = [...new Set(students.map(s => s.name))]
  const scores = students.map(s => {
    const sor = sorAvg(s)
    const soch = s.soch ?? 0
    if (!sor && !soch) return 0
    return (sor / 10 * 0.6 + soch / 20 * 0.4) * 5
  }).filter(v => v > 0)

  const avg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1)
  const excellent = scores.filter(s => s >= 4.5).length
  const failing = scores.filter(s => s < 2.5).length
  const successRate = (scores.length - failing) / (scores.length || 1) * 100

  return {
    totalStudents: uniqueNames.length,
    avgScore: parseFloat(avg.toFixed(2)),
    excellent,
    successRate: parseFloat(successRate.toFixed(1)),
    riskGroup: failing,
  }
}
