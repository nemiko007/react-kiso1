import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// スレッド一覧を表示するコンポーネント
export const ThreadList = () => {
    // === 状態（State）の定義 ===
    // threads: 取得したスレッド一覧データを保持する配列（初期値は空配列 []）
    const [threads, setThreads] = useState([]);
    // loading: APIからのデータ取得中であるかを表す真偽値（初期値は true）
    const [loading, setLoading] = useState(true);
    // error: エラーメッセージを保持する状態（エラーがなければ null）
    const [error, setError] = useState(null);

    // === 副作用（Effect）の定義 ===
    // コンポーネントがマウント（画面に最初に描画）されたときに、一度だけ実行される処理です。
    // 第二引数の空配列 [] が「最初の1回だけ実行する」ことを指定しています。
    useEffect(() => {
        // 非同期（async/await）でスレッドデータを取得する関数
        const fetchThreads = async () => {
            try {
                // APIにリクエストを送信してレスポンスを待ちます（非同期処理）
                const response = await fetch('https://railway.bulletinboard.techtrain.dev/threads');
                
                // レスポンスが正常（ステータスコード 200〜299）でない場合はエラーをスロー
                if (!response.ok) {
                    throw new Error('Failed to fetch threads');
                }
                
                // レスポンスのJSONデータをパース（解析）します
                const data = await response.json();
                
                // 取得したデータを threads 状態に保存
                setThreads(data);
            } catch (err) {
                // エラーが発生した場合（通信エラーなど）はエラー内容を保存
                setError(err.message);
            } finally {
                // 成功・失敗に関わらず、読み込み処理が終わったら loading を false にする
                setLoading(false);
            }
        };

        // データ取得関数を実行
        fetchThreads();
    }, []);

    // 1. ローディング状態の表示
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                {/* ぐるぐる回転するアニメーション用のスピナー */}
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
            </div>
        );
    }

    // 2. エラー発生時の表示
    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 shadow-sm">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    // 3. 正常な一覧表示
    return (
        <div className="container mx-auto p-6">
            <h2 className="text-xl font-bold mb-6 text-slate-700">新着スレッド</h2>
            
            {/* グリッドレイアウト（画面幅に応じて、1列、2列、3列に可変） */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* .map() を使ってスレッド配列を1件ずつループ処理し、JSXに変換します */}
                {threads.map((thread) => (
                    <Link
                        // Reactが要素の追加・削除・並び替えを効率的に追跡できるよう、一意の key を設定します
                        key={thread.id}
                        // 各スレッドのIDに基づいた動的URL（例: /threads/123）に遷移します
                        to={`/threads/${thread.id}`}
                        className="group block bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200"
                    >
                        <div className="flex flex-col h-full">
                            {/* group-hover: 親要素（Link）にホバーした時に文字色を青に変えます */}
                            {/* line-clamp-2: タイトルが長い場合に最大2行で省略表示（...）にします */}
                            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {thread.title}
                            </h3>
                            <div className="mt-auto pt-4 flex justify-end">
                                <span className="text-xs font-medium text-slate-400 group-hover:text-slate-500 uppercase tracking-wider">
                                    Details &rarr;
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            
            {/* スレッドが1件も存在しない場合のフォールバック表示 */}
            {threads.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    スレッドがありません。
                </div>
            )}
        </div>
    );
};

