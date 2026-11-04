# MP Institute Portal

A production-style website and campus management portal for MP Institute of Management and Computer Application, Bhagatua, Varanasi.

## Stack
- Frontend: React 18 + Vite + React Router
- Backend: Node.js + Express + Socket.io
- Database: MongoDB with Mongoose; app automatically falls back to in-memory demo data when MongoDB is unavailable.
- Auth: JWT access token and refresh token rotation
- Documents: PDF generation for receipts and grade cards using PDFKit
- File uploads: Multer stored under `server/uploads`

## Local setup
1. `npm install`
2. Copy `.env.example` to `.env` and update values
3. `npm run seed`
4. `npm run dev`

The app runs at:
- Client: http://localhost:5173
- Server: http://localhost:5001

## Demo credentials
- Admin: `admin@mpinstitute.edu.in` / `Admin@123`
- Office Admin: `office@mpinstitute.edu.in` / `Admin@123`
- Teacher: `vishnupriya@mpinstitute.edu.in` / `Teacher@123`
- Student: `aarav.singh@student.mpinstitute.edu.in` / `Student@123`

## MongoDB Atlas
1. Create a MongoDB Atlas account and cluster.
2. Get the connection URI.
3. Update `MONGODB_URI` in `.env`.
4. Run `npm run seed` and then `npm run dev`.

## Docker
```bash
docker compose up --build
```

## SMTP reset mode
- If `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` are configured, password reset emails are delivered via SMTP.
- If not configured, the app switches to dev mode and prints the reset URL in the server console.

## Notes
This project includes demo content for all required institute entities and a working portal shell with login flows and public pages.
