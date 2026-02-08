import { Link } from 'react-router-dom';

export const Header = () => {
    return (
        <header className="bg-slate-800 text-white p-4 shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                    <h1 className="text-2xl font-bold tracking-tight">掲示板</h1>
                </Link>
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
