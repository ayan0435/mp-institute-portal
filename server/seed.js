import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
dotenv.config({ path: path.join(rootDir, '.env') });

const seedData = {
  users: [
    { id: 'u-admin-1', name: 'Admin User', email: 'admin@mpinstitute.edu.in', password: 'Admin@123', role: 'admin' },
    { id: 'u-office-1', name: 'Office Admin', email: 'office@mpinstitute.edu.in', password: 'Admin@123', role: 'admin' },
    { id: 'u-vishnupriya', name: 'Vishnupriya', email: 'vishnupriya@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-bn-pandey', name: 'Prof. B N Pandey', email: 'bn.pandey@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-pratibha', name: 'Pratibha Singh', email: 'pratibha.singh@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-vidhi', name: 'Vidhi Mishra', email: 'vidhi.mishra@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-nimisha', name: 'Nimisha Jaiswal', email: 'nimisha.jaiswal@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-anita', name: 'Anita Patel', email: 'anita.patel@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-sushmita', name: 'Sushmita Singh', email: 'sushmita.singh@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-pooranm', name: 'Pooranmasi Patel', email: 'pooranmasi.patel@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-santwana', name: 'Dr Santwana Mishra', email: 'santwana.mishra@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-anand', name: 'Anand Vishwakarma', email: 'anand.vishwakarma@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-ashutosh1', name: 'Dr Ashutosh Mishra', email: 'ashutosh.mishra@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-shweta', name: 'Dr Shweta Kumari', email: 'shweta.kumari@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-ajay', name: 'Ajay Kumar Singh', email: 'ajay.kumar@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-poonam', name: 'Poonam Singh', email: 'poonam.singh@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-pankaj', name: 'Pankaj Yadav', email: 'pankaj.yadav@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-archana', name: 'Archana Devi', email: 'archana.devi@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-ashutosh2', name: 'Ashutosh Singh', email: 'ashutosh.singh@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-budhi', name: 'Budhi Ram', email: 'budhi.ram@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-waseem', name: 'Waseem Siddhaqi', email: 'waseem.siddhaqi@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-naqi', name: 'Naqi Hasan', email: 'naqi.hasan@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-dilip', name: 'Dilip Kushwaha', email: 'dilip.kushwaha@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 'u-sandeep', name: 'Sandeep Singh', email: 'sandeep.singh@mpinstitute.edu.in', password: 'Teacher@123', role: 'teacher' },
    { id: 's-1', name: 'Aarav Singh', email: 'aarav.singh@student.mpinstitute.edu.in', password: 'Student@123', role: 'student' },
    { id: 's-2', name: 'Diya Sharma', email: 'diya.sharma@student.mpinstitute.edu.in', password: 'Student@123', role: 'student' },
    { id: 's-3', name: 'Rohit Verma', email: 'rohit.verma@student.mpinstitute.edu.in', password: 'Student@123', role: 'student' },
    { id: 's-4', name: 'Kavya Yadav', email: 'kavya.yadav@student.mpinstitute.edu.in', password: 'Student@123', role: 'student' },
    { id: 's-5', name: 'Nikita Singh', email: 'nikita.singh@student.mpinstitute.edu.in', password: 'Student@123', role: 'student' },
    { id: 's-6', name: 'Harsh Tiwari', email: 'harsh.tiwari@student.mpinstitute.edu.in', password: 'Student@123', role: 'student' },
    { id: 's-7', name: 'Priya Mishra', email: 'priya.mishra@student.mpinstitute.edu.in', password: 'Student@123', role: 'student' },
    { id: 's-8', name: 'Aditya Kumar', email: 'aditya.kumar@student.mpinstitute.edu.in', password: 'Student@123', role: 'student' },
    { id: 's-9', name: 'Sneha Singh', email: 'sneha.singh@student.mpinstitute.edu.in', password: 'Student@123', role: 'student' },
    { id: 's-10', name: 'Manish Patel', email: 'manish.patel@student.mpinstitute.edu.in', password: 'Student@123', role: 'student' },
    { id: 's-11', name: 'Anjali Dubey', email: 'anjali.dubey@student.mpinstitute.edu.in', password: 'Student@123', role: 'student' },
    { id: 's-12', name: 'Saurabh Giri', email: 'saurabh.giri@student.mpinstitute.edu.in', password: 'Student@123', role: 'student' },
    { id: 's-13', name: 'Neha Gupta', email: 'neha.gupta@student.mpinstitute.edu.in', password: 'Student@123', role: 'student' },
    { id: 's-14', name: 'Vinay Pathak', email: 'vinay.pathak@student.mpinstitute.edu.in', password: 'Student@123', role: 'student' },
    { id: 's-15', name: 'Megha Pandey', email: 'megha.pandey@student.mpinstitute.edu.in', password: 'Student@123', role: 'student' },
    { id: 's-16', name: 'Rakesh Yadav', email: 'rakesh.yadav@student.mpinstitute.edu.in', password: 'Student@123', role: 'student' },
    { id: 's-17', name: 'Shivani Singh', email: 'shivani.singh@student.mpinstitute.edu.in', password: 'Student@123', role: 'student' },
    { id: 's-18', name: 'Utkarsh Srivastava', email: 'utkarsh.srivastava@student.mpinstitute.edu.in', password: 'Student@123', role: 'student' },
    { id: 's-19', name: 'Riya Dwivedi', email: 'riya.dwivedi@student.mpinstitute.edu.in', password: 'Student@123', role: 'student' },
    { id: 's-20', name: 'Amit Tiwari', email: 'amit.tiwari@student.mpinstitute.edu.in', password: 'Student@123', role: 'student' },
  ]
};

const topDir = path.join(rootDir, 'server', 'uploads');
if (!fs.existsSync(topDir)) fs.mkdirSync(topDir, { recursive: true });

const output = JSON.stringify(seedData, null, 2);
fs.writeFileSync(path.join(rootDir, 'server', 'seed-data.json'), output);

const withHashes = seedData.users.map((user) => ({ ...user, password: bcrypt.hashSync(user.password, 10) }));
console.log('Seed data prepared for', withHashes.length, 'users.');
