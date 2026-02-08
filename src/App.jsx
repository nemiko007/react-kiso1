import { Header } from './components/Header'
import { ThreadList } from './components/ThreadList'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main>
        <ThreadList />
      </main>
    </div>
  )
}

export default App
