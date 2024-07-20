import { Router, Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).send('User registered');
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        // Create JWT payload
        const payload = {
            id: user._id,
            username: user.username
        };

        // Generate JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        // Send token in response
        res.json({ token });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
