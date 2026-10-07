import express from 'express';
import { db } from '../services/storage.js';

const router = express.Router();

router.get('/', (req, res) => {
  const sections = db.sections.find();
  res.json({ success: true, count: sections.length, data: sections });
});

router.post('/', (req, res) => {
  const { name, departmentId, department, semester, studentCount, academicYear } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Section name is required' });
  }
  const created = db.sections.create({
    name,
    departmentId: departmentId || 'dept_cse',
    department: department || 'CSE',
    semester: Number(semester) || 4,
    studentCount: Number(studentCount) || 60,
    academicYear: academicYear || '2024-2025'
  });
  res.status(201).json({ success: true, data: created });
});

router.put('/:id', (req, res) => {
  const updated = db.sections.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Section not found' });
  }
  res.json({ success: true, data: updated });
});

router.delete('/:id', (req, res) => {
  const deleted = db.sections.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Section not found' });
  }
  res.json({ success: true, message: 'Section deleted successfully' });
});

export default router;
