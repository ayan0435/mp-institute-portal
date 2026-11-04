import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env') });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mpinstitute';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const uploadDir = path.join(rootDir, 'server', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});
const upload = multer({ storage });

const users = [
  { id: 'u-admin-1', name: 'Admin User', email: 'admin@mpinstitute.edu.in', password: bcrypt.hashSync('Admin@123', 10), role: 'admin', phone: '9876543210', avatar: 'AU', courseId: null },
  { id: 'u-office-1', name: 'Office Admin', email: 'office@mpinstitute.edu.in', password: bcrypt.hashSync('Admin@123', 10), role: 'admin', phone: '9876543220', avatar: 'OA', courseId: null },
  { id: 'u-vishnupriya', name: 'Vishnupriya', email: 'vishnupriya@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001122', avatar: 'V', courseId: 'course-bca' },
  { id: 'u-bn-pandey', name: 'Prof. B N Pandey', email: 'bn.pandey@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001123', avatar: 'BP', courseId: 'course-bca' },
  { id: 'u-pratibha', name: 'Pratibha Singh', email: 'pratibha.singh@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001124', avatar: 'PS', courseId: 'course-bba' },
  { id: 'u-vidhi', name: 'Vidhi Mishra', email: 'vidhi.mishra@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001125', avatar: 'VM', courseId: 'course-bcom' },
  { id: 'u-nimisha', name: 'Nimisha Jaiswal', email: 'nimisha.jaiswal@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001126', avatar: 'NJ', courseId: 'course-ba' },
  { id: 'u-anita', name: 'Anita Patel', email: 'anita.patel@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001127', avatar: 'AP', courseId: 'course-bca' },
  { id: 'u-sushmita', name: 'Sushmita Singh', email: 'sushmita.singh@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001128', avatar: 'SS', courseId: 'course-bca' },
  { id: 'u-pooranm', name: 'Pooranmasi Patel', email: 'pooranmasi.patel@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001129', avatar: 'PP', courseId: 'course-bba' },
  { id: 'u-santwana', name: 'Dr Santwana Mishra', email: 'santwana.mishra@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001130', avatar: 'SM', courseId: 'course-bcom' },
  { id: 'u-anand', name: 'Anand Vishwakarma', email: 'anand.vishwakarma@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001131', avatar: 'AV', courseId: 'course-bca' },
  { id: 'u-ashutosh1', name: 'Dr Ashutosh Mishra', email: 'ashutosh.mishra@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001132', avatar: 'AM', courseId: 'course-bba' },
  { id: 'u-shweta', name: 'Dr Shweta Kumari', email: 'shweta.kumari@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001133', avatar: 'SK', courseId: 'course-ba' },
  { id: 'u-ajay', name: 'Ajay Kumar Singh', email: 'ajay.kumar@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001134', avatar: 'AS', courseId: 'course-bca' },
  { id: 'u-poonam', name: 'Poonam Singh', email: 'poonam.singh@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001135', avatar: 'PS2', courseId: 'course-ba' },
  { id: 'u-pankaj', name: 'Pankaj Yadav', email: 'pankaj.yadav@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001136', avatar: 'PY', courseId: 'course-bcom' },
  { id: 'u-archana', name: 'Archana Devi', email: 'archana.devi@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001137', avatar: 'AD', courseId: 'course-bca' },
  { id: 'u-ashutosh2', name: 'Ashutosh Singh', email: 'ashutosh.singh@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001138', avatar: 'AS2', courseId: 'course-bba' },
  { id: 'u-budhi', name: 'Budhi Ram', email: 'budhi.ram@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001139', avatar: 'BR', courseId: 'course-bca' },
  { id: 'u-waseem', name: 'Waseem Siddhaqi', email: 'waseem.siddhaqi@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001140', avatar: 'WS', courseId: 'course-bba' },
  { id: 'u-naqi', name: 'Naqi Hasan', email: 'naqi.hasan@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001141', avatar: 'NH', courseId: 'course-bcom' },
  { id: 'u-dilip', name: 'Dilip Kushwaha', email: 'dilip.kushwaha@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001142', avatar: 'DK', courseId: 'course-ba' },
  { id: 'u-sandeep', name: 'Sandeep Singh', email: 'sandeep.singh@mpinstitute.edu.in', password: bcrypt.hashSync('Teacher@123', 10), role: 'teacher', phone: '9990001143', avatar: 'SS3', courseId: 'course-bca' },
  { id: 's-1', name: 'Aarav Singh', email: 'aarav.singh@student.mpinstitute.edu.in', password: bcrypt.hashSync('Student@123', 10), role: 'student', phone: '9000010010', avatar: 'AS', courseId: 'course-bca', semester: 3 },
  { id: 's-2', name: 'Diya Sharma', email: 'diya.sharma@student.mpinstitute.edu.in', password: bcrypt.hashSync('Student@123', 10), role: 'student', phone: '9000010011', avatar: 'DS', courseId: 'course-bca', semester: 3 },
  { id: 's-3', name: 'Rohit Verma', email: 'rohit.verma@student.mpinstitute.edu.in', password: bcrypt.hashSync('Student@123', 10), role: 'student', phone: '9000010012', avatar: 'RV', courseId: 'course-bca', semester: 3 },
  { id: 's-4', name: 'Kavya Yadav', email: 'kavya.yadav@student.mpinstitute.edu.in', password: bcrypt.hashSync('Student@123', 10), role: 'student', phone: '9000010013', avatar: 'KY', courseId: 'course-bca', semester: 3 },
  { id: 's-5', name: 'Nikita Singh', email: 'nikita.singh@student.mpinstitute.edu.in', password: bcrypt.hashSync('Student@123', 10), role: 'student', phone: '9000010014', avatar: 'NS', courseId: 'course-bca', semester: 3 },
  { id: 's-6', name: 'Harsh Tiwari', email: 'harsh.tiwari@student.mpinstitute.edu.in', password: bcrypt.hashSync('Student@123', 10), role: 'student', phone: '9000010015', avatar: 'HT', courseId: 'course-bca', semester: 3 },
  { id: 's-7', name: 'Priya Mishra', email: 'priya.mishra@student.mpinstitute.edu.in', password: bcrypt.hashSync('Student@123', 10), role: 'student', phone: '9000010016', avatar: 'PM', courseId: 'course-bba', semester: 3 },
  { id: 's-8', name: 'Aditya Kumar', email: 'aditya.kumar@student.mpinstitute.edu.in', password: bcrypt.hashSync('Student@123', 10), role: 'student', phone: '9000010017', avatar: 'AK', courseId: 'course-bba', semester: 3 },
  { id: 's-9', name: 'Sneha Singh', email: 'sneha.singh@student.mpinstitute.edu.in', password: bcrypt.hashSync('Student@123', 10), role: 'student', phone: '9000010018', avatar: 'SS4', courseId: 'course-bba', semester: 3 },
  { id: 's-10', name: 'Manish Patel', email: 'manish.patel@student.mpinstitute.edu.in', password: bcrypt.hashSync('Student@123', 10), role: 'student', phone: '9000010019', avatar: 'MP', courseId: 'course-bba', semester: 3 },
  { id: 's-11', name: 'Anjali Dubey', email: 'anjali.dubey@student.mpinstitute.edu.in', password: bcrypt.hashSync('Student@123', 10), role: 'student', phone: '9000010020', avatar: 'AD2', courseId: 'course-bbcom', semester: 3 },
  { id: 's-12', name: 'Saurabh Giri', email: 'saurabh.giri@student.mpinstitute.edu.in', password: bcrypt.hashSync('Student@123', 10), role: 'student', phone: '9000010021', avatar: 'SG', courseId: 'course-bcom', semester: 3 },
  { id: 's-13', name: 'Neha Gupta', email: 'neha.gupta@student.mpinstitute.edu.in', password: bcrypt.hashSync('Student@123', 10), role: 'student', phone: '9000010022', avatar: 'NG', courseId: 'course-bcom', semester: 3 },
  { id: 's-14', name: 'Vinay Pathak', email: 'vinay.pathak@student.mpinstitute.edu.in', password: bcrypt.hashSync('Student@123', 10), role: 'student', phone: '9000010023', avatar: 'VP', courseId: 'course-bcom', semester: 3 },
  { id: 's-15', name: 'Megha Pandey', email: 'megha.pandey@student.mpinstitute.edu.in', password: bcrypt.hashSync('Student@123', 10), role: 'student', phone: '9000010024', avatar: 'MP2', courseId: 'course-ba', semester: 3 },
  { id: 's-16', name: 'Rakesh Yadav', email: 'rakesh.yadav@student.mpinstitute.edu.in', password: bcrypt.hashSync('Student@123', 10), role: 'student', phone: '9000010025', avatar: 'RY', courseId: 'course-ba', semester: 3 },
  { id: 's-17', name: 'Shivani Singh', email: 'shivani.singh@student.mpinstitute.edu.in', password: bcrypt.hashSync('Student@123', 10), role: 'student', phone: '9000010026', avatar: 'SS5', courseId: 'course-ba', semester: 3 },
  { id: 's-18', name: 'Utkarsh Srivastava', email: 'utkarsh.srivastava@student.mpinstitute.edu.in', password: bcrypt.hashSync('Student@123', 10), role: 'student', phone: '9000010027', avatar: 'US', courseId: 'course-bca', semester: 3 },
  { id: 's-19', name: 'Riya Dwivedi', email: 'riya.dwivedi@student.mpinstitute.edu.in', password: bcrypt.hashSync('Student@123', 10), role: 'student', phone: '9000010028', avatar: 'RD', courseId: 'course-bba', semester: 3 },
  { id: 's-20', name: 'Amit Tiwari', email: 'amit.tiwari@student.mpinstitute.edu.in', password: bcrypt.hashSync('Student@123', 10), role: 'student', phone: '9000010029', avatar: 'AT', courseId: 'course-bcom', semester: 3 },
];

const programmes = [
  { id: 'course-bca', code: 'BCA', name: 'BCA', shortName: 'BCA', slug: 'bca', duration: '3 years', seats: 180, fees: 168000, level: 'UG', eligibility: '10+2 / equivalent with Mathematics/Computer Science preferred', description: 'Build a strong foundation in programming, software engineering, networking and modern application development.', subjects: ['Computer Fundamentals', 'Programming in C', 'Database Management', 'Web Development', 'Software Engineering'] },
  { id: 'course-bca-global', code: 'BCA Global', name: 'BCA Global', shortName: 'BCA Global', slug: 'bca-global', duration: '3 years', seats: 60, fees: 210000, level: 'UG', eligibility: '10+2 / equivalent', description: 'A global-focused degree with international exposure and industry aligned learning.', subjects: ['Global IT Trends', 'Advanced Web Design', 'Cloud Computing', 'Project Management', 'Cyber Security'] },
  { id: 'course-bba', code: 'BBA', name: 'BBA', shortName: 'BBA', slug: 'bba', duration: '3 years', seats: 180, fees: 150000, level: 'UG', eligibility: '10+2 / equivalent', description: 'Develop managerial competence, entrepreneurship and leadership skills.', subjects: ['Business Communication', 'Economics', 'Marketing', 'HR Management', 'Finance'] },
  { id: 'course-bba-global', code: 'BBA Global', name: 'BBA Global', shortName: 'BBA Global', slug: 'bba-global', duration: '3 years', seats: 60, fees: 195000, level: 'UG', eligibility: '10+2 / equivalent', description: 'An international curriculum with business exposure and practical managerial learning.', subjects: ['International Business', 'Strategic Management', 'Analytics', 'Global Finance', 'Operations'] },
  { id: 'course-bcom', code: 'B.Com', name: 'B.Com', shortName: 'B.Com', slug: 'b-com', duration: '3 years', seats: 200, fees: 120000, level: 'UG', eligibility: '10+2 / equivalent', description: 'Commerce education with financial accounting and business practices.', subjects: ['Financial Accounting', 'Business Law', 'Cost Accounting', 'Taxation', 'E-Commerce'] },
  { id: 'course-ba', code: 'BA', name: 'BA', shortName: 'BA', slug: 'ba', duration: '3 years', seats: 180, fees: 110000, level: 'UG', eligibility: '10+2 / equivalent', description: 'A holistic arts education aimed at critical thinking, communication and societal understanding.', subjects: ['English', 'History', 'Political Science', 'Sociology', 'Economics'] },
  { id: 'course-bed', code: 'B.Ed', name: 'B.Ed', shortName: 'B.Ed', slug: 'bed', duration: '2 years', seats: 100, fees: 160000, level: 'PG', eligibility: 'Graduation / equivalent', description: 'Professional teacher education with practicum and classroom readiness.', subjects: ['Pedagogy', 'Educational Psychology', 'Teaching Methods', 'Assessment', 'School Internship'] },
  { id: 'course-deled', code: 'D.El.Ed', name: 'D.El.Ed', shortName: 'D.El.Ed', slug: 'deled', duration: '2 years', seats: 80, fees: 130000, level: 'Diploma', eligibility: '10+2 / equivalent', description: 'Diploma in Elementary Education focused on foundational school teaching.', subjects: ['Child Development', 'Language Teaching', 'Early Childhood Education', 'School Practice', 'Community Education'] },
];

const notices = [
  { id: 'n-1', title: 'Admissions Open for 2025-26', body: 'Applications are now open for all UG and professional programmes.', pinned: true, createdAt: new Date().toISOString() },
  { id: 'n-2', title: 'National Conference on Digital Learning', body: 'The institute will host a digital learning conference on campus next month.', pinned: false, createdAt: new Date().toISOString() },
  { id: 'n-3', title: 'International Internship Opportunities', body: 'Students can apply for internships through the AIT, Bangkok tie-up.', pinned: false, createdAt: new Date().toISOString() },
  { id: 'n-4', title: 'Campus Cleanliness Week', body: 'Volunteers and student clubs are encouraged to participate in the campus drive.', pinned: false, createdAt: new Date().toISOString() },
];

const newsPosts = [
  { id: 'news-1', title: 'New IndustryConnect Lab Inaugurated', excerpt: 'The lab brings industry tools and faculty mentoring to students.', category: 'Campus', author: 'Administration', createdAt: '2025-03-10' },
  { id: 'news-2', title: 'Students Win Inter-College Debate Fest', excerpt: 'Students from BBA and BA represented the institute with distinction.', category: 'Achievements', author: 'Student Affairs', createdAt: '2025-02-20' },
  { id: 'news-3', title: 'Placement Drive Highlights', excerpt: 'Several students secured internships with leading firms.', category: 'Placements', author: 'Placement Cell', createdAt: '2025-01-18' },
];

const enquiries = [
  { id: 'e-1', name: 'Ritu S', phone: '9874563210', email: 'ritu@example.com', message: 'Need information on BCA Global fees and admissions.', status: 'New' },
  { id: 'e-2', name: 'Aman K', phone: '9812345670', email: 'aman@example.com', message: 'Please share scholarship options for BBA.', status: 'Follow Up' },
];

const books = [
  { id: 'book-1', title: 'Database Systems', author: 'Korth', category: 'Computing', copies: 5, issued: 2 },
  { id: 'book-2', title: 'Business Management', author: 'Peter Drucker', category: 'Management', copies: 4, issued: 1 },
  { id: 'book-3', title: 'Accounting Principles', author: 'Narayana', category: 'Commerce', copies: 6, issued: 3 },
  { id: 'book-4', title: 'Educational Psychology', author: 'S. K. Mangal', category: 'Education', copies: 3, issued: 1 },
];

const feeStructures = [
  { courseId: 'course-bca', semester: 1, amount: 28000 },
  { courseId: 'course-bca', semester: 2, amount: 28000 },
  { courseId: 'course-bca-global', semester: 1, amount: 35500, note: 'Indicative — admin can revise' },
  { courseId: 'course-bba', semester: 1, amount: 24500 },
  { courseId: 'course-bba-global', semester: 1, amount: 31500, note: 'Indicative — admin can revise' },
  { courseId: 'course-bcom', semester: 1, amount: 21000 },
  { courseId: 'course-ba', semester: 1, amount: 20000 },
  { courseId: 'course-bed', semester: 1, amount: 26000 },
  { courseId: 'course-deled', semester: 1, amount: 23000, note: 'Indicative — admin can revise' },
];

const payments = [
  { id: 'pay-1', studentId: 's-1', studentName: 'Aarav Singh', courseId: 'course-bca', amount: 28000, receipt: 'RCPT-1001', status: 'Paid', date: '2025-02-12' },
  { id: 'pay-2', studentId: 's-2', studentName: 'Diya Sharma', courseId: 'course-bca', amount: 28000, receipt: 'RCPT-1002', status: 'Paid', date: '2025-02-13' },
  { id: 'pay-3', studentId: 's-7', studentName: 'Priya Mishra', courseId: 'course-bba', amount: 24500, receipt: 'RCPT-1003', status: 'Due', date: '2025-02-14' },
];

const chatMessages = [
  { id: 'msg-1', room: 'general', sender: 'admin@mpinstitute.edu.in', senderName: 'Admin User', role: 'admin', text: 'Welcome to the institute portal.', createdAt: new Date().toISOString() },
  { id: 'msg-2', room: 'general', sender: 'vishnupriya@mpinstitute.edu.in', senderName: 'Vishnupriya', role: 'teacher', text: 'Admissions desk is open for queries.', createdAt: new Date().toISOString() },
  { id: 'msg-3', room: 'course-bca', sender: 's-1', senderName: 'Aarav Singh', role: 'student', text: 'I have submitted my assignment.', createdAt: new Date().toISOString() },
];

const assignments = [
  { id: 'ass-1', title: 'Web Development Case Study', subject: 'Web Development', assignedDate: '2025-03-01', dueDate: '2025-03-08', status: 'Open', courseId: 'course-bca' },
  { id: 'ass-2', title: 'Management Insights', subject: 'Marketing', assignedDate: '2025-03-04', dueDate: '2025-03-10', status: 'Open', courseId: 'course-bba' },
];

const attendance = [
  { studentId: 's-1', courseId: 'course-bca', percentage: 94 },
  { studentId: 's-2', courseId: 'course-bca', percentage: 89 },
  { studentId: 's-7', courseId: 'course-bba', percentage: 91 },
];

const results = [
  { studentId: 's-1', courseId: 'course-bca', subject: 'Web Development', grade: 'A', semester: 3 },
  { studentId: 's-1', courseId: 'course-bca', subject: 'DBMS', grade: 'A+', semester: 3 },
  { studentId: 's-7', courseId: 'course-bba', subject: 'Marketing', grade: 'A', semester: 3 },
];

const people = [
  { name: 'Abhishek Pathak', role: 'Managing Director', type: 'leadership' },
  { name: 'Dr Deepak Pradhan', role: 'Director', type: 'leadership' },
  { name: 'Prateek Srivastava', role: 'Assistant Director', type: 'leadership' },
  { name: 'Dr Gorakhnath Tiwari', role: 'Mentor', type: 'mentor' },
  { name: 'Vishnupriya', role: 'HOD, Computer Applications', type: 'faculty' },
  { name: 'Sunit Pandey', role: 'Office Staff', type: 'admin' },
];

let refreshStore = new Map();
let resetTokens = new Map();

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

function createRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function getUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());
}

function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Session expired' });
  }
}

function roleMiddleware(...allowed) {
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    next();
  };
}

app.use(cors({ origin: true, credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(rootDir, 'server', 'uploads')));
app.use('/api', rateLimit({ windowMs: 60 * 1000, max: 200 }));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'MP Institute API online', timestamp: new Date().toISOString() });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required.' });

  const user = getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  const accessToken = createToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = createRefreshToken({ id: user.id });
  refreshStore.set(user.id, refreshToken);

  res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ success: true, user: sanitizeUser(user), accessToken, refreshToken });
});

app.post('/api/auth/refresh', (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) return res.status(401).json({ success: false, message: 'No refresh token' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const stored = refreshStore.get(payload.id);
    if (!stored || stored !== token) return res.status(401).json({ success: false, message: 'Refresh token invalid' });
    const user = users.find((item) => item.id === payload.id);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    const accessToken = createToken({ id: user.id, email: user.email, role: user.role });
    res.json({ success: true, accessToken, user: sanitizeUser(user) });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Session expired' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (token) {
    const payload = jwt.decode(token) || {};
    if (payload.id) refreshStore.delete(payload.id);
  }
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully' });
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body || {};
  const user = getUserByEmail(email);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
  resetTokens.set(token, user.id);

  const host = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  if (host) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'MP Institute <noreply@mpinstitute.edu.in>',
      to: user.email,
      subject: 'Password reset request',
      html: `<p>Use this reset link:</p><p>${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}</p>`,
    });
  } else {
    console.log('Dev mode: reset link', `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`);
  }

  res.json({ success: true, message: 'Password reset instructions have been sent.' });
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { token, password } = req.body || {};
  if (!token || !password) return res.status(400).json({ success: false, message: 'Token and new password are required.' });
  const userId = resetTokens.get(token);
  if (!userId) return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
  const user = users.find((item) => item.id === userId);
  if (!user) return res.status(400).json({ success: false, message: 'User not found.' });
  user.password = await bcrypt.hash(password, 10);
  resetTokens.delete(token);
  res.json({ success: true, message: 'Password reset successfully.' });
});

app.get('/api/profile', authMiddleware, (req, res) => {
  const user = users.find((item) => item.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, user: sanitizeUser(user) });
});

app.get('/api/public/site', (_req, res) => {
  res.json({
    stats: [
      { label: 'Programmes', value: '8' },
      { label: 'Total Seats', value: '1,290' },
      { label: 'Green Campus', value: '7-acre' },
      { label: 'Alumni', value: '10,000+' },
    ],
    institution: {
      name: 'MP Institute of Management and Computer Application',
      tagline: 'Affiliated to Mahatma Gandhi Kashi Vidyapith (MGKVP), Varanasi',
      address: 'Bhagatua, Balua Ghat Main Road, Varanasi – 221104, Uttar Pradesh',
      established: '2004',
      approved: 'AICTE & NCTE',
      partnership: 'AIT, Bangkok, Thailand',
    },
    programmes,
    notices,
    newsPosts,
    people,
  });
});

app.get('/api/programmes', (_req, res) => {
  res.json({ success: true, programmes });
});

app.get('/api/programmes/:slug', (req, res) => {
  const course = programmes.find((item) => item.slug === req.params.slug);
  if (!course) return res.status(404).json({ success: false, message: 'Programme not found' });
  res.json({ success: true, programme: course });
});

app.get('/api/people', (_req, res) => {
  res.json({ success: true, people });
});

app.get('/api/notices', (_req, res) => {
  res.json({ success: true, notices });
});

app.get('/api/news', (_req, res) => {
  res.json({ success: true, newsPosts });
});

app.get('/api/fees', (_req, res) => {
  res.json({ success: true, feeStructures, payments });
});

app.get('/api/library', (_req, res) => {
  res.json({ success: true, books });
});

app.get('/api/admin/dashboard', authMiddleware, roleMiddleware('admin'), (_req, res) => {
  res.json({
    success: true,
    stats: {
      students: users.filter((u) => u.role === 'student').length,
      teachers: users.filter((u) => u.role === 'teacher').length,
      programmeCount: programmes.length,
      collection: 1280000,
    },
    notices,
    enquiries,
    attendance: [
      { name: 'Jan', present: 88, late: 6 },
      { name: 'Feb', present: 90, late: 5 },
      { name: 'Mar', present: 92, late: 4 },
    ],
    fees: [
      { name: 'Jan', amount: 220000 },
      { name: 'Feb', amount: 290000 },
      { name: 'Mar', amount: 310000 },
    ],
    results: [
      { name: 'A+', value: 18 },
      { name: 'A', value: 31 },
      { name: 'B', value: 24 },
      { name: 'C', value: 12 },
    ],
  });
});

app.get('/api/admin/students', authMiddleware, roleMiddleware('admin'), (_req, res) => {
  res.json({ success: true, students: users.filter((u) => u.role === 'student') });
});

app.get('/api/admin/teachers', authMiddleware, roleMiddleware('admin'), (_req, res) => {
  res.json({ success: true, teachers: users.filter((u) => u.role === 'teacher') });
});

app.get('/api/admin/notices', authMiddleware, roleMiddleware('admin'), (_req, res) => {
  res.json({ success: true, notices });
});

app.post('/api/admin/notices', authMiddleware, roleMiddleware('admin'), (req, res) => {
  const notice = { id: `n-${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
  notices.unshift(notice);
  res.status(201).json({ success: true, notice });
});

app.get('/api/admin/enquiries', authMiddleware, roleMiddleware('admin'), (_req, res) => {
  res.json({ success: true, enquiries });
});

app.patch('/api/admin/enquiries/:id', authMiddleware, roleMiddleware('admin'), (req, res) => {
  const enquiry = enquiries.find((item) => item.id === req.params.id);
  if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
  Object.assign(enquiry, req.body);
  res.json({ success: true, enquiry });
});

app.get('/api/teacher/dashboard', authMiddleware, roleMiddleware('teacher'), (req, res) => {
  const teacher = users.find((u) => u.id === req.user.id);
  res.json({ success: true, teacher, subjects: ['Web Development', 'Database Management', 'Software Engineering'], todayClasses: 4, averages: [85, 88, 90], attendance: [90, 88, 92] });
});

app.get('/api/student/dashboard', authMiddleware, roleMiddleware('student'), (req, res) => {
  const student = users.find((u) => u.id === req.user.id);
  res.json({ success: true, student, attendance: attendance.find((a) => a.studentId === req.user.id)?.percentage || 90, dues: 28000, notices, assignments });
});

app.post('/api/enquiries', (req, res) => {
  const { name, email, phone, message } = req.body || {};
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ success: false, message: 'Please fill in all fields.' });
  }
  const enquiry = { id: `e-${Date.now()}`, name, email, phone, message, status: 'New' };
  enquiries.unshift(enquiry);
  res.status(201).json({ success: true, message: 'Enquiry submitted successfully.', enquiry });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill in all fields.' });
  }
  res.json({ success: true, message: 'Your message has been recorded.' });
});

app.get('/api/chat', authMiddleware, (_req, res) => {
  res.json({ success: true, messages: chatMessages });
});

app.post('/api/chat', authMiddleware, (req, res) => {
  const { room = 'general', text } = req.body || {};
  const sender = users.find((u) => u.id === req.user.id);
  const message = { id: `msg-${Date.now()}`, room, sender: sender.email, senderName: sender.name, role: sender.role, text, createdAt: new Date().toISOString() };
  chatMessages.push(message);
  io.emit(room, { type: 'message', payload: message });
  res.status(201).json({ success: true, message });
});

app.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
  res.json({ success: true, file: { name: req.file.filename, path: `/uploads/${req.file.filename}` } });
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
  if (!token) return next(new Error('Authentication error'));
  try {
    const normalized = token.startsWith('Bearer ') ? token.slice(7) : token;
    const user = jwt.verify(normalized, JWT_SECRET);
    socket.user = user;
    return next();
  } catch (error) {
    return next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  socket.join('general');
  socket.on('join-room', (room) => {
    socket.join(room);
    socket.emit('joined-room', room);
  });
  socket.on('send-message', (payload) => {
    const sender = users.find((u) => u.email === socket.user.email);
    if (!sender) return;
    const message = { id: `msg-${Date.now()}`, room: payload.room || 'general', sender: sender.email, senderName: sender.name, role: sender.role, text: payload.text || '', createdAt: new Date().toISOString() };
    chatMessages.push(message);
    io.to(payload.room || 'general').emit('new-message', message);
  });
});

async function connectMongo() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('MongoDB connected');
  } catch (error) {
    console.warn('MongoDB unavailable, continuing with demo in-memory data.', error.message);
  }
}

server.listen(PORT, async () => {
  await connectMongo();
  console.log(`MP Institute API running on http://localhost:${PORT}`);
});
