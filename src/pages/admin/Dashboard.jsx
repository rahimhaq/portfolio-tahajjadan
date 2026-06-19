import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save,
  LogOut,
  ArrowLeft,
  Trash2,
  Edit2,
  PlusCircle,
  X,
  UploadCloud,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [activeTab, setActiveTab] = useState("projects");

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // State Form Project
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [link, setLink] = useState("");
  const [github, setGithub] = useState("");
  const [techInput, setTechInput] = useState("");

  // State Khusus Gambar
  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]); // State untuk file gallery
  const [previewImage, setPreviewImage] = useState("");

  // State Form Experience
  const [isEditingExp, setIsEditingExp] = useState(false);
  const [editExpId, setEditExpId] = useState(null);
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [expDesc, setExpDesc] = useState("");
  const [expLink, setExpLink] = useState("");
  const [expGalleryFiles, setExpGalleryFiles] = useState([]); // State untuk file gallery experience
  const [expPreviewGallery, setExpPreviewGallery] = useState([]); // Preview gallery (URL strings or blob URLs)
  const [expOrder, setExpOrder] = useState(0); // State untuk urutan posisi

  // --- AMBIL URL API DARI ENVIRONMENT VARIABLE ---
  // Jika .env tidak terbaca, fallback ke localhost (untuk safety dev)
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const key = sessionStorage.getItem("adminKey");
    if (!key) navigate("/admin/login");
    else {
      fetchProjects();
      fetchExperiences();
      fetchVisitors();
    }
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      // ✅ GUNAKAN API_URL
      const res = await fetch(`${API_URL}/api/projects`);
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Gagal load projects");
    }
  };

  const fetchExperiences = async () => {
    try {
      const res = await fetch(`${API_URL}/api/experiences`);
      const data = await res.json();
      setExperiences(data);
    } catch (error) {
      console.error("Gagal load experiences");
    }
  };

  const fetchVisitors = async () => {
    try {
      const adminKey = sessionStorage.getItem("adminKey");
      const res = await fetch(`${API_URL}/api/visitors?adminKey=${adminKey}`);
      const data = await res.json();
      if (res.ok) {
        setVisitors(data);
      } else {
        console.error("Gagal load visitors:", data.error);
      }
    } catch (error) {
      console.error("Gagal load visitors:", error);
    }
  };

  const handleDeleteAllVisitors = async () => {
    if (!window.confirm("Yakin ingin menghapus semua data riwayat pengunjung? Tindakan ini tidak bisa dibatalkan.")) return;
    const adminKey = sessionStorage.getItem("adminKey");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/visitors?adminKey=${adminKey}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Berhasil menghapus semua riwayat pengunjung!");
        fetchVisitors();
      } else {
        throw new Error(data.error || "Gagal menghapus");
      }
    } catch (error) {
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const adminKey = sessionStorage.getItem("adminKey");
    const techArray = techInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("link", link);
    formData.append("github", github);
    formData.append("tech", JSON.stringify(techArray));
    formData.append("adminKey", adminKey);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    // TAMBAHAN: Append Gallery Files
    if (galleryFiles.length > 0) {
      Array.from(galleryFiles).forEach((file) => {
        formData.append("gallery", file); // Nama key harus 'gallery' sesuai backend
      });
    }

    try {
      // ✅ GUNAKAN API_URL DISINI
      let url = `${API_URL}/api/projects`;
      let method = "POST";

      if (isEditing) {
        url = `${API_URL}/api/projects/${editId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method: method,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan");

      alert(`✅ Berhasil!`);
      resetForm();
      fetchProjects();
    } catch (error) {
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setIsEditing(true);
    setEditId(project.id);
    setTitle(project.title);
    setDesc(project.desc);
    setLink(project.link || "");
    setGithub(project.github || "");
    setTechInput(project.tech.join(", "));
    setPreviewImage(project.image);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus?")) return;
    const adminKey = sessionStorage.getItem("adminKey");

    try {
      // ✅ GUNAKAN API_URL DISINI JUGA
      const res = await fetch(`${API_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey }),
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      fetchProjects();
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setTitle("");
    setDesc("");
    setLink("");
    setGithub("");
    setTechInput("");
    setImageFile(null);
    setPreviewImage("");
    const fileInput = document.getElementById("fileInput");
    if (fileInput) fileInput.value = "";
  };

  const handleExpFileChange = (e) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    if (newFiles.length === 0) return;

    // Gabungkan file lama dengan file baru
    const combinedFiles = [...expGalleryFiles, ...newFiles];

    if (combinedFiles.length > 2) {
      alert("❌ Maksimal hanya boleh mengunggah 2 foto untuk dokumentasi pengalaman!");
      const slicedFiles = combinedFiles.slice(0, 2);
      setExpGalleryFiles(slicedFiles);
      const previewUrls = slicedFiles.map((file) => URL.createObjectURL(file));
      setExpPreviewGallery(previewUrls);
    } else {
      setExpGalleryFiles(combinedFiles);
      const previewUrls = combinedFiles.map((file) => URL.createObjectURL(file));
      setExpPreviewGallery(previewUrls);
    }
    e.target.value = ""; // Reset input value agar bisa trigger event onChange jika memilih file yang sama
  };

  const handleExpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const adminKey = sessionStorage.getItem("adminKey");
    const skillsArray = skillsInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    const formData = new FormData();
    formData.append("role", role);
    formData.append("company", company);
    formData.append("location", location || "");
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("desc", expDesc);
    formData.append("skills", JSON.stringify(skillsArray));
    formData.append("link", expLink || "");
    formData.append("adminKey", adminKey);
    formData.append("order", expOrder);

    if (expGalleryFiles.length > 0) {
      Array.from(expGalleryFiles).forEach((file) => {
        formData.append("gallery", file);
      });
    }

    try {
      let url = `${API_URL}/api/experiences`;
      let method = "POST";

      if (isEditingExp) {
        url = `${API_URL}/api/experiences/${editExpId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method: method,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan");

      alert(`✅ Berhasil!`);
      resetExpForm();
      fetchExperiences();
    } catch (error) {
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditExp = (exp) => {
    setIsEditingExp(true);
    setEditExpId(exp.id);
    setRole(exp.role);
    setCompany(exp.company);
    setLocation(exp.location || "");
    setStartDate(exp.startDate);
    setEndDate(exp.endDate);
    setSkillsInput(exp.skills ? exp.skills.join(", ") : "");
    setExpDesc(exp.desc);
    setExpLink(exp.link || "");
    setExpPreviewGallery(exp.gallery || []);
    setExpGalleryFiles([]);
    setExpOrder(exp.order || 0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteExp = async (id) => {
    if (!window.confirm("Yakin hapus pengalaman ini?")) return;
    const adminKey = sessionStorage.getItem("adminKey");

    try {
      const res = await fetch(`${API_URL}/api/experiences/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey }),
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      fetchExperiences();
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  const resetExpForm = () => {
    setIsEditingExp(false);
    setEditExpId(null);
    setRole("");
    setCompany("");
    setLocation("");
    setStartDate("");
    setEndDate("");
    setSkillsInput("");
    setExpDesc("");
    setExpLink("");
    setExpGalleryFiles([]);
    setExpPreviewGallery([]);
    setExpOrder(0);
    const expFileInput = document.getElementById("expFileInput");
    if (expFileInput) expFileInput.value = "";
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminKey");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex gap-2 justify-end sm:justify-start">
            <button
              onClick={() => navigate("/")}
              className="p-2 text-gray-500 hover:text-blue-600"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2 font-semibold"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* TAB SELECTOR */}
        <div className="flex bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              setActiveTab("projects");
              resetForm();
              resetExpForm();
            }}
            className={`flex-1 py-2.5 sm:py-3 text-center text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 ${activeTab === "projects"
              ? "bg-blue-600 text-white shadow-md shadow-blue-100"
              : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
          >
            Projects
          </button>
          <button
            onClick={() => {
              setActiveTab("experiences");
              resetForm();
              resetExpForm();
            }}
            className={`flex-1 py-2.5 sm:py-3 text-center text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 ${activeTab === "experiences"
              ? "bg-blue-600 text-white shadow-md shadow-blue-100"
              : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
          >
            Experiences
          </button>
          <button
            onClick={() => {
              setActiveTab("visitors");
              resetExpForm();
              fetchVisitors();
            }}
            className={`flex-1 py-2.5 sm:py-3 text-center text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 ${activeTab === "visitors"
              ? "bg-blue-600 text-white shadow-md shadow-blue-100"
              : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
          >
            Visitor Logs
          </button>
        </div>

        {activeTab === "projects" ? (
          <>
            {/* FORM INPUT PROJECT */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 sm:p-8 relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 w-1.5 h-full ${isEditing ? "bg-yellow-500" : "bg-blue-600"
                  }`}
              ></div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  {isEditing ? (
                    <Edit2 size={20} className="text-yellow-600" />
                  ) : (
                    <PlusCircle size={20} className="text-blue-600" />
                  )}
                  {isEditing ? "Edit Project" : "Tambah Project Baru"}
                </h2>
                {isEditing && (
                  <button
                    onClick={resetForm}
                    className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
                  >
                    <X size={16} /> Batal
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="label-style">Judul Project</label>
                    <input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="input-style"
                      placeholder="Nama Project..."
                    />
                  </div>
                  <div>
                    <label className="label-style">
                      Tech Stack (Pisahkan koma)
                    </label>
                    <input
                      required
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      className="input-style"
                      placeholder="React, Tailwind"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-style">Deskripsi</label>
                  <textarea
                    required
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="input-style h-24"
                    placeholder="Deskripsi project..."
                  />
                </div>

                {/* INPUT GAMBAR */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition relative">
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required={!isEditing}
                  />
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                    <UploadCloud size={32} className="text-blue-500" />
                    <span className="font-medium text-sm">
                      Klik untuk upload gambar project
                    </span>
                    <span className="text-xs text-gray-400">
                      JPG, PNG, WebP (Max 2MB)
                    </span>
                  </div>
                </div>

                {/* INPUT GALLERY */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition relative mt-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setGalleryFiles(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                    <span className="font-medium text-sm">
                      Upload Gallery Tambahan (Bisa banyak)
                    </span>
                    <span className="text-xs text-gray-400">
                      {galleryFiles && galleryFiles.length > 0
                        ? `${galleryFiles.length} file dipilih`
                        : "Belum ada file dipilih"}
                    </span>
                  </div>
                </div>

                {/* PREVIEW GAMBAR */}
                {previewImage && (
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      Preview
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="label-style">Link Demo</label>
                    <input
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="input-style"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="label-style">Link GitHub</label>
                    <input
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      className="input-style"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg ${isEditing
                    ? "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                    }`}
                >
                  {loading ? (
                    "Mengupload..."
                  ) : (
                    <>
                      <Save size={20} />{" "}
                      {isEditing ? "Update Project" : "Simpan Project"}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* LIST PROJECT */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 sm:p-8">
              <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">
                Daftar Project ({projects.length})
              </h3>
              <div className="space-y-4">
                {projects.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition bg-gray-50/50 gap-4"
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-md bg-gray-200 border"
                      />
                      <div>
                        <h4 className="font-bold text-gray-800">{item.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0 w-full md:w-auto justify-end">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 flex items-center gap-1 text-sm font-medium"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center gap-1 text-sm font-medium"
                      >
                        <Trash2 size={16} /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : activeTab === "experiences" ? (
          <>
            {/* FORM INPUT EXPERIENCE */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 sm:p-8 relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 w-1.5 h-full ${isEditingExp ? "bg-yellow-500" : "bg-blue-600"
                  }`}
              ></div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  {isEditingExp ? (
                    <Edit2 size={20} className="text-yellow-600" />
                  ) : (
                    <PlusCircle size={20} className="text-blue-600" />
                  )}
                  {isEditingExp ? "Edit Experience" : "Add New Experience"}
                </h2>
                {isEditingExp && (
                  <button
                    onClick={resetExpForm}
                    className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
                  >
                    <X size={16} /> Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleExpSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="label-style">Role</label>
                    <input
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="input-style"
                      placeholder="e.g., Fullstack Developer"
                    />
                  </div>
                  <div>
                    <label className="label-style">Company</label>
                    <input
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="input-style"
                      placeholder="e.g., PT. Telkom Indonesia"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-5">
                  <div>
                    <label className="label-style">Location</label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="input-style"
                      placeholder="e.g., Bandung, Indonesia (Hybrid)"
                    />
                  </div>
                  <div>
                    <label className="label-style">Start Date</label>
                    <input
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="input-style"
                      placeholder="e.g., Feb 2024"
                    />
                  </div>
                  <div>
                    <label className="label-style">End Date</label>
                    <input
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="input-style"
                      placeholder="e.g., May 2024 or Present"
                    />
                  </div>
                  <div>
                    <label className="label-style">Urutan Posisi (Order)</label>
                    <input
                      type="number"
                      required
                      value={expOrder}
                      onChange={(e) => setExpOrder(parseInt(e.target.value) || 0)}
                      className="input-style"
                      placeholder="e.g., 1"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-style">Skills (Comma-separated)</label>
                  <input
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    className="input-style"
                    placeholder="e.g., React, Node.js, PostgreSQL"
                  />
                </div>

                <div>
                  <label className="label-style">Description</label>
                  <textarea
                    required
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                    className="input-style h-28 text-sm"
                    placeholder="Describe your responsibilities and achievements in this role..."
                  />
                </div>

                <div>
                  <label className="label-style">Company Link (Optional)</label>
                  <input
                    value={expLink}
                    onChange={(e) => setExpLink(e.target.value)}
                    className="input-style"
                    placeholder="e.g., https://company.com"
                  />
                </div>

                {/* INPUT GALLERY DOKUMENTASI EXPERIENCE */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition relative">
                  <input
                    id="expFileInput"
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    onChange={handleExpFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                    <UploadCloud size={32} className="text-blue-500" />
                    <span className="font-medium text-sm font-semibold text-gray-700">
                      Upload Galeri Dokumentasi / Sertifikat Magang
                    </span>
                    <span className="text-xs text-gray-400">
                      JPG, PNG, WebP, PDF (Maksimal 2 file dokumentasi)
                    </span>
                    <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2.5 py-0.5 rounded-full mt-1">
                      {expGalleryFiles && expGalleryFiles.length > 0
                        ? `${expGalleryFiles.length} dari 2 file dipilih`
                        : "Pilih berkas (Max 2)..."}
                    </span>
                  </div>
                </div>

                {/* PREVIEW GALLERY DOKUMENTASI */}
                {expPreviewGallery && expPreviewGallery.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="label-style mb-0">Gallery Preview ({expPreviewGallery.length}/2)</label>
                      <button
                        type="button"
                        onClick={() => {
                          setExpGalleryFiles([]);
                          setExpPreviewGallery([]);
                          const expFileInput = document.getElementById("expFileInput");
                          if (expFileInput) expFileInput.value = "";
                        }}
                        className="text-xs text-red-500 hover:text-red-700 font-bold transition duration-200"
                      >
                        Hapus Semua
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border">
                      {expPreviewGallery.map((url, i) => {
                        const isPdf = url.toLowerCase().endsWith('.pdf') || (url.startsWith('blob:') && expGalleryFiles[i]?.type === 'application/pdf');
                        return (
                          <div key={i} className="relative w-full aspect-video bg-white rounded-lg overflow-hidden border shadow-sm group">
                            {isPdf ? (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-500 p-2">
                                <span className="text-[10px] font-bold uppercase">PDF DOCUMENT</span>
                                <span className="text-[9px] text-gray-500 truncate max-w-full px-1">
                                  {expGalleryFiles[i]?.name || 'Certificate'}
                                </span>
                              </div>
                            ) : (
                              <img
                                src={url}
                                alt={`Preview ${i}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <div className="absolute top-1 right-1 bg-black/55 text-white text-[9px] px-1.5 py-0.5 rounded">
                              {i + 1}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg ${isEditingExp
                    ? "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                    }`}
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save size={20} />{" "}
                      {isEditingExp ? "Update Experience" : "Save Experience"}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* LIST EXPERIENCE */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 sm:p-8">
              <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">
                Experiences List ({experiences.length})
              </h3>
              <div className="space-y-4">
                {experiences.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No experiences added yet.</p>
                ) : (
                  experiences.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition bg-gray-50/50 gap-4"
                    >
                      <div className="flex flex-col w-full md:w-auto text-left">
                        <h4 className="font-bold text-gray-800 text-lg">{item.role}</h4>
                        <p className="text-sm font-semibold text-blue-600 mt-0.5">
                          {item.company} {item.location ? `• ${item.location}` : ""}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                          <span>{item.startDate} - {item.endDate}</span>
                          {item.order !== undefined && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded font-bold text-[9px] uppercase tracking-wider">
                              Order: #{item.order}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-2 max-w-[500px] mt-2 whitespace-pre-line">
                          {item.desc}
                        </p>
                        {item.gallery && item.gallery.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {item.gallery.map((gImg, gIdx) => {
                              const isPdf = gImg.toLowerCase().endsWith('.pdf');
                              return (
                                <div key={gIdx} className="w-8 h-8 rounded border overflow-hidden bg-gray-100 flex items-center justify-center">
                                  {isPdf ? (
                                    <div className="w-full h-full bg-red-100 text-red-700 flex items-center justify-center text-[7px] font-bold">PDF</div>
                                  ) : (
                                    <img src={gImg} alt="" className="w-full h-full object-cover" />
                                  )}
                                </div>
                              );
                            })}
                            <span className="text-[10px] text-gray-500 font-bold self-center ml-1">
                              ({item.gallery.length} files)
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4 md:mt-0 w-full md:w-auto justify-end">
                        <button
                          onClick={() => handleEditExp(item)}
                          className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 flex items-center gap-1 text-sm font-medium"
                        >
                          <Edit2 size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteExp(item.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center gap-1 text-sm font-medium"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b pb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Visitor History ({visitors.length})
              </h3>
              {visitors.length > 0 && (
                <button
                  onClick={handleDeleteAllVisitors}
                  disabled={loading}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition flex items-center gap-1.5 text-sm font-semibold disabled:opacity-50 w-full sm:w-auto justify-center"
                >
                  <Trash2 size={16} /> Delete All of History
                </button>
              )}
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {visitors.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Belum ada data pengunjung yang tercatat.
                </p>
              ) : (
                visitors.map((visitor) => (
                  <div
                    key={visitor.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-blue-100 transition bg-gray-50/50 gap-3"
                  >
                    <div className="flex items-center gap-4">
                      {/* Initials Avatar */}
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shadow-inner uppercase shrink-0">
                        {visitor.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-800 text-base">
                            {visitor.name}
                          </h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${visitor.role === 'HR / Recruiter'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-blue-100 text-blue-700'
                            }`}>
                            {visitor.role === 'HR / Recruiter' ? 'HR' : 'Guest'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Interest : <span className="font-semibold text-gray-700">{visitor.target || "Website keseluruhan"}</span>
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          ID: #{visitor.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right text-xs text-gray-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-gray-100 w-full sm:w-auto">
                      {new Date(visitor.createdAt).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      <style>{`.label-style { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem; } .input-style { width: 100%; padding: 0.75rem 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; outline: none; font-size: 1rem; transition: all; } .input-style:focus { border-color: #3b82f6; ring: 2px; ring-color: #bfdbfe; }`}</style>
    </div>
  );
};

export default Dashboard;
