const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { Pool } = require("pg");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const app = express();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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

app.options('*', cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }
});

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

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.post('/api/projects', upload.single('image'), verifyAdmin, async (req, res) => {
  try {
    const { title, desc, link, github, tech } = req.body;
    if (!req.file) return res.status(400).json({ error: "Wajib upload gambar!" });

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

app.put('/api/projects/:id', upload.single('image'), verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, desc, link, github, tech } = req.body;

  try {
    let updateData = { title, desc, link: link || null, github: github || null };
    if (tech) {
      try { updateData.tech = JSON.parse(tech); } catch(e) {}
    }
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
    await prisma.project.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Gagal hapus" });
  }
});

module.exports = app;