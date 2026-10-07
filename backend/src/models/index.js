import mongoose from 'mongoose';
// Mongoose Models for MongoDB compatibility

export const DepartmentSchema = {
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true }
};

export const FacultySchema = {
  name: { type: String, required: true },
  facultyId: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  departmentId: { type: String, ref: 'Department' },
  email: { type: String, required: true },
  subjects: [{ type: String, ref: 'Subject' }],
  availableDays: [{ type: String }],
  availableSlots: [{ type: Number }]
};

export const SubjectSchema = {
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  departmentId: { type: String, ref: 'Department' },
  semester: { type: Number, required: true },
  credits: { type: Number, required: true },
  type: { type: String, enum: ['Theory', 'Laboratory'], default: 'Theory' },
  weeklyHours: { type: Number, required: true, default: 3 },
  requiredRoomType: { type: String, enum: ['Classroom', 'Laboratory', 'Seminar Hall'], default: 'Classroom' }
};

export const SectionSchema = {
  name: { type: String, required: true },
  department: { type: String, required: true },
  departmentId: { type: String, ref: 'Department' },
  semester: { type: Number, required: true },
  studentCount: { type: Number, required: true },
  academicYear: { type: String, default: '2024-2025' }
};

export const RoomSchema = {
  roomNumber: { type: String, required: true, unique: true },
  building: { type: String, default: 'Academic Block A' },
  floor: { type: String, default: '1st Floor' },
  capacity: { type: Number, required: true },
  roomType: { type: String, enum: ['Classroom', 'Laboratory', 'Seminar Hall'], default: 'Classroom' },
  equipment: [{ type: String }],
  isAvailable: { type: Boolean, default: true }
};

export const TimeSlotSchema = {
  slotNumber: { type: Number, required: true, unique: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  label: { type: String },
  isBreak: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true }
};

export const TimetableEntrySchema = {
  day: { type: String, required: true },
  slotNumber: { type: Number, required: true },
  startTime: { type: String },
  endTime: { type: String },
  sectionId: { type: String, ref: 'Section', required: true },
  sectionName: { type: String },
  subjectId: { type: String, ref: 'Subject', required: true },
  subjectName: { type: String },
  subjectCode: { type: String },
  subjectType: { type: String },
  facultyId: { type: String, ref: 'Faculty' },
  facultyName: { type: String },
  roomId: { type: String, ref: 'Room', required: true },
  roomNumber: { type: String },
  roomType: { type: String },
  building: { type: String },
  capacity: { type: Number },
  studentCount: { type: Number }
};

export const TimetableSchema = {
  academicYear: { type: String, default: '2024-2025' },
  semester: { type: Number, default: 4 },
  department: { type: String, default: 'All' },
  entries: [TimetableEntrySchema],
  stats: {
    totalRooms: { type: Number },
    requiredRooms: { type: Number },
    roomsSaved: { type: Number },
    roomReductionPercent: { type: Number },
    totalClasses: { type: Number },
    conflicts: { type: Number },
    optimizationScore: { type: Number },
    overallUtilizationPercent: { type: Number }
  },
  createdAt: { type: Date, default: Date.now }
};

export const ConflictSchema = {
  timetableId: { type: String, ref: 'Timetable' },
  type: { type: String, required: true },
  severity: { type: String, enum: ['Hard', 'Soft'], default: 'Hard' },
  description: { type: String, required: true },
  day: { type: String },
  slotNumber: { type: Number },
  classes: [{ type: Object }],
  details: { type: Object }
};

export const UserSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'faculty', 'student'], default: 'student' },
  department: { type: String },
  facultyId: { type: String },
  sectionId: { type: String }
};
