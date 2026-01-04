import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">MM</span>
                        </div>
                        <span className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">
                            MatchMentor
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            to="/"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Home
                        </Link>
                        {isAuthenticated && (
                            <>
                                <Link
                                    to="/upload"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    Upload Replay
                                </Link>
                                <Link
                                    to="/coaches"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    Coaches
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
