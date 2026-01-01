const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { Pool } = require("pg");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const app = express();

// --- PERBAIKAN DATABASE START ---
// Gunakan POSTGRES_PRISMA_URL (bawaan Vercel) atau fallback ke DATABASE_URL
const connectionString = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

const pool = new Pool({ 
  connectionString: connectionString,
  // PENTING: Vercel Postgres WAJIB menggunakan SSL di Production
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false 
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
// --- PERBAIKAN DATABASE END ---

app.use(cors({
  origin: [
    'https://tahajjadan.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// app.options('*', cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Multer (Memory Storage) - File disimpan di RAM sementara
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 } // Batas 2MB agar aman untuk Vercel
});

// Middleware Verify Admin
const verifyAdmin = (req, res, next) => {
  // Karena 'upload.single' berjalan duluan di route, req.body sudah terisi di sini
  const { adminKey } = req.body;
  
  if (!process.env.ADMIN_PASSWORD) {
     return res.status(500).json({ error: "Server Error: ADMIN_PASSWORD not set" });
  }
  if (adminKey !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: "Password salah!" });
  }
  next();
};

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

// CREATE (POST)
app.post('/api/projects', upload.single('image'), verifyAdmin, async (req, res) => {
  try {
    const { title, desc, link, github, tech } = req.body;
    if (!req.file) return res.status(400).json({ error: "Wajib upload gambar!" });

    // Upload Buffer ke Cloudinary menggunakan Stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "portfolio-tahajjadan", resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    let techArray = [];
    try { techArray = JSON.parse(tech); } catch (e) { techArray = [tech]; }

    const newProject = await prisma.project.create({
      data: {
        title, desc,
        image: uploadResult.secure_url,
        link: link || null,
        github: github || null,
        tech: techArray,
      },
    });
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Gagal upload project", details: error.message });
  }
});

// UPDATE (PUT)
app.put('/api/projects/:id', upload.single('image'), verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, desc, link, github, tech } = req.body;

  try {
    let updateData = { title, desc, link: link || null, github: github || null };
    
    if (tech) {
      try { updateData.tech = JSON.parse(tech); } catch(e) {}
    }
    
    // Jika ada file baru, upload ulang ke Cloudinary
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "portfolio-tahajjadan", resource_type: "auto" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      updateData.image = uploadResult.secure_url;
    }

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal update project", details: error.message });
  }
});

app.delete('/api/projects/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    // Opsional: Anda bisa menambahkan logika menghapus gambar di Cloudinary di sini jika mau
    await prisma.project.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Gagal hapus" });
  }
});

module.exports = app; 