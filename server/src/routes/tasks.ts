import express from 'express';
import { createTask, getTasks, getTaskById, createOffer, acceptOffer, updateTaskStatus } from '../controllers/taskController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes (Feed)
router.get('/', getTasks);
router.get('/:id', getTaskById);

// Protected routes
router.post('/', authenticate, createTask);
router.post('/:id/offers', authenticate, createOffer);
router.patch('/:id/offers/:offerId/accept', authenticate, acceptOffer);
router.patch('/:id/status', authenticate, updateTaskStatus);

export default router;
