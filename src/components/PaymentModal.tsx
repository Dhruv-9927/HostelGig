import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { CreditCard, Banknote, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    amount: number;
    solverName: string;
}

export const PaymentModal = ({ isOpen, onClose, onSuccess, amount, solverName }: PaymentModalProps) => {
    const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');
    const [selectedMethod, setSelectedMethod] = useState<'upi' | 'cash' | null>(null);

    if (!isOpen) return null;

    const handlePayment = async () => {
        setStep('processing');
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setStep('success');
        // Auto close after success
        setTimeout(() => {
            onSuccess();
            setStep('method'); // Reset for next time
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md animate-in fade-in zoom-in duration-200">
                {step === 'method' && (
                    <>
                        <CardHeader>
                            <CardTitle>Secure Payment</CardTitle>
                            <CardDescription>
                                Hold ₹{amount} in escrow for {solverName}.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div
                                onClick={() => setSelectedMethod('upi')}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                                    selectedMethod === 'upi' ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200 hover:border-slate-300"
                                )}
                            >
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium">UPI / Online</h4>
                                    <p className="text-xs text-slate-500">GPay, PhonePe, Paytm</p>
                                </div>
                                {selectedMethod === 'upi' && <div className="h-4 w-4 rounded-full bg-primary" />}
                            </div>

                            <div
                                onClick={() => setSelectedMethod('cash')}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                                    selectedMethod === 'cash' ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200 hover:border-slate-300"
                                )}
                            >
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <Banknote className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium">Cash on Delivery</h4>
                                    <p className="text-xs text-slate-500">Pay when work is done</p>
                                </div>
                                {selectedMethod === 'cash' && <div className="h-4 w-4 rounded-full bg-primary" />}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between gap-4">
                            <Button variant="ghost" onClick={onClose} className="w-full">Cancel</Button>
                            <Button
                                className="w-full"
                                disabled={!selectedMethod}
                                onClick={handlePayment}
                            >
                                Pay ₹{amount}
                            </Button>
                        </CardFooter>
                    </>
                )}

                {step === 'processing' && (
                    <div className="p-12 flex flex-col items-center text-center space-y-4">
                        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <h3 className="font-medium text-lg">Processing Payment...</h3>
                        <p className="text-slate-500 text-sm">Please do not close this window.</p>
                    </div>
                )}

                {step === 'success' && (
                    <div className="p-12 flex flex-col items-center text-center space-y-4">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-in zoom-in duration-300">
                            <CheckCircle className="h-8 w-8" />
                        </div>
                        <h3 className="font-bold text-xl text-slate-900">Payment Successful!</h3>
                        <p className="text-slate-500 text-sm">
                            Amount is held securely. Task is now assigned.
                        </p>
                    </div>
                )}
            </Card>
        </div>
    );
};
