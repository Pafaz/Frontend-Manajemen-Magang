import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Loading";
import Swal from "sweetalert2";

export default function DataUmumPerusahaan() {
  const [formData, setFormData] = useState({
    nama: "",
    telepon: "",
    email: "",
    deskripsi: "",
    provinsi: "",
    kota: "",
    kecamatan: "",
    alamat: "",
    kode_pos: "",
    website: "",
    tanggal_berdiri: "",
    nama_penanggung_jawab: "",
    nomor_penanggung_jawab: "",
    jabatan_penanggung_jawab: "",
    email_penanggung_jawab: "",
  });
  console.log(formData);
  
  
  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((res) => res.json())
      .then(setProvinces)
      .catch(console.error);
  }, []);

  const fetchPrefillData = async () => {
    try {
      const provRes = await fetch(
        "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
      );
      const provData = await provRes.json();
      setProvinces(provData);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/perusahaan/edit`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = res.data.data.perusahaan;
      const allowedJabatan = [
        "Direktur",
        "Manager",
        "Supervisor",
        "Staff",
        "Lainnya",
      ];
      const normalizedJabatan = allowedJabatan.find(
        (j) =>
          j.toLowerCase() ===
          (data.jabatan_penanggung_jawab || "").trim().toLowerCase()
      );

      setFormData({
        nama_penanggung_jawab: data.nama_penanggung_jawab || "",
        nomor_penanggung_jawab: data.nomor_penanggung_jawab || "",
        jabatan_penanggung_jawab: normalizedJabatan || "",
        email_penanggung_jawab: data.email_penanggung_jawab || "",
        nama: data.nama || "",
        tanggal_berdiri: data.tanggal_berdiri || "",
        deskripsi: data.deskripsi || "",
        alamat: data.alamat || "",
        provinsi: data.provinsi || "",
        kota: data.kota || "",
        kecamatan: data.kecamatan || "",
        kode_pos: data.kode_pos || "",
        email: data.email || "",
        telepon: data.telepon || "",
        website: data.website || "",
      });

      const selectedProv = provData.find((p) => p.name === data.provinsi);
      if (selectedProv) {
        setSelectedProvince(selectedProv.name);
        const cityRes = await fetch(
          `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProv.id}.json`
        );
        const cityData = await cityRes.json();
        setCities(cityData);

        const selectedCity = cityData.find((c) => c.name === data.kota);
        if (selectedCity) {
          setSelectedCity(selectedCity.name);
          const districtRes = await fetch(
            `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedCity.id}.json`
          );
          const districtData = await districtRes.json();
          setDistricts(districtData);
        }
      }
    } catch (err) {
      console.error("Gagal memuat data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrefillData();
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleProvinceChange = (e) => {
    const selected = provinces.find((p) => p.name === e.target.value);
    if (!selected) return;

    setSelectedProvince(selected.name);
    setFormData((prev) => ({
      ...prev,
      provinsi: selected.name,
      kota: "",
      kecamatan: "",
    }));

    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selected.id}.json`
    )
      .then((res) => res.json())
      .then(setCities)
      .catch(console.error);

    setDistricts([]);
  };

  const handleCityChange = (e) => {
    const selected = cities.find((c) => c.name === e.target.value);
    if (!selected) return;

    setSelectedCity(selected.name);
    setFormData((prev) => ({
      ...prev,
      kota: selected.name,
      kecamatan: "",
    }));

    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selected.id}.json`
    )
      .then((res) => res.json())
      .then(setDistricts)
      .catch(console.error);
  };

  const handleDistrictChange = (e) => {
    const selected = districts.find((d) => d.name === e.target.value);
    if (!selected) return;

    setFormData((prev) => ({
      ...prev,
      kecamatan: selected.name,
    }));
  };
  const [submitting, setSubmitting] = useState(false); // New state for submission loading


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); // Start loading

    try {
      const dataToSend = {
        ...formData,
        _method: "PUT",
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/perusahaan/update`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setFormData(res)

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data perusahaan berhasil diperbarui',
        confirmButtonText: 'OK'
      });
      fetchPrefillData();
    } catch (err) {
      console.error("Gagal update data:", err);
      
      // Show detailed error in console
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
      } else if (err.request) {
        console.error("Request data:", err.request);
      } else {
        console.error("Error message:", err.message);
      }
      
      // Show error alert
      await Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: err.response?.data?.message || 'Terjadi kesalahan saat memperbarui data',
        confirmButtonText: 'OK'
      });
      
    } finally {
      setSubmitting(false); // End loading
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-8xl mx-auto">
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-4">Data Umum Perusahaan</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Nama Penanggung Jawab", name: "nama_penanggung_jawab" },
            {
              label: "Nomor HP Penanggung Jawab",
              name: "nomor_penanggung_jawab",
            },
            { label: "Email Penanggung Jawab", name: "email_penanggung_jawab" },
          ].map((field) => (
            <div key={field.name} className="w-full">
              <label className="block text-sm font-medium text-black mb-1">
                {field.label}
              </label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.label}
                className="w-full p-2 border border-[#D5DBE7] rounded placeholder-[#667797] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}
          <div className="w-full">
            <label className="block text-sm font-medium text-black mb-1">
              Jabatan Penanggung Jawab
            </label>
            <select
              name="jabatan_penanggung_jawab"
              value={formData.jabatan_penanggung_jawab}
              onChange={handleChange}
              className="w-full p-2 border border-[#D5DBE7] rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Pilih Jabatan</option>
              <option value="Direktur">Direktur</option>
              <option value="Manager">Manager</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Staff">Staff</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Nama Perusahaan", name: "nama" },
            { label: "Tanggal Berdiri", name: "tanggal_berdiri" },
          ].map((field) => (
            <div key={field.name} className="w-full">
              <label className="block text-sm font-medium text-black mb-1">
                {field.label}
              </label>
              <input
                type={field.name === "tanggal_berdiri" ? "date" : "text"}
                name={field.name}
                value={
                  field.name === "tanggal_berdiri"
                    ? formData[field.name]?.split("T")[0] || ""
                    : formData[field.name]
                }
                onChange={handleChange}
                placeholder={field.label}
                className="w-full p-2 border border-[#D5DBE7] rounded placeholder-[#667797] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-1">
            Deskripsi Perusahaan
          </label>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            placeholder="Tuliskan deskripsi perusahaan"
            rows={4}
            className="w-full p-2 border border-[#D5DBE7] rounded placeholder-[#667797] focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          />
        </div>

        <h2 className="text-lg font-bold mb-4">Kontak Perusahaan</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Provinsi
            </label>
            <select
              name="provinsi"
              value={formData.provinsi}
              onChange={handleProvinceChange}
              className="w-full p-2 border border-[#D5DBE7] rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Pilih Provinsi</option>
              {provinces.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Kabupaten/Kota
            </label>
            <select
              name="kota"
              value={formData.kota}
              onChange={handleCityChange}
              disabled={!formData.provinsi}
              className="w-full p-2 border border-[#D5DBE7] rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Pilih Kota</option>
              {cities.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Kecamatan
            </label>
            <select
              name="kecamatan"
              value={formData.kecamatan}
              onChange={handleDistrictChange}
              disabled={!formData.kota}
              className="w-full p-2 border border-[#D5DBE7] rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Pilih Kecamatan</option>
              {districts.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Kode Pos
            </label>
            <input
              type="text"
              name="kode_pos"
              value={formData.kode_pos}
              onChange={handleChange}
              placeholder="Kode Pos"
              className="w-full p-2 border border-[#D5DBE7] rounded placeholder-[#667797] focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Email Perusahaan", name: "email" },
            { label: "Telepon Perusahaan", name: "telepon" },
            { label: "Website Perusahaan", name: "website" },
          ].map((field) => (
            <div key={field.name} className="w-full">
              <label className="block text-sm font-medium text-black mb-1">
                {field.label}
              </label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.label}
                className="w-full p-2 border border-[#D5DBE7] rounded placeholder-[#667797] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-sky-500 text-white font-bold py-2 px-6 rounded hover:bg-sky-700 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </>
            ) : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}
