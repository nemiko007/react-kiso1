import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';

export const ThreadPosts = () => {
    const { thread_id } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // New post state
    const [newPost, setNewPost] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const fetchPosts = useCallback(async () => {
        try {
            const response = await fetch(`https://railway.bulletinboard.techtrain.dev/threads/${thread_id}/posts?offset=0`);
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();
            setPosts(data.posts);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [thread_id]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        setSubmitting(true);
        setSubmitError(null);

        try {
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

            setNewPost('');
            // Refetch posts immediately
            await fetchPosts();
        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
            </div>
        );
    }

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

    return (
        <div className="container mx-auto p-6 max-w-6xl flex flex-col md:flex-row gap-8">
            {/* Posts List */}
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
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-lg shadow-sm border border-slate-200 p-5"
                        >
                            <p className="text-slate-800 whitespace-pre-wrap">{post.post}</p>
                        </div>
                    ))}
                    {posts.length === 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-12 text-center text-slate-400">
                            まだ投稿がありません。
                        </div>
                    )}
                </div>
            </div>

            {/* Post Form */}
            <div className="w-full md:w-80 shrink-0">
                <div className="sticky top-24 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold mb-4 text-slate-800">投稿する</h3>

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
                            disabled={submitting}
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
