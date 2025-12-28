require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");

// --- PERBAIKAN IMPORT CLOUDINARY ---
const cloudinary = require("cloudinary").v2;
const CloudinaryStorage = require("multer-storage-cloudinary");

const { Pool } = require("pg");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const app = express();
const PORT = process.env.PORT || 5000;

// 1. SETUP DATABASE
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

// 2. SETUP CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Konfigurasi Storage dengan Error Handling Sederhana
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "portfolio-tahajjadan",
    allowedFormats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage: storage });

// 3. MIDDLEWARE AUTH
const verifyAdmin = (req, res, next) => {
  const { adminKey } = req.body;
  
  if (!process.env.ADMIN_PASSWORD) {
     return res.status(500).json({ error: "Server Error: ADMIN_PASSWORD not set" });
  }
  
  if (adminKey !== process.env.ADMIN_PASSWORD) {
    // Hapus gambar di Cloudinary jika password salah (Cleanup)
    if (req.file && req.file.filename) {
        cloudinary.uploader.destroy(req.file.filename).catch(e => console.log(e));
    }
    return res.status(403).json({ error: "Password salah!" });
  }
  next();
};

// 4. ROUTES

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

    const imageUrl = req.file.path; 

    let techArray = [];
    try { techArray = JSON.parse(tech); } catch (e) { techArray = [tech]; }

    const newProject = await prisma.project.create({
      data: {
        title,
        desc,
        image: imageUrl,
        link: link || null,
        github: github || null,
        tech: techArray,
      },
    });
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Gagal upload project" });
  }
});

// UPDATE (PUT)
app.put('/api/projects/:id', upload.single('image'), verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, desc, link, github, tech } = req.body;

  try {
    let updateData = {
      title,
      desc,
      link: link || null,
      github: github || null,
    };

    if (tech) {
      try { updateData.tech = JSON.parse(tech); } catch(e) {}
    }

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal update project" });
  }
});

// DELETE
app.delete('/api/projects/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.project.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Gagal hapus" });
  }
});

// Export App untuk Vercel, Listen untuk Local
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`✅ Server berjalan di http://localhost:${PORT}`);
    });
}

module.exports = app;