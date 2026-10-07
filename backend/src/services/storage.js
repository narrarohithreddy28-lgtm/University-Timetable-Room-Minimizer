import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import {
  departmentsData,
  sectionsData,
  roomsData,
  subjectsData,
  facultyData,
  timeSlotsData,
  usersData
} from '../config/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// In-memory cache
let database = {
  departments: [],
  faculty: [],
  subjects: [],
  sections: [],
  rooms: [],
  timeslots: [],
  timetables: [],
  conflicts: [],
  users: []
};

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function saveDatabase() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(database, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error persisting database:', err);
  }
}

export function loadDatabase() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      database = {
        departments: parsed.departments || [],
        faculty: parsed.faculty || [],
        subjects: parsed.subjects || [],
        sections: parsed.sections || [],
        rooms: parsed.rooms || [],
        timeslots: parsed.timeslots || [],
        timetables: parsed.timetables || [],
        conflicts: parsed.conflicts || [],
        users: parsed.users || []
      };
      console.log('Database loaded from local storage.');
    } else {
      resetToDefaultSeed();
    }
  } catch (err) {
    console.warn('Could not read existing db.json, reseeding default data...', err);
    resetToDefaultSeed();
  }
}

export function resetToDefaultSeed() {
  database = {
    departments: JSON.parse(JSON.stringify(departmentsData)),
    faculty: JSON.parse(JSON.stringify(facultyData)),
    subjects: JSON.parse(JSON.stringify(subjectsData)),
    sections: JSON.parse(JSON.stringify(sectionsData)),
    rooms: JSON.parse(JSON.stringify(roomsData)),
    timeslots: JSON.parse(JSON.stringify(timeSlotsData)),
    timetables: [],
    conflicts: [],
    users: JSON.parse(JSON.stringify(usersData))
  };
  saveDatabase();
  console.log('Database initialized with Malla Reddy Technical Campus seed data.');
}

// Collection helper
export const db = {
  departments: {
    find: (filter = {}) => filterItems(database.departments, filter),
    findById: (id) => database.departments.find(i => i.id === id || i._id === id),
    create: (item) => {
      const newItem = { id: item.id || `dept_${uuidv4().slice(0, 8)}`, ...item };
      database.departments.push(newItem);
      saveDatabase();
      return newItem;
    },
    update: (id, updates) => {
      const idx = database.departments.findIndex(i => i.id === id || i._id === id);
      if (idx === -1) return null;
      database.departments[idx] = { ...database.departments[idx], ...updates };
      saveDatabase();
      return database.departments[idx];
    },
    delete: (id) => {
      const idx = database.departments.findIndex(i => i.id === id || i._id === id);
      if (idx === -1) return false;
      database.departments.splice(idx, 1);
      saveDatabase();
      return true;
    }
  },

  faculty: {
    find: (filter = {}) => filterItems(database.faculty, filter),
    findById: (id) => database.faculty.find(i => i.id === id || i._id === id),
    create: (item) => {
      const newItem = { id: item.id || `fac_${uuidv4().slice(0, 8)}`, ...item };
      database.faculty.push(newItem);
      saveDatabase();
      return newItem;
    },
    update: (id, updates) => {
      const idx = database.faculty.findIndex(i => i.id === id || i._id === id);
      if (idx === -1) return null;
      database.faculty[idx] = { ...database.faculty[idx], ...updates };
      saveDatabase();
      return database.faculty[idx];
    },
    delete: (id) => {
      const idx = database.faculty.findIndex(i => i.id === id || i._id === id);
      if (idx === -1) return false;
      database.faculty.splice(idx, 1);
      saveDatabase();
      return true;
    }
  },

  subjects: {
    find: (filter = {}) => filterItems(database.subjects, filter),
    findById: (id) => database.subjects.find(i => i.id === id || i._id === id),
    create: (item) => {
      const newItem = { id: item.id || `sub_${uuidv4().slice(0, 8)}`, ...item };
      database.subjects.push(newItem);
      saveDatabase();
      return newItem;
    },
    update: (id, updates) => {
      const idx = database.subjects.findIndex(i => i.id === id || i._id === id);
      if (idx === -1) return null;
      database.subjects[idx] = { ...database.subjects[idx], ...updates };
      saveDatabase();
      return database.subjects[idx];
    },
    delete: (id) => {
      const idx = database.subjects.findIndex(i => i.id === id || i._id === id);
      if (idx === -1) return false;
      database.subjects.splice(idx, 1);
      saveDatabase();
      return true;
    }
  },

  sections: {
    find: (filter = {}) => filterItems(database.sections, filter),
    findById: (id) => database.sections.find(i => i.id === id || i._id === id),
    create: (item) => {
      const newItem = { id: item.id || `sec_${uuidv4().slice(0, 8)}`, ...item };
      database.sections.push(newItem);
      saveDatabase();
      return newItem;
    },
    update: (id, updates) => {
      const idx = database.sections.findIndex(i => i.id === id || i._id === id);
      if (idx === -1) return null;
      database.sections[idx] = { ...database.sections[idx], ...updates };
      saveDatabase();
      return database.sections[idx];
    },
    delete: (id) => {
      const idx = database.sections.findIndex(i => i.id === id || i._id === id);
      if (idx === -1) return false;
      database.sections.splice(idx, 1);
      saveDatabase();
      return true;
    }
  },

  rooms: {
    find: (filter = {}) => filterItems(database.rooms, filter),
    findById: (id) => database.rooms.find(i => i.id === id || i._id === id),
    create: (item) => {
      const newItem = { id: item.id || `rm_${uuidv4().slice(0, 8)}`, ...item };
      database.rooms.push(newItem);
      saveDatabase();
      return newItem;
    },
    update: (id, updates) => {
      const idx = database.rooms.findIndex(i => i.id === id || i._id === id);
      if (idx === -1) return null;
      database.rooms[idx] = { ...database.rooms[idx], ...updates };
      saveDatabase();
      return database.rooms[idx];
    },
    delete: (id) => {
      const idx = database.rooms.findIndex(i => i.id === id || i._id === id);
      if (idx === -1) return false;
      database.rooms.splice(idx, 1);
      saveDatabase();
      return true;
    }
  },

  timeslots: {
    find: (filter = {}) => filterItems(database.timeslots, filter),
    findById: (id) => database.timeslots.find(i => i.id === id || i.slotNumber === id),
    create: (item) => {
      const newItem = { id: item.id || `slot_${item.slotNumber || uuidv4().slice(0, 4)}`, ...item };
      database.timeslots.push(newItem);
      saveDatabase();
      return newItem;
    },
    update: (id, updates) => {
      const idx = database.timeslots.findIndex(i => i.id === id || i.slotNumber === id);
      if (idx === -1) return null;
      database.timeslots[idx] = { ...database.timeslots[idx], ...updates };
      saveDatabase();
      return database.timeslots[idx];
    },
    delete: (id) => {
      const idx = database.timeslots.findIndex(i => i.id === id || i.slotNumber === id);
      if (idx === -1) return false;
      database.timeslots.splice(idx, 1);
      saveDatabase();
      return true;
    }
  },

  timetables: {
    find: (filter = {}) => filterItems(database.timetables, filter),
    findById: (id) => database.timetables.find(i => i.id === id || i._id === id),
    getLatest: () => database.timetables.length > 0 ? database.timetables[database.timetables.length - 1] : null,
    create: (item) => {
      const newItem = { id: item.id || `tt_${uuidv4().slice(0, 8)}`, createdAt: new Date().toISOString(), ...item };
      database.timetables.push(newItem);
      saveDatabase();
      return newItem;
    },
    update: (id, updates) => {
      const idx = database.timetables.findIndex(i => i.id === id || i._id === id);
      if (idx === -1) return null;
      database.timetables[idx] = { ...database.timetables[idx], ...updates, updatedAt: new Date().toISOString() };
      saveDatabase();
      return database.timetables[idx];
    },
    delete: (id) => {
      const idx = database.timetables.findIndex(i => i.id === id || i._id === id);
      if (idx === -1) return false;
      database.timetables.splice(idx, 1);
      saveDatabase();
      return true;
    },
    clear: () => {
      database.timetables = [];
      saveDatabase();
      return true;
    }
  },

  conflicts: {
    find: (filter = {}) => filterItems(database.conflicts, filter),
    setAll: (list) => {
      database.conflicts = list;
      saveDatabase();
      return list;
    },
    clear: () => {
      database.conflicts = [];
      saveDatabase();
      return true;
    }
  },

  users: {
    find: (filter = {}) => filterItems(database.users, filter),
    findById: (id) => database.users.find(i => i.id === id || i._id === id),
    findByEmail: (email) => database.users.find(i => i.email && i.email.toLowerCase() === email.toLowerCase()),
    create: (item) => {
      const newItem = { id: item.id || `user_${uuidv4().slice(0, 8)}`, ...item };
      database.users.push(newItem);
      saveDatabase();
      return newItem;
    }
  }
};

function filterItems(items, filter) {
  if (!filter || Object.keys(filter).length === 0) return items;
  return items.filter(item => {
    for (const key of Object.keys(filter)) {
      if (item[key] !== filter[key]) return false;
    }
    return true;
  });
}

// Initial load
loadDatabase();
