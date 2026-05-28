// react-router-dom の Link コンポーネントをインポートします。
// <a> タグと似ていますが、ページ全体をリロードせずに高速に画面遷移（SPAの遷移）を実現します。
import { Link } from 'react-router-dom';

// 画面共通のヘッダーコンポーネント
export const Header = () => {
    return (
        // bg-slate-800: 背景をダークグレーに設定
        // text-white: テキストカラーを白に設定
        // shadow-md: 下部に影をつけて立体感を出す
        // sticky top-0 z-50: スクロール時に画面上部に固定
        <header className="bg-slate-800 text-white p-4 shadow-md sticky top-0 z-50">
            {/* container mx-auto: 中央寄せ＆最大幅の設定 */}
            {/* flex justify-between items-center: 左右端に要素を配置し、上下中央に揃える */}
            <div className="container mx-auto flex justify-between items-center">
                
                {/* ロゴ部分: クリックするとトップページ（"/"）に遷移します */}
                <Link to="/" className="hover:opacity-80 transition-opacity">
                    <h1 className="text-2xl font-bold tracking-tight">掲示板</h1>
                </Link>
                
                {/* スレッド新規作成ページへのリンクボタン */}
                <Link
                    to="/threads/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                    スレッドをたてる
                </Link>
            </div>
        </header>
    );
};

