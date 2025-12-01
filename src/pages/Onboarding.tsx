import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from '../components/Card';
import type { UserRole } from '../types';
import { Briefcase, Coins, Layers } from 'lucide-react';
import { cn } from '../lib/utils';

export const Onboarding = () => {
    const { setRole } = useAuth();
    const navigate = useNavigate();

    const handleRoleSelect = (role: UserRole) => {
        setRole(role);
        navigate('/');
    };

    const RoleCard = ({
        role,
        title,
        description,
        icon: Icon,
        colorClass
    }: {
        role: UserRole;
        title: string;
        description: string;
        icon: any;
        colorClass: string;
    }) => (
        <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 group"
            onClick={() => handleRoleSelect(role)}
        >
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className={cn("p-4 rounded-full bg-slate-100 group-hover:bg-white transition-colors", colorClass)}>
                    <Icon className="h-8 w-8" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                    <p className="text-sm text-slate-500 mt-2">{description}</p>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-12">
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-4xl font-bold text-slate-900">How do you want to use HostelGig?</h1>
                <p className="text-lg text-slate-600">Choose your primary goal. You can always change this later.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
                <RoleCard
                    role="hirer"
                    title="I want to Hire"
                    description="Post tasks, assignments, and printing requests for others to do."
                    icon={Briefcase}
                    colorClass="text-blue-600 group-hover:text-blue-700 bg-blue-50 group-hover:bg-blue-100"
                />
                <RoleCard
                    role="solver"
                    title="I want to Earn"
                    description="Browse gigs, complete tasks, and earn money in your free time."
                    icon={Coins}
                    colorClass="text-green-600 group-hover:text-green-700 bg-green-50 group-hover:bg-green-100"
                />
                <RoleCard
                    role="both"
                    title="I want to do Both"
                    description="Flexible! I want to post tasks and also earn money when I can."
                    icon={Layers}
                    colorClass="text-purple-600 group-hover:text-purple-700 bg-purple-50 group-hover:bg-purple-100"
                />
            </div>
        </div>
    );
};
