import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';

// 特定のスレッド内の投稿（レス）一覧を表示し、新規投稿を送信できるコンポーネント
export const ThreadPosts = () => {
    // === URLパラメータの取得 ===
    // App.jsx で設定したルーティングのパス "/threads/:thread_id" から ":thread_id" 部分を抽出します
    const { thread_id } = useParams();

    // === 状態（State）の定義 ===
    // posts: 投稿データの配列（初期値は空配列）
    const [posts, setPosts] = useState([]);
    // loading: 初回の投稿データ取得中のローディング状態
    const [loading, setLoading] = useState(true);
    // error: データ取得時のエラーメッセージ
    const [error, setError] = useState(null);

    // 新規投稿用のフォームの状態
    // newPost: テキストエリアに入力中の投稿内容
    const [newPost, setNewPost] = useState('');
    // submitting: 投稿を送信中であるかを表す状態
    const [submitting, setSubmitting] = useState(false);
    // submitError: 投稿送信時のエラーメッセージ
    const [submitError, setSubmitError] = useState(null);

    // === 投稿一覧を取得する関数（useCallbackでメモ化） ===
    // useEffect の依存関係にこの関数を含める必要があるため、
    // 依存関係である [thread_id] が変わらない限り、同じ関数インスタンスを再利用（メモ化）します。
    // これにより、不要な再レンダリングや useEffect の無限ループを防ぎます。
    const fetchPosts = useCallback(async () => {
        try {
            // クエリパラメータ offset=0 を付与してAPIから投稿データを取得
            const response = await fetch(`https://railway.bulletinboard.techtrain.dev/threads/${thread_id}/posts?offset=0`);
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();
            // 取得したデータ内の posts 配列を設定
            setPosts(data.posts);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [thread_id]);

    // === 副作用（Effect）の定義 ===
    // コンポーネントの初回描画時、または fetchPosts（つまり thread_id）が変化したときに実行
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // === 新規投稿の送信ハンドラー ===
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        setSubmitting(true);
        setSubmitError(null);

        try {
            // APIにPOSTメソッドで新規投稿データを送信
            const response = await fetch(`https://railway.bulletinboard.techtrain.dev/threads/${thread_id}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ post: newPost.trim() }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit post');
            }

            // 送信が成功したらテキストエリアをクリアします
            setNewPost('');
            // 最新の投稿一覧をすぐに画面に反映させるために、再度データを取得します
            await fetchPosts();
        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // 1. データ取得中の表示
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
            </div>
        );
    }

    // 2. データ取得エラー時の表示
    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 shadow-sm">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
                <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
                    &larr; 一覧に戻る
                </Link>
            </div>
        );
    }

    // 3. 正常な投稿一覧と投稿フォームの表示
    return (
        // md:flex-row: PCなど広い画面（mdサイズ以上）では横並び（2カラム）、スマホ等では縦並びになります
        <div className="container mx-auto p-6 max-w-6xl flex flex-col md:flex-row gap-8">
            
            {/* カラム左側: 投稿一覧エリア */}
            <div className="flex-1">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">投稿一覧</h2>
                    <Link
                        to="/"
                        className="text-slate-500 hover:text-slate-700 font-medium transition-colors"
                    >
                        &larr; 一覧に戻る
                    </Link>
                </div>

                <div className="space-y-4">
                    {/* 投稿データをループ処理してカード型で表示 */}
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-lg shadow-sm border border-slate-200 p-5"
                        >
                            {/* whitespace-pre-wrap: 改行（\n）をHTML上でも正しく改行として描画します */}
                            <p className="text-slate-800 whitespace-pre-wrap">{post.post}</p>
                        </div>
                    ))}
                    
                    {/* まだ投稿が無い場合の表示 */}
                    {posts.length === 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-12 text-center text-slate-400">
                            まだ投稿がありません。
                        </div>
                    )}
                </div>
            </div>

            {/* カラム右側: 投稿用フォーム（PC時は画面スクロールに追従する sticky 設定） */}
            <div className="w-full md:w-80 shrink-0">
                {/* sticky top-24: PC表示時に、ヘッダーに重ならない位置（上部24px）でフォームカードを固定します */}
                <div className="sticky top-24 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold mb-4 text-slate-800">投稿する</h3>

                    {/* 送信エラー発生時の警告 */}
                    {submitError && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 mb-4 text-sm">
                            {submitError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="投稿内容を入力してください"
                            rows="5"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-800 resize-none text-sm"
                            required
                            disabled={submitting} // 送信中は入力をロック
                        />
                        <button
                            type="submit"
                            disabled={submitting || !newPost.trim()}
                            className={`
                                w-full py-3 rounded-lg font-bold text-white shadow-md transition-all
                                ${submitting || !newPost.trim()
                                    ? 'bg-slate-300 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-95'}
                            `}
                        >
                            {submitting ? '送信中...' : '投稿する'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

