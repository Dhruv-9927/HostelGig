import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Create a new task
export const createTask = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.userId;
        const { title, description, price, deadline, category, printOptions } = req.body;

        const taskData: any = {
            title,
            description,
            price: parseFloat(price),
            deadline: new Date(deadline),
            category,
            authorId: userId,
        };

        if (category === 'Printing' && printOptions) {
            taskData.printColor = printOptions.color;
            taskData.printSides = printOptions.sides;
            taskData.printBinding = printOptions.binding;
            taskData.printCopies = parseInt(printOptions.copies);
            taskData.dropOffLocation = printOptions.dropOffLocation;
        }

        const task = await prisma.task.create({
            data: taskData,
        });

        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create task' });
    }
};

// Get all tasks
export const getTasks = async (req: Request, res: Response) => {
    try {
        const { category, search } = req.query;

        const where: any = {
            status: 'Open', // Default to showing open tasks in feed
        };

        if (category && category !== 'All') {
            where.category = category as string;
        }

        if (search) {
            where.OR = [
                { title: { contains: search as string } }, // SQLite doesn't support mode: 'insensitive' easily without extensions, but for now this works
                { description: { contains: search as string } },
            ];
        }

        const tasks = await prisma.task.findMany({
            where,
            include: {
                author: {
                    select: { name: true, avatar: true, rating: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
};

// Get single task details
export const getTaskById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const task = await prisma.task.findUnique({
            where: { id },
            include: {
                author: {
                    select: { id: true, name: true, avatar: true, rating: true, role: true },
                },
                assignedTo: {
                    select: { id: true, name: true, avatar: true },
                },
                offers: {
                    include: {
                        solver: {
                            select: { id: true, name: true, avatar: true, rating: true },
                        },
                    },
                },
            },
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch task' });
    }
};

// Create an offer
export const createOffer = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.userId;
        const { id } = req.params; // Task ID
        const { price, message } = req.body;

        const offer = await prisma.offer.create({
            data: {
                price: parseFloat(price),
                message,
                taskId: id,
                solverId: userId,
            },
        });

        res.status(201).json(offer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create offer' });
    }
};

// Accept an offer
export const acceptOffer = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.userId;
        const { id, offerId } = req.params; // Task ID

        // Verify task belongs to user
        const task = await prisma.task.findUnique({ where: { id } });
        if (!task || task.authorId !== userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Update offer status
        await prisma.offer.update({
            where: { id: offerId },
            data: { status: 'Accepted' },
        });

        // Get offer details to find solver
        const offer = await prisma.offer.findUnique({ where: { id: offerId } });

        // Update task status and assigned user
        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                status: 'In Progress',
                assignedToId: offer?.solverId,
            },
        });

        res.json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to accept offer' });
    }
};

// Update task status (Delivery, Completion, Dispute)
export const updateTaskStatus = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.userId;
        const { id } = req.params;
        const { status } = req.body;

        const task = await prisma.task.findUnique({ where: { id } });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Authorization check: Only Author or Assigned Solver can update status
        if (task.authorId !== userId && task.assignedToId !== userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // TODO: Add specific state transition validation logic here if needed

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { status },
        });

        res.json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update status' });
    }
};
