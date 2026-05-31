require('dotenv').config();

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

// Middleware untuk upload gallery experience (Maksimal 2 file)
const expUploadMiddleware = upload.fields([
  { name: 'gallery', maxCount: 2 }
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

// --- EXPERIENCES ENDPOINTS ---

// GET ALL EXPERIENCES
app.get('/api/experiences', async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({ 
      orderBy: [
        { order: 'asc' },
        { id: 'desc' }
      ]
    });
    res.json(experiences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

// CREATE (POST)
app.post('/api/experiences', expUploadMiddleware, verifyAdmin, async (req, res) => {
  try {
    const { role, company, location, startDate, endDate, desc, skills, link, order } = req.body;

    // Validasi: Maksimal 2 foto
    if (req.files && req.files['gallery'] && req.files['gallery'].length > 2) {
        return res.status(400).json({ error: "Maksimal hanya boleh mengunggah 2 foto untuk dokumentasi!" });
    }

    // Upload Gallery Images (Jika ada)
    let galleryUrls = [];
    if (req.files && req.files['gallery']) {
        const uploadPromises = req.files['gallery'].map(file => uploadToCloudinary(file.buffer));
        galleryUrls = await Promise.all(uploadPromises);
    }

    let skillsArray = [];
    if (skills) {
      if (typeof skills === 'string') {
        try { skillsArray = JSON.parse(skills); } catch (e) { skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean); }
      } else if (Array.isArray(skills)) {
        skillsArray = skills;
      }
    }

    const newExperience = await prisma.experience.create({
      data: {
        role,
        company,
        location: location || null,
        startDate,
        endDate,
        desc,
        skills: skillsArray,
        link: link || null,
        gallery: galleryUrls,
        order: parseInt(order) || 0,
      },
    });
    res.status(201).json(newExperience);
  } catch (error) {
    console.error("Create Experience Error:", error);
    res.status(500).json({ error: "Gagal menyimpan pengalaman kerja", details: error.message });
  }
});

// UPDATE (PUT)
app.put('/api/experiences/:id', expUploadMiddleware, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { role, company, location, startDate, endDate, desc, skills, link, order } = req.body;

  try {
    let updateData = { role, company, location: location || null, startDate, endDate, desc, link: link || null };

    // Validasi: Maksimal 2 foto
    if (req.files && req.files['gallery'] && req.files['gallery'].length > 2) {
        return res.status(400).json({ error: "Maksimal hanya boleh mengunggah 2 foto untuk dokumentasi!" });
    }

    if (order !== undefined) {
      updateData.order = parseInt(order) || 0;
    }

    if (skills) {
      if (typeof skills === 'string') {
        try { updateData.skills = JSON.parse(skills); } catch (e) { updateData.skills = skills.split(',').map(s => s.trim()).filter(Boolean); }
      } else if (Array.isArray(skills)) {
        updateData.skills = skills;
      }
    }

    // Upload Gallery Images (Jika ada)
    if (req.files && req.files['gallery']) {
        const uploadPromises = req.files['gallery'].map(file => uploadToCloudinary(file.buffer));
        updateData.gallery = await Promise.all(uploadPromises);
    }

    const updatedExperience = await prisma.experience.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    res.json(updatedExperience);
  } catch (error) {
    console.error("Update Experience Error:", error);
    res.status(500).json({ error: "Gagal update pengalaman kerja", details: error.message });
  }
});

// DELETE
app.delete('/api/experiences/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.experience.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Gagal hapus" });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Backend Server is running locally on port ${PORT}`);
  });
}

module.exports = app;
// Trigger Nodemon reload for updated Prisma client - v3.