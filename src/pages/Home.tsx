import { useState } from 'react';
import { MOCK_TASKS } from '../lib/mockData';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Calendar, DollarSign, MapPin, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TaskCategory } from '../types';

const CATEGORIES: (TaskCategory | 'All')[] = [
    'All', 'Assignment', 'Lab File', 'Project', 'PPT', 'Coding', 'Editing', 'Printing', 'Notes', 'Poster', 'Other'
];

export const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'All'>('All');

    const filteredTasks = MOCK_TASKS.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <section className="text-center space-y-4 py-12">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
                    Get things done, <span className="text-primary">inside your hostel.</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    The marketplace for students. Outsource your assignments, printing, and projects to peers who want to earn.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    <Link to="/post-task">
                        <Button size="lg" className="rounded-full px-8">Post a Task</Button>
                    </Link>
                    <Button variant="outline" size="lg" className="rounded-full px-8" onClick={() => document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth' })}>
                        Browse Gigs
                    </Button>
                </div>
            </section>

            {/* Search & Filter Section */}
            <section id="browse" className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search for tasks (e.g., 'Physics Lab', 'Printing')..."
                            className="w-full h-10 pl-10 pr-4 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                        <Filter className="h-4 w-4 text-slate-500 shrink-0" />
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                    ? 'bg-primary text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Task Feed */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-900">
                            {selectedCategory === 'All' ? 'Latest Requests' : `${selectedCategory} Requests`}
                        </h2>
                        <span className="text-sm text-slate-500">{filteredTasks.length} results found</span>
                    </div>

                    {filteredTasks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTasks.map((task) => (
                                <Card key={task.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <Badge variant="secondary">{task.category}</Badge>
                                            <span className="text-sm text-slate-500">{new Date(task.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <CardTitle className="line-clamp-2 mt-2">{task.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                                            {task.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="h-4 w-4 text-green-600" />
                                                <span className="font-semibold text-green-600">₹{task.price}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>Due {new Date(task.deadline).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        {task.category === 'Printing' && task.printOptions && (
                                            <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                                                <MapPin className="h-3 w-3" />
                                                <span>Drop: {task.printOptions.dropOffLocation}</span>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter>
                                        <Link to={`/task/${task.id}`} className="w-full">
                                            <Button className="w-full" variant="outline">View Details</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <Search className="h-6 w-6 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No tasks found</h3>
                            <p className="text-slate-500">Try adjusting your search or filters.</p>
                            <Button
                                variant="ghost"
                                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                className="mt-2 text-primary hover:text-primary/80"
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};
