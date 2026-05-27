import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import DashboardPage from './pages/DashboardPage'
import UploadPage from './pages/UploadPage'
import ReportsPage from './pages/ReportsPage'
import ClassesPage from './pages/ClassesPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#0a1628]">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Header />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/classes" element={<ClassesPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
