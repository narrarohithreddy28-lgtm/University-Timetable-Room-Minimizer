import express from 'express';
import { db } from '../services/storage.js';

const router = express.Router();

router.get('/', (req, res) => {
  const subjects = db.subjects.find();
  res.json({ success: true, count: subjects.length, data: subjects });
});

router.post('/', (req, res) => {
  const { name, code, departmentId, department, semester, credits, type, weeklyHours, requiredRoomType } = req.body;
  if (!name || !code) {
    return res.status(400).json({ success: false, message: 'Subject name and code are required' });
  }
  const created = db.subjects.create({
    name,
    code: code.toUpperCase(),
    departmentId: departmentId || 'dept_cse',
    department: department || 'CSE',
    semester: Number(semester) || 4,
    credits: Number(credits) || 3,
    type: type || 'Theory',
    weeklyHours: Number(weeklyHours) || 3,
    requiredRoomType: requiredRoomType || (type === 'Laboratory' ? 'Laboratory' : 'Classroom')
  });
  res.status(201).json({ success: true, data: created });
});

router.put('/:id', (req, res) => {
  const updated = db.subjects.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Subject not found' });
  }
  res.json({ success: true, data: updated });
});

router.delete('/:id', (req, res) => {
  const deleted = db.subjects.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Subject not found' });
  }
  res.json({ success: true, message: 'Subject deleted successfully' });
});

export default router;
