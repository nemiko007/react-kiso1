import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { ThreadList } from './components/ThreadList'
import { NewThread } from './components/NewThread'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<ThreadList />} />
            <Route path="/threads/new" element={<NewThread />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
