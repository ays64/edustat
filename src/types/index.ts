export interface Student {
  name: string
  class: string
  gender: 'М' | 'Ж'
  birthDate?: string
  familyType?: string
  subject: string
  quarter: 1 | 2 | 3 | 4
  sor1?: number
  sor2?: number
  sor3?: number
  sor4?: number
  soch?: number
  year: string
}

export interface ClassStats {
  className: string
  total: number
  boys: number
  girls: number
  avgScore: number
  excellent: number
  good: number
  satisfactory: number
  failing: number
  successRate: number
  riskGroup: number
}

export interface SubjectStats {
  subject: string
  avgScore: number
  sorAvg: number
  sochAvg: number
}

export interface QuarterStats {
  quarter: number
  avgScore: number
  excellent: number
  successRate: number
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  uploadedAt: Date
  studentCount: number
  status: 'success' | 'error'
  error?: string
}

export type ReportType =
  | 'sor'
  | 'soch'
  | 'performance'
  | 'class-composition'
  | 'quarterly'
  | 'annual'

export interface ReportParams {
  type: ReportType
  classes: string[]
  quarter?: number
  subject?: string
  format: 'xlsx' | 'docx'
  year: string
}
