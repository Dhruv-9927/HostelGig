import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';
import { PlusCircle, MessageSquare, User as UserIcon, Menu, X, Home, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';

export const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Messages', path: '/messages', icon: MessageSquare },
        { name: 'Profile', path: '/profile', icon: UserIcon },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                            H
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            HostelGig
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                                        isActive ? "text-primary" : "text-slate-600"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}

                        {user?.role !== 'solver' && (
                            <Link to="/post-task">
                                <Button size="sm" className="gap-2">
                                    <PlusCircle className="h-4 w-4" />
                                    Post Task
                                </Button>
                            </Link>
                        )}

                        <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-700 hidden lg:block">{user?.name}</span>
                                <img src={user?.avatar} alt="Avatar" className="h-8 w-8 rounded-full bg-slate-200" />
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleLogout} title="Logout">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-slate-600"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <img src={user?.avatar} alt="Avatar" className="h-10 w-10 rounded-full bg-slate-200" />
                        <div>
                            <div className="font-medium">{user?.name}</div>
                            <div className="text-xs text-slate-500 capitalize">{user?.role}</div>
                        </div>
                    </div>

                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 text-slate-600"
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}

                    {user?.role !== 'solver' && (
                        <Link to="/post-task" onClick={() => setIsOpen(false)}>
                            <Button className="w-full gap-2 mt-2">
                                <PlusCircle className="h-4 w-4" />
                                Post Task
                            </Button>
                        </Link>
                    )}

                    <Button variant="ghost" className="w-full gap-2 justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            )}
        </nav>
    );
};
