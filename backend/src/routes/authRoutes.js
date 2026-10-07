import express from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../services/storage.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'timetable_secret_key_mrtc_2024';

router.post('/login', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const user = db.users.findByEmail(email);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
  }

  // Simple demo password check (or hashed if production)
  if (user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      facultyId: user.facultyId,
      sectionId: user.sectionId
    }
  });
});

router.post('/register', (req, res) => {
  const { name, email, password, role, department, facultyId, sectionId } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required' });
  }

  const existing = db.users.findByEmail(email);
  if (existing) {
    return res.status(400).json({ success: false, message: 'User with this email already exists' });
  }

  const newUser = db.users.create({
    name,
    email,
    password,
    role: role || 'student',
    department,
    facultyId,
    sectionId
  });

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.status(201).json({
    success: true,
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      facultyId: newUser.facultyId,
      sectionId: newUser.sectionId
    }
  });
});

router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization header required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.users.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        facultyId: user.facultyId,
        sectionId: user.sectionId
      }
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

export default router;
