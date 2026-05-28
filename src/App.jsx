// 画面遷移（ルーティング）を実現するための react-router-dom のコンポーネントをインポートします
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// 各画面を構成する共通ヘッダーと各ページコンポーネントをインポートします
import { Header } from './components/Header'
import { ThreadList } from './components/ThreadList'
import { NewThread } from './components/NewThread'
import { ThreadPosts } from './components/ThreadPosts'
import './App.css'

function App() {
  return (
    // <BrowserRouter>: ルーティング機能を有効にするためのラッパーコンポーネントです
    <BrowserRouter>
      {/* 画面全体のコンテナ。背景色を少しグレー（bg-slate-50）にし、最小高さを画面いっぱいに設定しています */}
      <div className="min-h-screen bg-slate-50">
        {/* 全ページで共通して表示するヘッダーコンポーネント */}
        <Header />
        
        {/* 各ページのコンテンツを表示するメインエリア */}
        <main>
          {/* <Routes>: この中でURLのパスに応じたコンポーネントを切り替えます */}
          <Routes>
            {/* トップページ（パスが "/"）の時に ThreadList（スレッド一覧）を表示します */}
            <Route path="/" element={<ThreadList />} />
            
            {/* 新規スレッド作成ページ（パスが "/threads/new"）の時に NewThread を表示します */}
            <Route path="/threads/new" element={<NewThread />} />
            
            {/* スレッド詳細・投稿ページ（パスが "/threads/:thread_id"）を表示します */}
            {/* ":thread_id" は動的パラメータで、例えば "/threads/123" のように任意のIDを受け取れます */}
            <Route path="/threads/:thread_id" element={<ThreadPosts />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App

