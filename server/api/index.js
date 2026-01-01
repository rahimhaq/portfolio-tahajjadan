const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { Pool } = require("pg");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const app = express();

// --- SETUP DATABASE START ---
const connectionString = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

const pool = new Pool({ 
  connectionString: connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false 
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
// --- SETUP DATABASE END ---

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

app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Multer (Memory Storage)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 } // Batas 2MB per file
});

// --- PERUBAHAN 1: DEFINISI UPLOAD FIELDS ---
// Menerima 1 file untuk 'image' (Cover) dan maksimal 10 file untuk 'gallery'
const uploadMiddleware = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 10 }
]);

// --- PERUBAHAN 2: HELPER FUNCTION UPLOAD ---
// Fungsi ini dipisah agar bisa dipakai untuk upload cover maupun loop gallery
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "portfolio-tahajjadan", resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

// Middleware Verify Admin
const verifyAdmin = (req, res, next) => {
  const { adminKey } = req.body;
  
  if (!process.env.ADMIN_PASSWORD) {
     return res.status(500).json({ error: "Server Error: ADMIN_PASSWORD not set" });
  }
  if (adminKey !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: "Password salah!" });
  }
  next();
};

// GET ALL PROJECTS
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
app.post('/api/projects', uploadMiddleware, verifyAdmin, async (req, res) => {
  try {
    const { title, desc, link, github, tech } = req.body;
    
    // Validasi: Cover Image Wajib Ada
    // req.files['image'] adalah array, jadi kita ambil index ke-0
    if (!req.files || !req.files['image']) {
       return res.status(400).json({ error: "Wajib upload gambar cover!" });
    }

    // 1. Upload Cover Image
    const coverUrl = await uploadToCloudinary(req.files['image'][0].buffer);

    // 2. Upload Gallery Images (Jika ada)
    let galleryUrls = [];
    if (req.files['gallery']) {
        // Kita map setiap file menjadi Promise upload, lalu jalankan semua sekaligus (Parallel)
        const uploadPromises = req.files['gallery'].map(file => uploadToCloudinary(file.buffer));
        galleryUrls = await Promise.all(uploadPromises);
    }

    let techArray = [];
    try { techArray = JSON.parse(tech); } catch (e) { techArray = [tech]; }

    const newProject = await prisma.project.create({
      data: {
        title, desc,
        image: coverUrl,       // String (URL Cover)
        gallery: galleryUrls,  // String[] (Array URL Gallery)
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
app.put('/api/projects/:id', uploadMiddleware, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, desc, link, github, tech } = req.body;

  try {
    let updateData = { title, desc, link: link || null, github: github || null };
    
    if (tech) {
      try { updateData.tech = JSON.parse(tech); } catch(e) {}
    }
    
    // Cek jika ada upload Cover baru
    if (req.files && req.files['image']) {
       updateData.image = await uploadToCloudinary(req.files['image'][0].buffer);
    }

    // Cek jika ada upload Gallery baru
    // Note: Logika ini akan ME-REPLACE gallery lama dengan yang baru.
    if (req.files && req.files['gallery']) {
       const uploadPromises = req.files['gallery'].map(file => uploadToCloudinary(file.buffer));
       updateData.gallery = await Promise.all(uploadPromises);
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
    await prisma.project.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Gagal hapus" });
  }
});

module.exports = app;