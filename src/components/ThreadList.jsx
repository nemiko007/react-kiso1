import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const ThreadList = () => {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                const response = await fetch('https://railway.bulletinboard.techtrain.dev/threads');
                if (!response.ok) {
                    throw new Error('Failed to fetch threads');
                }
                const data = await response.json();
                setThreads(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchThreads();
    }, []);

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
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-xl font-bold mb-6 text-slate-700">新着スレッド</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {threads.map((thread) => (
                    <Link
                        key={thread.id}
                        to={`/threads/${thread.id}`}
                        className="group block bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200"
                    >
                        <div className="flex flex-col h-full">
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
            {threads.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    スレッドがありません。
                </div>
            )}
        </div>
    );
};
