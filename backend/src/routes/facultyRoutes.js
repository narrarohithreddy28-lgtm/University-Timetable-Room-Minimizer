import express from 'express';
import { db } from '../services/storage.js';

const router = express.Router();

router.get('/', (req, res) => {
  const faculty = db.faculty.find();
  res.json({ success: true, count: faculty.length, data: faculty });
});

router.post('/', (req, res) => {
  const { name, facultyId, department, departmentId, email, subjects, availableDays, availableSlots } = req.body;
  if (!name || !facultyId) {
    return res.status(400).json({ success: false, message: 'Faculty name and ID are required' });
  }
  const created = db.faculty.create({
    name,
    facultyId,
    department: department || 'CSE',
    departmentId: departmentId || 'dept_cse',
    email: email || `${facultyId.toLowerCase()}@mrtc.edu.in`,
    subjects: subjects || [],
    availableDays: availableDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    availableSlots: availableSlots || [1, 2, 3, 4, 5, 6, 7]
  });
  res.status(201).json({ success: true, data: created });
});

router.put('/:id', (req, res) => {
  const updated = db.faculty.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Faculty not found' });
  }
  res.json({ success: true, data: updated });
});

router.delete('/:id', (req, res) => {
  const deleted = db.faculty.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Faculty not found' });
  }
  res.json({ success: true, message: 'Faculty deleted successfully' });
});

export default router;
