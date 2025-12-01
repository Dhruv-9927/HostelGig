export type User = {
    id: string;
    name: string;
    email: string;
    avatar: string;
    rating: number;
    reviews: number;
    skills: string[];
    role?: UserRole;
    status?: 'online' | 'offline';
};

export type UserRole = 'hirer' | 'solver' | 'both';

export type TaskCategory = 'Assignment' | 'Lab File' | 'Project' | 'PPT' | 'Coding' | 'Editing' | 'Printing' | 'Notes' | 'Poster' | 'Other';

export type TaskStatus = 'Open' | 'In Progress' | 'Delivered' | 'Completed' | 'Cancelled' | 'Disputed';

export type Task = {
    id: string;
    title: string;
    description: string;
    category: TaskCategory;
    price: number;
    deadline: string;
    status: TaskStatus;
    author: User;
    assignedTo?: User;
    createdAt: string;
    // Printing specific fields
    printOptions?: {
        color: boolean;
        sides: 'single' | 'double';
        binding: boolean;
        copies: number;
        dropOffLocation: string;
        fileUrl?: string;
    };
};

export type Message = {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
};
