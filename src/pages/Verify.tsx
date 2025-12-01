import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { ShieldCheck } from 'lucide-react';

export const Verify = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { verifyOtp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const success = await verifyOtp(otp);
        setIsLoading(false);

        if (success) {
            navigate('/onboarding');
        } else {
            setError('Invalid code. Please try "1234".');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Verify it's you</CardTitle>
                    <p className="text-sm text-slate-500">We sent a code to your email. Enter it below.</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="text"
                            placeholder="1234"
                            label="Verification Code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="text-center text-2xl tracking-widest"
                            maxLength={4}
                            error={error}
                            required
                        />
                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            Verify
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                        <button className="text-sm text-primary hover:underline">Resend Code</button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
