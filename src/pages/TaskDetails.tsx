import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_TASKS, MOCK_USERS } from '../lib/mockData';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/Card';
import { PaymentModal } from '../components/PaymentModal';
import { Calendar, DollarSign, MapPin, User as UserIcon, MessageSquare, CheckCircle, FileText, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { TaskStatus } from '../types';

export const TaskDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const task = MOCK_TASKS.find(t => t.id === id);

    // Local state for UI interactions
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [offerPrice, setOfferPrice] = useState(task?.price.toString() || '');
    const [offerMessage, setOfferMessage] = useState('');
    const [hasOffered, setHasOffered] = useState(false);

    // Payment & Assignment State
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<{ id: string, user: typeof MOCK_USERS[0], price: number } | null>(null);
    const [taskStatus, setTaskStatus] = useState<TaskStatus>(task?.status || 'Open');
    const [assignedUser, setAssignedUser] = useState(task?.assignedTo);

    if (!task) {
        return <div className="text-center py-12">Task not found</div>;
    }

    const handleMakeOffer = (e: React.FormEvent) => {
        e.preventDefault();
        setHasOffered(true);
        setIsOfferModalOpen(false);
    };

    const handleAcceptOffer = (offer: any) => {
        setSelectedOffer(offer);
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = () => {
        setIsPaymentModalOpen(false);
        setTaskStatus('In Progress');
        if (selectedOffer) {
            setAssignedUser(selectedOffer.user);
        }
    };

    // Mock Offers Data
    const OFFERS = [
        { id: '1', user: MOCK_USERS[1], price: task.price, message: "I can do this by tomorrow evening.", time: "10 mins ago" },
        { id: '2', user: MOCK_USERS[2], price: task.price - 50, message: "Expert in this subject. Let's start.", time: "1 hour ago" },
    ];

    const isHirer = user?.role === 'hirer' || user?.role === 'both';
    const isSolver = user?.role === 'solver' || user?.role === 'both';

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Payment Modal */}
            {selectedOffer && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onSuccess={handlePaymentSuccess}
                    amount={selectedOffer.price}
                    solverName={selectedOffer.user.name}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">{task.category}</Badge>
                            <Badge variant={taskStatus === 'Open' ? 'outline' : 'secondary'} className={taskStatus === 'In Progress' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}>
                                {taskStatus}
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">{task.title}</h1>
                        <div className="flex items-center gap-4 text-slate-500">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Due {new Date(task.deadline).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>Hostel Block A</span>
                            </div>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-slate-600 leading-relaxed">
                                {task.description}
                            </p>

                            {/* Printing Specific Details */}
                            {task.category === 'Printing' && task.printOptions && (
                                <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                        <FileText className="h-4 w-4" /> Printing Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-slate-500 block">Color Mode</span>
                                            <span className="font-medium">{task.printOptions.color ? 'Color' : 'Black & White'}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block">Sides</span>
                                            <span className="font-medium capitalize">{task.printOptions.sides}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block">Binding</span>
                                            <span className="font-medium">{task.printOptions.binding ? 'Yes (Spiral)' : 'No'}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block">Copies</span>
                                            <span className="font-medium">{task.printOptions.copies}</span>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-slate-200">
                                        <span className="text-slate-500 block text-xs uppercase tracking-wider font-semibold mb-1">Drop-off Location</span>
                                        <p className="text-slate-900">{task.printOptions.dropOffLocation}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Offers Section (Visible to Hirer) */}
                    {isHirer && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900">Offers ({OFFERS.length})</h2>
                            {taskStatus === 'Open' ? (
                                OFFERS.map((offer) => (
                                    <Card key={offer.id}>
                                        <CardContent className="p-6 flex items-start justify-between gap-4">
                                            <div className="flex gap-4">
                                                <img src={offer.user.avatar} alt={offer.user.name} className="h-10 w-10 rounded-full bg-slate-100" />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-slate-900">{offer.user.name}</h3>
                                                        <span className="text-xs text-slate-500">• {offer.time}</span>
                                                    </div>
                                                    <p className="text-slate-600 text-sm mt-1">{offer.message}</p>
                                                    <div className="flex items-center gap-1 mt-2 text-green-600 font-medium">
                                                        <DollarSign className="h-4 w-4" />
                                                        <span>₹{offer.price}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Link to="/messages">
                                                    <Button variant="outline" size="sm" className="w-full">Chat</Button>
                                                </Link>
                                                <Button size="sm" onClick={() => handleAcceptOffer(offer)}>Accept</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Card className="bg-green-50 border-green-200">
                                    <CardContent className="p-6 flex items-center gap-4">
                                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                            <CheckCircle className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-green-900">Task Assigned</h3>
                                            <p className="text-green-700 text-sm">
                                                This task has been assigned to <span className="font-semibold">{assignedUser?.name}</span>.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* Delivery & Dispute Section */}
                    {taskStatus === 'In Progress' && isSolver && (
                        <Card className="border-blue-200 bg-blue-50">
                            <CardHeader>
                                <CardTitle className="text-blue-900">Submit Work</CardTitle>
                                <CardDescription className="text-blue-700">
                                    Upload your files or provide a link to complete this task.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4">
                                    <Button className="flex-1" onClick={() => setTaskStatus('Delivered')}>
                                        <FileText className="h-4 w-4 mr-2" /> Upload Files
                                    </Button>
                                    <Button variant="outline" className="flex-1 bg-white" onClick={() => setTaskStatus('Delivered')}>
                                        Mark as Delivered
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {taskStatus === 'Delivered' && isHirer && (
                        <Card className="border-orange-200 bg-orange-50">
                            <CardHeader>
                                <CardTitle className="text-orange-900">Review Delivery</CardTitle>
                                <CardDescription className="text-orange-700">
                                    The solver has marked this task as delivered. Please review the work.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4">
                                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => setTaskStatus('Completed')}>
                                        <CheckCircle className="h-4 w-4 mr-2" /> Accept & Release Payment
                                    </Button>
                                    <Button variant="danger" className="flex-1" onClick={() => setTaskStatus('Disputed')}>
                                        <AlertTriangle className="h-4 w-4 mr-2" /> Report Issue
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {taskStatus === 'Completed' && (
                        <Card className="bg-slate-900 text-white">
                            <CardContent className="p-8 text-center space-y-4">
                                <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle className="h-8 w-8 text-green-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Task Completed</h2>
                                    <p className="text-slate-400">Payment has been released to the solver.</p>
                                </div>
                                <Link to="/profile">
                                    <Button variant="secondary" className="mt-4">Leave a Review</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <div className="text-center space-y-2">
                                <span className="text-slate-500 text-sm">Budget</span>
                                <div className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-1">
                                    <DollarSign className="h-6 w-6 text-slate-400" />
                                    {task.price}
                                </div>
                            </div>

                            {isSolver && taskStatus === 'Open' && (
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={() => setIsOfferModalOpen(true)}
                                    disabled={hasOffered}
                                >
                                    {hasOffered ? 'Offer Sent' : 'Make an Offer'}
                                </Button>
                            )}

                            {taskStatus !== 'Open' && (
                                <div className="p-3 bg-slate-100 rounded-lg text-center text-sm text-slate-600 font-medium">
                                    Applications Closed
                                </div>
                            )}

                            <div className="pt-6 border-t border-slate-100 space-y-4">
                                <div className="flex items-center gap-3">
                                    <img src={task.author.avatar} alt={task.author.name} className="h-10 w-10 rounded-full bg-slate-100" />
                                    <div>
                                        <h3 className="font-medium text-slate-900">{task.author.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <UserIcon className="h-3 w-3" />
                                            <span>Hirer</span>
                                        </div>
                                    </div>
                                </div>
                                <Link to="/messages">
                                    <Button variant="outline" className="w-full">
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Chat with Hirer
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Safety Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-500 space-y-2">
                            <p>• Keep all communications within the app.</p>
                            <p>• Do not pay outside the platform.</p>
                            <p>• Verify the work before releasing payment.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Make Offer Modal */}
            {isOfferModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-md animate-in fade-in zoom-in duration-200">
                        <CardHeader>
                            <CardTitle>Make an Offer</CardTitle>
                            <CardDescription>
                                Set your price and tell the hirer why you're the best fit.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleMakeOffer} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-1 block">Your Price (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full h-10 px-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        value={offerPrice}
                                        onChange={(e) => setOfferPrice(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-1 block">Message</label>
                                    <textarea
                                        className="w-full h-24 px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                                        placeholder="I can help you with this..."
                                        value={offerMessage}
                                        onChange={(e) => setOfferMessage(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsOfferModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" className="flex-1">Send Offer</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};
