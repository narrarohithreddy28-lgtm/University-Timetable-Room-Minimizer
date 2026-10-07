// Seed Data for Malla Reddy Technical Campus
export const UNIVERSITY_NAME = "Malla Reddy Technical Campus";

export const departmentsData = [
  { id: "dept_cse", name: "Computer Science and Engineering", code: "CSE" },
  { id: "dept_cse_ai", name: "Artificial Intelligence and Machine Learning", code: "CSE-AI" },
  { id: "dept_ece", name: "Electronics and Communication Engineering", code: "ECE" },
  { id: "dept_eee", name: "Electrical and Electronics Engineering", code: "EEE" },
  { id: "dept_mech", name: "Mechanical Engineering", code: "Mechanical" }
];

export const sectionsData = [
  { id: "sec_cse_a", name: "CSE-A", departmentId: "dept_cse", department: "CSE", semester: 4, studentCount: 60, academicYear: "2024-2025" },
  { id: "sec_cse_b", name: "CSE-B", departmentId: "dept_cse", department: "CSE", semester: 4, studentCount: 60, academicYear: "2024-2025" },
  { id: "sec_aiml_a", name: "AIML-A", departmentId: "dept_cse_ai", department: "CSE-AI", semester: 4, studentCount: 55, academicYear: "2024-2025" },
  { id: "sec_aiml_b", name: "AIML-B", departmentId: "dept_cse_ai", department: "CSE-AI", semester: 4, studentCount: 55, academicYear: "2024-2025" },
  { id: "sec_ece_a", name: "ECE-A", departmentId: "dept_ece", department: "ECE", semester: 4, studentCount: 60, academicYear: "2024-2025" },
  { id: "sec_ece_b", name: "ECE-B", departmentId: "dept_ece", department: "ECE", semester: 4, studentCount: 58, academicYear: "2024-2025" },
  { id: "sec_eee_a", name: "EEE-A", departmentId: "dept_eee", department: "EEE", semester: 4, studentCount: 50, academicYear: "2024-2025" },
  { id: "sec_mech_a", name: "MECH-A", departmentId: "dept_mech", department: "Mechanical", semester: 4, studentCount: 48, academicYear: "2024-2025" }
];

export const roomsData = [
  // 15 Classrooms
  { id: "rm_101", roomNumber: "Room 101", building: "Academic Block A", floor: "1st Floor", capacity: 70, roomType: "Classroom", equipment: ["Projector", "Smart Board", "Sound System"], isAvailable: true },
  { id: "rm_102", roomNumber: "Room 102", building: "Academic Block A", floor: "1st Floor", capacity: 70, roomType: "Classroom", equipment: ["Projector", "Whiteboard"], isAvailable: true },
  { id: "rm_103", roomNumber: "Room 103", building: "Academic Block A", floor: "1st Floor", capacity: 65, roomType: "Classroom", equipment: ["Projector", "Whiteboard"], isAvailable: true },
  { id: "rm_104", roomNumber: "Room 104", building: "Academic Block A", floor: "1st Floor", capacity: 65, roomType: "Classroom", equipment: ["Projector", "Smart Board"], isAvailable: true },
  { id: "rm_105", roomNumber: "Room 105", building: "Academic Block A", floor: "1st Floor", capacity: 75, roomType: "Classroom", equipment: ["Projector", "Audio System"], isAvailable: true },
  { id: "rm_201", roomNumber: "Room 201", building: "Academic Block A", floor: "2nd Floor", capacity: 75, roomType: "Classroom", equipment: ["Projector", "Whiteboard"], isAvailable: true },
  { id: "rm_202", roomNumber: "Room 202", building: "Academic Block A", floor: "2nd Floor", capacity: 70, roomType: "Classroom", equipment: ["Projector", "Smart Board"], isAvailable: true },
  { id: "rm_203", roomNumber: "Room 203", building: "Academic Block A", floor: "2nd Floor", capacity: 65, roomType: "Classroom", equipment: ["Projector", "Whiteboard"], isAvailable: true },
  { id: "rm_204", roomNumber: "Room 204", building: "Academic Block A", floor: "2nd Floor", capacity: 70, roomType: "Classroom", equipment: ["Projector", "Whiteboard"], isAvailable: true },
  { id: "rm_205", roomNumber: "Room 205", building: "Academic Block A", floor: "2nd Floor", capacity: 80, roomType: "Classroom", equipment: ["Projector", "Smart Board", "Audio"], isAvailable: true },
  { id: "rm_301", roomNumber: "Room 301", building: "Academic Block B", floor: "3rd Floor", capacity: 65, roomType: "Classroom", equipment: ["Projector", "Whiteboard"], isAvailable: true },
  { id: "rm_302", roomNumber: "Room 302", building: "Academic Block B", floor: "3rd Floor", capacity: 70, roomType: "Classroom", equipment: ["Projector", "Whiteboard"], isAvailable: true },
  { id: "rm_303", roomNumber: "Room 303", building: "Academic Block B", floor: "3rd Floor", capacity: 65, roomType: "Classroom", equipment: ["Projector", "Whiteboard"], isAvailable: true },
  { id: "rm_304", roomNumber: "Room 304", building: "Academic Block B", floor: "3rd Floor", capacity: 75, roomType: "Classroom", equipment: ["Projector", "Whiteboard"], isAvailable: true },
  { id: "rm_305", roomNumber: "Room 305", building: "Academic Block B", floor: "3rd Floor", capacity: 85, roomType: "Classroom", equipment: ["Projector", "Podium", "Smart Screen"], isAvailable: true },

  // 5 Laboratories
  { id: "lab_101", roomNumber: "Lab 101 - Software Systems", building: "Tech Park", floor: "1st Floor", capacity: 65, roomType: "Laboratory", equipment: ["60 Core i7 PCs", "Gigabit LAN", "Projector"], isAvailable: true },
  { id: "lab_102", roomNumber: "Lab 102 - Web & Cloud Lab", building: "Tech Park", floor: "1st Floor", capacity: 65, roomType: "Laboratory", equipment: ["60 Core i7 PCs", "Cloud Server Rack"], isAvailable: true },
  { id: "lab_201", roomNumber: "Lab 201 - AI & Data Science", building: "Tech Park", floor: "2nd Floor", capacity: 60, roomType: "Laboratory", equipment: ["55 GPU Workstations", "Smart Screen"], isAvailable: true },
  { id: "lab_202", roomNumber: "Lab 202 - Electronics & Embedded", building: "Engineering Block", floor: "2nd Floor", capacity: 65, roomType: "Laboratory", equipment: ["CROs", "DSP Kits", "FPGA Boards"], isAvailable: true },
  { id: "lab_301", roomNumber: "Lab 301 - CAD/CAM & Simulation", building: "Mechanical Block", floor: "Ground Floor", capacity: 60, roomType: "Laboratory", equipment: ["50 Workstations", "ANSYS", "SolidWorks"], isAvailable: true }
];

export const subjectsData = [
  // CSE / AIML subjects
  { id: "sub_cs201", name: "Data Structures & Algorithms", code: "CS201", departmentId: "dept_cse", semester: 4, credits: 4, type: "Theory", weeklyHours: 4, requiredRoomType: "Classroom" },
  { id: "sub_cs202", name: "Database Management Systems", code: "CS202", departmentId: "dept_cse", semester: 4, credits: 4, type: "Theory", weeklyHours: 4, requiredRoomType: "Classroom" },
  { id: "sub_cs203", name: "Operating Systems", code: "CS203", departmentId: "dept_cse", semester: 4, credits: 3, type: "Theory", weeklyHours: 3, requiredRoomType: "Classroom" },
  { id: "sub_cs204", name: "Computer Networks", code: "CS204", departmentId: "dept_cse", semester: 4, credits: 3, type: "Theory", weeklyHours: 3, requiredRoomType: "Classroom" },
  { id: "sub_csl201", name: "DBMS & Algorithms Lab", code: "CS205L", departmentId: "dept_cse", semester: 4, credits: 2, type: "Laboratory", weeklyHours: 3, requiredRoomType: "Laboratory" },

  // AI & ML subjects
  { id: "sub_ai201", name: "Machine Learning Foundations", code: "AI201", departmentId: "dept_cse_ai", semester: 4, credits: 4, type: "Theory", weeklyHours: 4, requiredRoomType: "Classroom" },
  { id: "sub_ai202", name: "Deep Learning & Neural Networks", code: "AI202", departmentId: "dept_cse_ai", semester: 4, credits: 4, type: "Theory", weeklyHours: 4, requiredRoomType: "Classroom" },
  { id: "sub_ail201", name: "AI & Machine Learning Lab", code: "AI203L", departmentId: "dept_cse_ai", semester: 4, credits: 2, type: "Laboratory", weeklyHours: 3, requiredRoomType: "Laboratory" },

  // ECE subjects
  { id: "sub_ec201", name: "Digital Signal Processing", code: "EC201", departmentId: "dept_ece", semester: 4, credits: 4, type: "Theory", weeklyHours: 4, requiredRoomType: "Classroom" },
  { id: "sub_ec202", name: "VLSI Design & Systems", code: "EC202", departmentId: "dept_ece", semester: 4, credits: 4, type: "Theory", weeklyHours: 4, requiredRoomType: "Classroom" },
  { id: "sub_ecl201", name: "DSP & Microcontroller Lab", code: "EC203L", departmentId: "dept_ece", semester: 4, credits: 2, type: "Laboratory", weeklyHours: 3, requiredRoomType: "Laboratory" },

  // EEE subjects
  { id: "sub_ee201", name: "Power Systems Engineering", code: "EE201", departmentId: "dept_eee", semester: 4, credits: 4, type: "Theory", weeklyHours: 4, requiredRoomType: "Classroom" },
  { id: "sub_ee202", name: "Control Systems", code: "EE202", departmentId: "dept_eee", semester: 4, credits: 4, type: "Theory", weeklyHours: 4, requiredRoomType: "Classroom" },

  // Mech subjects
  { id: "sub_me201", name: "Thermodynamics & Heat Transfer", code: "ME201", departmentId: "dept_mech", semester: 4, credits: 4, type: "Theory", weeklyHours: 4, requiredRoomType: "Classroom" },
  { id: "sub_mel201", name: "CAD/CAM Simulation Lab", code: "ME202L", departmentId: "dept_mech", semester: 4, credits: 2, type: "Laboratory", weeklyHours: 3, requiredRoomType: "Laboratory" }
];

export const facultyData = [
  { id: "fac_1", facultyId: "FAC001", name: "Dr. K. Rajesh", email: "rajesh.cse@mrtc.edu.in", department: "CSE", departmentId: "dept_cse", subjects: ["sub_cs201", "sub_csl201"], availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], availableSlots: [1, 2, 3, 4, 5, 6, 7] },
  { id: "fac_2", facultyId: "FAC002", name: "Prof. S. Sunitha", email: "sunitha.cse@mrtc.edu.in", department: "CSE", departmentId: "dept_cse", subjects: ["sub_cs202", "sub_csl201"], availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], availableSlots: [1, 2, 3, 4, 5, 6, 7] },
  { id: "fac_3", facultyId: "FAC003", name: "Dr. V. Prasad", email: "prasad.cse@mrtc.edu.in", department: "CSE", departmentId: "dept_cse", subjects: ["sub_cs203"], availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], availableSlots: [1, 2, 3, 4, 5, 6, 7] },
  { id: "fac_4", facultyId: "FAC004", name: "Prof. Anitha Reddy", email: "anitha.cse@mrtc.edu.in", department: "CSE", departmentId: "dept_cse", subjects: ["sub_cs204"], availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], availableSlots: [1, 2, 3, 4, 5, 6, 7] },
  { id: "fac_5", facultyId: "FAC005", name: "Dr. B. Naveen Kumar", email: "naveen.cse@mrtc.edu.in", department: "CSE", departmentId: "dept_cse", subjects: ["sub_cs201", "sub_cs202"], availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], availableSlots: [1, 2, 3, 4, 5, 6, 7] },

  { id: "fac_6", facultyId: "FAC006", name: "Dr. M. Sridhar", email: "sridhar.ai@mrtc.edu.in", department: "CSE-AI", departmentId: "dept_cse_ai", subjects: ["sub_ai201", "sub_ail201"], availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], availableSlots: [1, 2, 3, 4, 5, 6, 7] },
  { id: "fac_7", facultyId: "FAC007", name: "Prof. Swathi Rao", email: "swathi.ai@mrtc.edu.in", department: "CSE-AI", departmentId: "dept_cse_ai", subjects: ["sub_ai202", "sub_ail201"], availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], availableSlots: [1, 2, 3, 4, 5, 6, 7] },
  { id: "fac_8", facultyId: "FAC008", name: "Dr. Ramesh Babu", email: "ramesh.ai@mrtc.edu.in", department: "CSE-AI", departmentId: "dept_cse_ai", subjects: ["sub_ai201", "sub_cs204"], availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], availableSlots: [1, 2, 3, 4, 5, 6, 7] },
  { id: "fac_9", facultyId: "FAC009", name: "Prof. Harika Sharma", email: "harika.ai@mrtc.edu.in", department: "CSE-AI", departmentId: "dept_cse_ai", subjects: ["sub_ai202"], availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], availableSlots: [1, 2, 3, 4, 5, 6, 7] },

  { id: "fac_10", facultyId: "FAC010", name: "Dr. C. Venkatesh", email: "venkatesh.ece@mrtc.edu.in", department: "ECE", departmentId: "dept_ece", subjects: ["sub_ec201", "sub_ecl201"], availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], availableSlots: [1, 2, 3, 4, 5, 6, 7] },
  { id: "fac_11", facultyId: "FAC011", name: "Prof. P. Kavitha", email: "kavitha.ece@mrtc.edu.in", department: "ECE", departmentId: "dept_ece", subjects: ["sub_ec202", "sub_ecl201"], availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], availableSlots: [1, 2, 3, 4, 5, 6, 7] },
  { id: "fac_12", facultyId: "FAC012", name: "Dr. G. Srinivas", email: "srinivas.ece@mrtc.edu.in", department: "ECE", departmentId: "dept_ece", subjects: ["sub_ec201"], availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], availableSlots: [1, 2, 3, 4, 5, 6, 7] },
  { id: "fac_13", facultyId: "FAC013", name: "Prof. Deepa Nair", email: "deepa.ece@mrtc.edu.in", department: "ECE", departmentId: "dept_ece", subjects: ["sub_ec202"], availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], availableSlots: [1, 2, 3, 4, 5, 6, 7] },

  { id: "fac_14", facultyId: "FAC014", name: "Dr. T. Radhakrishnan", email: "radhakrishnan.eee@mrtc.edu.in", department: "EEE", departmentId: "dept_eee", subjects: ["sub_ee201"], availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], availableSlots: [1, 2, 3, 4, 5, 6, 7] },
  { id: "fac_15", facultyId: "FAC015", name: "Prof. Madhavi Latha", email: "madhavi.eee@mrtc.edu.in", department: "EEE", departmentId: "dept_eee", subjects: ["sub_ee202"], availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], availableSlots: [1, 2, 3, 4, 5, 6, 7] },
  { id: "fac_16", facultyId: "FAC016", name: "Dr. Suresh Reddy", email: "suresh.eee@mrtc.edu.in", department: "EEE", departmentId: "dept_eee", subjects: ["sub_ee201", "sub_ee202"], availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], availableSlots: [1, 2, 3, 4, 5, 6, 7] },

  { id: "fac_17", facultyId: "FAC017", name: "Dr. N. Chandrasekhar", email: "chandrasekhar.mech@mrtc.edu.in", department: "Mechanical", departmentId: "dept_mech", subjects: ["sub_me201", "sub_mel201"], availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], availableSlots: [1, 2, 3, 4, 5, 6, 7] },
  { id: "fac_18", facultyId: "FAC018", name: "Prof. Arun Kumar", email: "arun.mech@mrtc.edu.in", department: "Mechanical", departmentId: "dept_mech", subjects: ["sub_me201", "sub_mel201"], availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], availableSlots: [1, 2, 3, 4, 5, 6, 7] },
  { id: "fac_19", facultyId: "FAC019", name: "Prof. Sneha Patel", email: "sneha.cse@mrtc.edu.in", department: "CSE", departmentId: "dept_cse", subjects: ["sub_cs203", "sub_cs204"], availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], availableSlots: [1, 2, 3, 4, 5, 6, 7] },
  { id: "fac_20", facultyId: "FAC020", name: "Dr. Vijay Raghavan", email: "vijay.ai@mrtc.edu.in", department: "CSE-AI", departmentId: "dept_cse_ai", subjects: ["sub_ai201", "sub_ai202"], availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], availableSlots: [1, 2, 3, 4, 5, 6, 7] }
];

export const workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const timeSlotsData = [
  { slotNumber: 1, startTime: "09:00", endTime: "10:00", label: "09:00 - 10:00", isBreak: false, isAvailable: true },
  { slotNumber: 2, startTime: "10:00", endTime: "11:00", label: "10:00 - 11:00", isBreak: false, isAvailable: true },
  { slotNumber: 3, startTime: "11:00", endTime: "12:00", label: "11:00 - 12:00", isBreak: false, isAvailable: true },
  { slotNumber: 4, startTime: "12:00", endTime: "13:00", label: "12:00 - 01:00", isBreak: false, isAvailable: true },
  { slotNumber: 5, startTime: "13:00", endTime: "14:00", label: "01:00 - 02:00 (Lunch)", isBreak: true, isAvailable: false },
  { slotNumber: 6, startTime: "14:00", endTime: "15:00", label: "02:00 - 03:00", isBreak: false, isAvailable: true },
  { slotNumber: 7, startTime: "15:00", endTime: "16:00", label: "03:00 - 04:00", isBreak: false, isAvailable: true },
  { slotNumber: 8, startTime: "16:00", endTime: "17:00", label: "04:00 - 05:00", isBreak: false, isAvailable: true }
];

export const usersData = [
  { id: "user_admin", name: "University Administrator", email: "admin@mrtc.edu.in", password: "admin123", role: "admin" },
  { id: "user_faculty", name: "Dr. K. Rajesh", email: "rajesh.cse@mrtc.edu.in", password: "faculty123", role: "faculty", facultyId: "FAC001", department: "CSE" },
  { id: "user_student", name: "Aditya Sharma", email: "student.cse@mrtc.edu.in", password: "student123", role: "student", sectionId: "sec_cse_a", department: "CSE" }
];
