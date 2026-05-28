import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// 新規スレッド作成用のフォーム画面コンポーネント
export const NewThread = () => {
    // === 状態（State）の定義 ===
    // title: 入力されたスレッドのタイトル文字列を保持
    const [title, setTitle] = useState('');
    // loading: スレッドを送信中（作成処理中）であるかを表す状態（二重送信の防止などに使います）
    const [loading, setLoading] = useState(false);
    // error: エラーメッセージを保持する状態
    const [error, setError] = useState(null);

    // === ナビゲーション用のHook ===
    // 画面遷移をJavaScriptから制御するための関数を取得します（例: navigate('/') でトップ画面に戻る）
    const navigate = useNavigate();

    // === フォーム送信ハンドラー ===
    const handleSubmit = async (e) => {
        // e.preventDefault(): フォーム送信に伴うページ全体のデフォルトのリロードを防ぎます
        e.preventDefault();
        
        // 入力値の両端の空白を削除し、空文字の場合は処理を中断します
        if (!title.trim()) return;

        // 送信が始まったので、送信中状態にし、エラーをクリアします
        setLoading(true);
        setError(null);

        try {
            // POSTメソッドでスレッド作成のAPIを呼び出します
            const response = await fetch('https://railway.bulletinboard.techtrain.dev/threads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // 入力されたタイトルをJSONデータに変換してリクエストボディにセットします
                body: JSON.stringify({ title: title.trim() }),
            });

            if (!response.ok) {
                throw new Error('Failed to create thread');
            }

            // スレッド作成に成功したら、トップ画面（一覧）に強制遷移します
            navigate('/');
        } catch (err) {
            // エラーが発生した場合はエラーメッセージを設定します
            setError(err.message);
        } finally {
            // 処理が完了（成功/失敗）したのでローディングを解除します
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-2xl font-bold mb-6 text-slate-800">新規スレッド作成</h2>

                {/* エラーがある時だけ警告を表示する条件付きレンダリング */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-6 shadow-sm">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        {/* htmlFor と input の id を一致させることで、ラベルをクリックした際に入力欄にフォーカスを当てます */}
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                            スレッドタイトル
                        </label>
                        <input
                            type="text"
                            id="title"
                            // 双方向データバインディング: state を value にセットし、onChange で state を更新します
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="スレッドのタイトルを入力してください"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-800"
                            required
                            disabled={loading} // 送信中は入力できないようにします
                        />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <Link
                            to="/"
                            className="text-slate-500 hover:text-slate-700 font-medium transition-colors"
                        >
                            &larr; Topに戻る
                        </Link>
                        
                        {/* 送信中または入力文字が無いときは、ボタンを非活性化（disabled）にします */}
                        <button
                            type="submit"
                            disabled={loading || !title.trim()}
                            className={`
                                px-6 py-3 rounded-lg font-bold text-white shadow-md transition-all
                                ${loading || !title.trim()
                                    ? 'bg-slate-300 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:transform active:scale-95'}
                            `}
                        >
                            {/* 送信中かどうかに応じてボタンのラベルを切り替えます */}
                            {loading ? '作成中...' : 'スレッドを作成する'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

