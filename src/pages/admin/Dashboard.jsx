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

  // --- AMBIL URL API DARI ENVIRONMENT VARIABLE ---
  // Jika .env tidak terbaca, fallback ke localhost (untuk safety dev)
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const key = sessionStorage.getItem("adminKey");
    if (!key) navigate("/admin/login");
    else {
      fetchProjects();
      fetchExperiences();
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

  const handleExpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const adminKey = sessionStorage.getItem("adminKey");
    const skillsArray = skillsInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    const payload = {
      role,
      company,
      location: location || null,
      startDate,
      endDate,
      desc: expDesc,
      skills: skillsArray,
      link: expLink || null,
      adminKey,
    };

    try {
      let url = `${API_URL}/api/experiences`;
      let method = "POST";

      if (isEditingExp) {
        url = `${API_URL}/api/experiences/${editExpId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminKey");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
          <div className="flex gap-2">
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
        <div className="flex bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 gap-2">
          <button
            onClick={() => {
              setActiveTab("projects");
              resetForm();
              resetExpForm();
            }}
            className={`flex-1 py-3 text-center font-bold rounded-lg transition-all duration-200 ${
              activeTab === "projects"
                ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            Manage Projects
          </button>
          <button
            onClick={() => {
              setActiveTab("experiences");
              resetForm();
              resetExpForm();
            }}
            className={`flex-1 py-3 text-center font-bold rounded-lg transition-all duration-200 ${
              activeTab === "experiences"
                ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            Manage Experiences
          </button>
        </div>

        {activeTab === "projects" ? (
          <>
            {/* FORM INPUT PROJECT */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 w-1.5 h-full ${
                  isEditing ? "bg-yellow-500" : "bg-blue-600"
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
                  className={`w-full text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg ${
                    isEditing
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
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
              <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">
                Daftar Project ({projects.length})
              </h3>
              <div className="space-y-4">
                {projects.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition bg-gray-50/50"
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
        ) : (
          <>
            {/* FORM INPUT EXPERIENCE */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 w-1.5 h-full ${
                  isEditingExp ? "bg-yellow-500" : "bg-blue-600"
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

                <div className="grid md:grid-cols-3 gap-5">
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

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg ${
                    isEditingExp
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
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
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
                      className="flex flex-col md:flex-row items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition bg-gray-50/50"
                    >
                      <div className="flex flex-col w-full md:w-auto text-left">
                        <h4 className="font-bold text-gray-800 text-lg">{item.role}</h4>
                        <p className="text-sm font-semibold text-blue-600 mt-0.5">
                          {item.company} {item.location ? `• ${item.location}` : ""}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.startDate} - {item.endDate}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-2 max-w-[500px] mt-2 whitespace-pre-line">
                          {item.desc}
                        </p>
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
        )}
      </div>
      <style>{`.label-style { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem; } .input-style { width: 100%; padding: 0.75rem 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; outline: none; transition: all; } .input-style:focus { border-color: #3b82f6; ring: 2px; ring-color: #bfdbfe; }`}</style>
    </div>
  );
};

export default Dashboard;
