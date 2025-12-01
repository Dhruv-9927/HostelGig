
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
                <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
                    © {new Date().getFullYear()} HostelGig. Built for Students.
                </div>
            </footer>
        </div>
    );
};
