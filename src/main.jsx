import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Reactアプリケーションのエントリーポイント（開始点）です。
// HTMLにある "id='root'" の要素（<div>タグなど）を探し、そこにReactコンポーネントを描画します。
createRoot(document.getElementById('root')).render(
  // <StrictMode> は開発環境で潜在的なバグを見つけるためのツールです。
  // 本番環境の動作には影響しませんが、開発中に二回レンダリングされるなどの挙動をします。
  <StrictMode>
    {/* メインのアプリケーションコンポーネントである App を呼び出しています */}
    <App />
  </StrictMode>,
)

