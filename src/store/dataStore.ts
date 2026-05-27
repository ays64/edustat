import { create } from 'zustand'
import type { Student, UploadedFile } from '../types'

interface DataStore {
  students: Student[]
  uploadedFiles: UploadedFile[]
  activeYear: string
  activeClass: string
  activeQuarter: number | null
  setStudents: (students: Student[], file: UploadedFile) => void
  removeFile: (id: string) => void
  setActiveYear: (year: string) => void
  setActiveClass: (cls: string) => void
  setActiveQuarter: (q: number | null) => void
  getYears: () => string[]
  getClasses: () => string[]
  getSubjects: () => string[]
  getFilteredStudents: () => Student[]
}

export const useDataStore = create<DataStore>((set, get) => ({
  students: [],
  uploadedFiles: [],
  activeYear: '',
  activeClass: 'all',
  activeQuarter: null,

  setStudents: (newStudents, file) => {
    set(state => {
      const merged = [...state.students, ...newStudents]
      const years = [...new Set(merged.map(s => s.year))]
      return {
        students: merged,
        uploadedFiles: [...state.uploadedFiles, file],
        activeYear: state.activeYear || years[0] || '',
      }
    })
  },

  removeFile: (id) => {
    set(state => ({
      uploadedFiles: state.uploadedFiles.filter(f => f.id !== id),
    }))
  },

  setActiveYear: (year) => set({ activeYear: year }),
  setActiveClass: (cls) => set({ activeClass: cls }),
  setActiveQuarter: (q) => set({ activeQuarter: q }),

  getYears: () => {
    const { students } = get()
    return [...new Set(students.map(s => s.year))].sort().reverse()
  },

  getClasses: () => {
    const { students, activeYear } = get()
    return [...new Set(
      students
        .filter(s => !activeYear || s.year === activeYear)
        .map(s => s.class)
    )].sort()
  },

  getSubjects: () => {
    const { students, activeYear } = get()
    return [...new Set(
      students
        .filter(s => !activeYear || s.year === activeYear)
        .map(s => s.subject)
    )].sort()
  },

  getFilteredStudents: () => {
    const { students, activeYear, activeClass, activeQuarter } = get()
    return students.filter(s => {
      if (activeYear && s.year !== activeYear) return false
      if (activeClass !== 'all' && s.class !== activeClass) return false
      if (activeQuarter && s.quarter !== activeQuarter) return false
      return true
    })
  },
}))
