/**
 * ===============================
 *  CONFIG & IMPORT
 * ===============================
 */
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const { Pool } = require("pg");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

/**
 * ===============================
 *  VALIDASI ENV (ANTI TIMEOUT)
 * ===============================
 */
const requiredEnvs = [
  "DATABASE_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "ADMIN_PASSWORD",
];

requiredEnvs.forEach((env) => {
  if (!process.env[env]) {
    throw new Error(`❌ ENV ${env} belum diset`);
  }
});

/**
 * ===============================
 *  INIT APP
 * ===============================
 */
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/**
 * ===============================
 *  DATABASE (PRISMA + POSTGRES)
 * ===============================
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * ===============================
 *  CLOUDINARY CONFIG
 * ===============================
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * ===============================
 *  MULTER + CLOUDINARY STORAGE
 * ===============================
 */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio-tahajjadan",
    format: async (req, file) => ["jpg", "png", "jpeg", "webp"],
  },
});


const upload = multer({ storage });

/**
 * ===============================
 *  MIDDLEWARE ADMIN
 * ===============================
 */
const verifyAdmin = async (req, res, next) => {
  const { adminKey } = req.body;

  if (adminKey !== process.env.ADMIN_PASSWORD) {
    // Cleanup cloudinary jika upload sudah terjadi
    if (req.file?.filename) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (err) {
        console.error("Cloudinary cleanup error:", err);
      }
    }
    return res.status(403).json({ error: "Password salah!" });
  }

  next();
};

/**
 * ===============================
 *  ROUTES
 * ===============================
 */

// GET ALL PROJECTS
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

// CREATE PROJECT
app.post(
  "/api/projects",
  upload.single("image"),
  verifyAdmin,
  async (req, res) => {
    try {
      const { title, desc, link, github, tech } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "Gambar wajib diupload" });
      }

      let techArray = [];
      try {
        techArray = JSON.parse(tech);
      } catch {
        techArray = tech ? [tech] : [];
      }

      const project = await prisma.project.create({
        data: {
          title,
          desc,
          image: req.file.path,
          link: link || null,
          github: github || null,
          tech: techArray,
        },
      });

      res.status(201).json(project);
    } catch (err) {
      console.error("Create error:", err);
      res.status(500).json({ error: "Gagal membuat project" });
    }
  }
);

// UPDATE PROJECT
app.put(
  "/api/projects/:id",
  upload.single("image"),
  verifyAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { title, desc, link, github, tech } = req.body;

    try {
      const data = {
        title,
        desc,
        link: link || null,
        github: github || null,
      };

      if (tech) {
        try {
          data.tech = JSON.parse(tech);
        } catch {}
      }

      if (req.file) {
        data.image = req.file.path;
      }

      const project = await prisma.project.update({
        where: { id: parseInt(id) },
        data,
      });

      res.json(project);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal update project" });
    }
  }
);

// DELETE PROJECT
app.delete("/api/projects/:id", verifyAdmin, async (req, res) => {
  try {
    await prisma.project.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Project dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal hapus project" });
  }
});

/**
 * ===============================
 *  LOCAL DEV ONLY
 * ===============================
 */
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
