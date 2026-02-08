import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const NewThread = () => {
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://railway.bulletinboard.techtrain.dev/threads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: title.trim() }),
            });

            if (!response.ok) {
                throw new Error('Failed to create thread');
            }

            // 成功したら一覧画面に戻る
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-2xl font-bold mb-6 text-slate-800">新規スレッド作成</h2>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-6 shadow-sm">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                            スレッドタイトル
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="スレッドのタイトルを入力してください"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-800"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <Link
                            to="/"
                            className="text-slate-500 hover:text-slate-700 font-medium transition-colors"
                        >
                            &larr; Topに戻る
                        </Link>
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
                            {loading ? '作成中...' : 'スレッドを作成する'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
