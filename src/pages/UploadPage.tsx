import { useRef, useState, useCallback } from 'react'
import { Upload, FileSpreadsheet, Trash2, Download, CheckCircle, XCircle } from 'lucide-react'
import { useDataStore } from '../store/dataStore'
import { parseExcelFile, generateTemplateFile } from '../utils/excelParser'
import type { UploadedFile } from '../types'

export default function UploadPage() {
  const { uploadedFiles, setStudents, removeFile } = useDataStore()
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  const processFile = useCallback(async (file: File) => {
    if (!['xlsx','xls','csv'].some(ext => file.name.toLowerCase().endsWith(ext))) {
      showToast('Неверный формат файла. Поддерживаются: XLSX, XLS, CSV', false)
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Файл слишком большой. Максимум 10 МБ', false)
      return
    }
    setLoading(true)
    try {
      const students = await parseExcelFile(file)
      const record: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        uploadedAt: new Date(),
        studentCount: students.length,
        status: 'success',
      }
      setStudents(students, record)
      showToast(`Загружено ${students.length} записей из «${file.name}»`, true)
    } catch (err) {
      showToast((err as Error).message, false)
    } finally {
      setLoading(false)
    }
  }, [setStudents])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  const formatSize = (bytes: number) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} КБ`
    : `${(bytes / 1024 / 1024).toFixed(1)} МБ`

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <h2 className="text-xl font-semibold text-white">Загрузка данных</h2>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-all ${
          dragging ? 'border-[#1565C0] bg-[#1565C0]/10' : 'border-[#1e3a5f] hover:border-[#1565C0]/50 hover:bg-[#0d1f3c]'
        }`}
      >
        <div className="w-14 h-14 rounded-full bg-[#1565C0]/20 flex items-center justify-center">
          {loading
            ? <div className="w-6 h-6 border-2 border-[#1565C0] border-t-transparent rounded-full animate-spin"/>
            : <Upload size={24} className="text-[#1565C0]"/>
          }
        </div>
        <p className="text-white font-medium">{loading ? 'Обрабатываю файл…' : 'Перетащите файл сюда или нажмите'}</p>
        <p className="text-slate-500 text-sm">XLSX, XLS, CSV — до 10 МБ</p>
        <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={onFileChange}/>
      </div>

      {/* Requirements */}
      <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
        <p className="text-sm font-medium text-slate-300 mb-3">Ожидаемые колонки файла:</p>
        <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
          {['ФИО','Класс','Пол (М/Ж)','Предмет','Четверть (1-4)','СОР 1–4','СОЧ','Учебный год'].map(col => (
            <div key={col} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1565C0]"/>
              {col}
            </div>
          ))}
        </div>
        <button
          onClick={generateTemplateFile}
          className="mt-4 flex items-center gap-2 text-sm text-[#1565C0] hover:text-[#2196F3] transition-colors"
        >
          <Download size={15}/> Скачать шаблон файла
        </button>
      </div>

      {/* File list */}
      {uploadedFiles.length > 0 && (
        <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[#1e3a5f]">
            <p className="text-sm font-medium text-slate-300">Загруженные файлы ({uploadedFiles.length})</p>
          </div>
          <div className="divide-y divide-[#1e3a5f]">
            {uploadedFiles.map(f => (
              <div key={f.id} className="flex items-center gap-3 px-5 py-3">
                <FileSpreadsheet size={18} className="text-[#00BCD4] flex-shrink-0"/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{f.name}</p>
                  <p className="text-xs text-slate-500">{formatSize(f.size)} · {f.studentCount} записей · {f.uploadedAt.toLocaleTimeString('ru-RU', {hour:'2-digit',minute:'2-digit'})}</p>
                </div>
                {f.status === 'success'
                  ? <CheckCircle size={16} className="text-green-400 flex-shrink-0"/>
                  : <XCircle size={16} className="text-red-400 flex-shrink-0"/>
                }
                <button onClick={() => removeFile(f.id)} className="text-slate-600 hover:text-red-400 transition-colors ml-1">
                  <Trash2 size={15}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium transition-all ${
          toast.ok ? 'bg-green-900/90 text-green-200 border border-green-700' : 'bg-red-900/90 text-red-200 border border-red-700'
        }`}>
          {toast.ok ? <CheckCircle size={16}/> : <XCircle size={16}/>}
          {toast.msg}
        </div>
      )}
    </div>
  )
}
