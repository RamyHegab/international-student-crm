import express, { Router, Request, Response } from 'express';
import { userQueries } from '../models/queries';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

interface TokenPayload {
  userId: string;
  universityId: string;
  roleId: string;
}

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, first_name, last_name, university_id, role_id } = req.body;

    // Check if user exists
    const existingUser = await userQueries.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userQueries.create({
      email,
      password_hash: hashedPassword,
      first_name,
      last_name,
      university_id,
      role_id
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, universityId: user.university_id, roleId: user.role_id } as TokenPayload,
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await userQueries.getByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, universityId: user.university_id, roleId: user.role_id } as TokenPayload,
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    res.json(decoded);
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
