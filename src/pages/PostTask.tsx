import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import type { TaskCategory } from '../types';
import { Upload, Printer, MapPin } from 'lucide-react';

const CATEGORIES: TaskCategory[] = [
    'Assignment', 'Lab File', 'Project', 'PPT', 'Coding', 'Editing', 'Printing', 'Notes', 'Poster', 'Other'
];

export const PostTask = () => {
    const [category, setCategory] = useState<TaskCategory>('Assignment');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert('Task Posted Successfully! (Mock)');
        }, 1500);
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Post a New Task</h1>
                <p className="text-slate-500">Fill in the details to get your work done.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Select Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${category === cat
                                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Main Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Task Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input label="Task Title" placeholder="e.g., Complete Physics Lab Manual" required />

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
                                placeholder="Describe what you need done in detail..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Budget (₹)"
                                type="number"
                                placeholder="500"
                                min="0"
                                required
                                onChange={(e) => {
                                    if (parseInt(e.target.value) < 0) e.target.value = '0';
                                }}
                            />
                            <Input label="Deadline" type="date" required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Attachment (Optional)</label>
                            <div
                                onClick={handleFileClick}
                                className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png"
                                />
                                <Upload className="h-8 w-8 mb-2" />
                                {selectedFile ? (
                                    <div className="text-center">
                                        <span className="text-sm font-medium text-primary block">{selectedFile.name}</span>
                                        <span className="text-xs text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-sm font-medium">Upload File (PDF, PPT, IMG)</span>
                                        <span className="text-xs">Max 10MB</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Printing Specific Fields */}
                {category === 'Printing' && (
                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-primary">
                                <Printer className="h-5 w-5" />
                                <CardTitle className="text-lg">Printing Options</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Color Mode</label>
                                    <select className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm">
                                        <option>Black & White</option>
                                        <option>Color</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Sides</label>
                                    <select className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm">
                                        <option>Single Sided</option>
                                        <option>Double Sided</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Binding</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="radio" name="binding" className="text-primary" /> None
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="radio" name="binding" className="text-primary" /> Spiral
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="radio" name="binding" className="text-primary" /> Hardcover
                                    </label>
                                </div>
                            </div>

                            <Input
                                label="Drop-off Location"
                                placeholder="e.g., Block A, Room 302"
                                required
                                icon={<MapPin className="h-4 w-4" />}
                            />
                        </CardContent>
                    </Card>
                )}

                <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                    Post Task
                </Button>
            </form>
        </div>
    );
};
