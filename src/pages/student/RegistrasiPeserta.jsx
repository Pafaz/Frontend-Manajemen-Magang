import axios from "axios";
import { useContext, useState } from "react";
import SuccessModal from "../../components/modal/ModalRegis"; // Import the success modal component
import { useNavigate } from "react-router-dom";
import { StatusContext } from "./StatusContext";
import Swal from "sweetalert2";

export default function StudentRegistrationForm() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    jenis_kelamin: "",
    tempat_lahir: "",
    telepon: "",
    tanggal_lahir: "",
    sekolah: "",
    nomor_identitas: "",
    jurusan: "",
    kelas: "",

    // Files
    profile: null,
    cv: null,
    cvFileName: "",
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate()
  
  const handleModalClose = () => {
    setShowSuccessModal(false);
    setFormData({
      nama: "",
      alamat: "",
      jenis_kelamin: "",
      tempat_lahir: "",
      telepon: "",
      tanggal_lahir: "",
      sekolah: "",
      nomor_identitas: "",
      jurusan: "",
      kelas: "",
      profile: null,
      cv: null,
      cvFileName: "",
    });
    setPreviewUrl("");
    navigate("/lowongan")
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        cv: file,
        cvFileName: file.name,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, foto: file }));
      // Buat URL preview untuk gambar
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const { refreshUserData } = useContext(StatusContext);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("nama", formData.nama);
    formDataToSend.append("alamat", formData.alamat);
    formDataToSend.append("jenis_kelamin", formData.jenis_kelamin);
    formDataToSend.append("tempat_lahir", formData.tempat_lahir);
    formDataToSend.append("tanggal_lahir", formData.tanggal_lahir);
    formDataToSend.append("telepon", formData.no_hp);
    formDataToSend.append("nomor_identitas", formData.nisn);
    formDataToSend.append("sekolah", formData.sekolah);
    formDataToSend.append("jurusan",formData.jurusan);

    if (formData.cv) {
      formDataToSend.append("cv", formData.cv);
    }

    if (formData.foto) {
      formDataToSend.append("profile", formData.foto);
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/peserta`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await refreshUserData();
      // Handle success
      console.log("Form submitted successfully:", response.data);
      setShowSuccessModal(true); // Menampilkan modal sukses setelah berhasil
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error submitting form:", error);
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error submitting the form',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      }
    }
  };


  // Default avatar image (base64 encoded or URL)
  const defaultAvatar =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2NjY2NjYyIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTBIOGE0IDQgMCAwIDAtNCA0djIiPjwvcGF0aD48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjwvc3ZnPg==";
  return (
    <div className="max-w-6xl mx-auto bg-white p-5 rounded-lg">
      <div className="border-b border-gray-200 py-4 px-2 mb-4">
        <h1 className="text-xl font-bold text-gray-800">Data Diri</h1>
        <p className="text-sm text-gray-500">
          Silahkan Lengkapi Data diri anda
        </p>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 space-y-4 px-2">
          {/* Nama */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <input
              type="text"
              name="nama"
              placeholder="Nama"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.nama}
              onChange={handleChange}
              required
            />
          </div>

          {/* Alamat */}

          {/* Two Column Layout for Gender and Phone */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Jenis Kelamin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kelamin
              </label>
              <div className="relative">
                <select
                  name="jenis_kelamin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
                  value={formData.jenis_kelamin}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* No HP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. Hp
              </label>
              <input
                type="tel"
                name="no_hp"
                placeholder="No. Hp"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.no_hp}
                onChange={handleChange}
                required
                maxLength={13}
              />
            </div>
          </div>

          {/* Tempat Lahir and Tanggal Lahir */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Tempat Lahir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempat Lahir
              </label>
              <div className="relative">
              <input
                  type="text"
                  name="tempat_lahir"
                  placeholder="ex: Kota Malang"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.tempat_lahir}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Tanggal Lahir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Lahir
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="tanggal_lahir"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.tanggal_lahir}
                  onChange={handleChange}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* School and Jurusan in one row */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            {/* Sekolah/Universitas - 6 columns */}
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sekolah/Universitas
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Masukkan nama sekolah/universitas"
                value={formData.sekolah || ""}
                onChange={(e) =>
                  setFormData({ ...formData, sekolah: e.target.value })
                }
              />
            </div>

            {/* Jurusan - 6 columns */}
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jurusan
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Masukkan jurusan"
                value={formData.jurusan || ""}
                onChange={(e) =>
                  setFormData({ ...formData, jurusan: e.target.value })
                }
              />
            </div>
          </div>

          {/* Jurusan and Kelas */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            {/* Jurusan */}
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NISN/NIM
              </label>
              <input
                type="text"
                name="nisn"
                placeholder="NISN/NIM"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.nisn}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            <textarea
              name="alamat"
              placeholder="Masukkan Alamat"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.alamat}
              onChange={handleChange}
              required
              rows={3}
            />
          </div>
        </div>

        <div className="hidden lg:block border-l border-gray-300 mx-4"></div>

        <div className="w-full lg:w-1/2 px-2 relative">
          {/* Upload Foto Area */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Masukkan Foto Diri Disini
            </label>

            <div className="flex flex-row items-center space-x-4">
              {/* Avatar Preview */}
              <div className="w-20 h-20 flex-shrink-0 rounded-full bg-gray-100 border border-gray-300 overflow-hidden flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={defaultAvatar}
                    alt="Default Avatar"
                    className="w-12 h-12 object-cover"
                  />
                )}
              </div>

              {/* Upload Area */}
              <div className="flex-grow bg-blue-50 border border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center text-center p-6 relative">
                <div className="text-blue-500 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  SVG, PNG, JPEG OR GIF (max 1080x1200px)
                </p>
                <input
                  type="file"
                  name="foto"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handlePhotoUpload}
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          {/* Upload CV Area */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Masukkan CV Disini
            </label>

            <div className="flex flex-row items-center space-x-4">
              {/* Icon atau Placeholder CV */}
              <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center border border-gray-300 bg-gray-100 rounded-full text-gray-500 text-xs">
                {formData.cvFileName ? (
                  <span className="text-center px-2">
                    {formData.cvFileName}
                  </span>
                ) : (
                  <span>CV</span>
                )}
              </div>

              {/* Upload Area */}
              <div className="flex-grow bg-blue-50 border border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center text-center p-6 relative">
                <div className="text-blue-500 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, DOCX (max 2MB)
                </p>
                <input
                  type="file"
                  name="cv"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="absolute bottom-0 right-0 px-2 pb-6 pt-4">
            <button
              onClick={handleSubmit}
              className="py-2 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <SuccessModal isOpen={showSuccessModal} onClose={handleModalClose} />
      )}
    </div>
  );
}
