import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import type { UserRole } from '../types';
import { Star, MapPin, Calendar, RefreshCcw } from 'lucide-react';

export const Profile = () => {
    const { user, setRole } = useAuth();

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="relative h-48 rounded-xl bg-gradient-to-r from-primary to-secondary overflow-hidden">
                <div className="absolute -bottom-12 left-8 flex items-end">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-24 w-24 rounded-full border-4 border-white bg-white"
                    />
                </div>
            </div>

            <div className="pt-12 px-2 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Info */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                        <p className="text-slate-500">Computer Science Student</p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4" />
                        <span>Hostel Block B, Room 101</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span>Joined Sept 2023</span>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-medium">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {user.skills.map(skill => (
                                <Badge key={skill} variant="secondary">{skill}</Badge>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                            <RefreshCcw className="h-4 w-4" /> Switch Role
                        </h3>
                        <div className="flex gap-2">
                            {(['hirer', 'solver', 'both'] as UserRole[]).map((r) => (
                                <Button
                                    key={r}
                                    size="sm"
                                    variant={user.role === r ? 'primary' : 'outline'}
                                    onClick={() => setRole(r)}
                                    className="capitalize"
                                >
                                    {r}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <div className="text-2xl font-bold text-slate-900">4.8</div>
                                <div className="text-xs text-slate-500 flex justify-center items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> Rating
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <div className="text-2xl font-bold text-slate-900">12</div>
                                <div className="text-xs text-slate-500">Jobs Done</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <div className="text-2xl font-bold text-slate-900">₹4.5k</div>
                                <div className="text-xs text-slate-500">Earned</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Reviews</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 pb-4 border-b border-slate-100 last:border-0">
                                <div className="flex justify-between">
                                    <span className="font-medium">Great work on the assignment!</span>
                                    <div className="flex text-yellow-400">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3 w-3 fill-current" />)}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500">"Delivered on time and code was clean. Highly recommended."</p>
                                <div className="text-xs text-slate-400">- Rahul K.</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reviews Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Reviews ({user.reviews})</h2>
                            <Button variant="outline" size="sm">Write a Review</Button>
                        </div>

                        <div className="grid gap-4">
                            {[1, 2, 3].map((i) => (
                                <Card key={i}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div className="h-10 w-10 rounded-full bg-slate-200 flex-shrink-0" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-medium text-slate-900">Student User {i}</h3>
                                                    <span className="text-xs text-slate-500">2 days ago</span>
                                                </div>
                                                <div className="flex text-yellow-400 mb-2">
                                                    {"★".repeat(5)}
                                                </div>
                                                <p className="text-slate-600 text-sm">
                                                    Great work! Delivered on time and the quality was excellent. Highly recommended.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
