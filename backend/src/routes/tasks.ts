import { Router, Request, Response } from 'express';
import Task from '../models/Task';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Create Task
router.post('/', verifyToken, async (req: Request, res: Response) => {
  const { title, description, priority } = req.body;
  try {
    const task = new Task({ userId: req.user?.id, title, description, priority });
    await task.save();
    res.status(201).json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get Tasks
router.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({ userId: req.user?.id });
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update Task
router.put('/:id', verifyToken, async (req: Request, res: Response) => {
  const { title, description, priority, status } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      { title, description, priority, status },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Task
router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
