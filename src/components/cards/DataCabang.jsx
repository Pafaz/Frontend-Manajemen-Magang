import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Loading";

export default function CabangPerusahaan() {
  const [formData, setFormData] = useState({
    nama: "",
    bidang_usaha: "",
    provinsi: "",
    kota: "",
    logo: "",
    profil_cover: "",
  });
  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  console.log(formData.bidang_usaha);
  
  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((res) => res.json())
      .then(setProvinces)
      .catch((error) => {
        console.error("Error fetching provinces:", error);
        setMessage({ text: "Gagal memuat data provinsi", type: "error" });
      });
  }, []);

  const fetchPrefillData = async () => {
    try {
      const provRes = await fetch(
        "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
      );
      const provData = await provRes.json();
      setProvinces(provData);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/cabang-detail`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = Array.isArray(res.data.data)
        ? res.data.data[0]
        : res.data.data;

      setFormData({
        nama: data.nama || "",
        bidang_usaha: data.bidang_usaha || "",
        provinsi: data.provinsi || "",
        kota: data.kota || "",
        logo: data.foto?.find((f) => f.type === "logo")?.path || "",
        profil_cover:
          data.foto?.find((f) => f.type === "profil_cover")?.path || "",
      });

      const selectedProv = provData.find((p) => p.name === data.provinsi);
      if (selectedProv) {
        setSelectedProvince(selectedProv.name);
        const cityRes = await fetch(
          `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProv.id}.json`
        );
        const cityData = await cityRes.json();
        setCities(cityData);
      }
    } catch (err) {
      console.error("Gagal memuat data:", err);
      setMessage({
        text: "Gagal memuat data cabang perusahaan",
        type: "error",
      });
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
    }));

    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selected.id}.json`
    )
      .then((res) => res.json())
      .then(setCities)
      .catch((error) => {
        console.error("Error fetching cities:", error);
        setMessage({ text: "Gagal memuat data kota", type: "error" });
      });
  };

  const handleCityChange = (e) => {
    const selected = cities.find((c) => c.name === e.target.value);
    if (!selected) return;

    setFormData((prev) => ({
      ...prev,
      kota: selected.name,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        nama: formData.nama,
        bidang_usaha: formData.bidang_usaha,
        provinsi: formData.provinsi,
        kota: formData.kota,
        // logo: formData.logo,
        // profil_cover: formData.profil_cover,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/cabang-update`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setMessage({ text: "Data berhasil disimpan", type: "success" });
        fetchPrefillData();
      }
    } catch (err) {
      console.error("Gagal update data:", err);
      setMessage({
        text: err.response?.data?.message || "Gagal menyimpan data cabang",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-8xl mx-auto">
      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Data Cabang</h2>
        <div className="mb-6 flex flex-col md:flex-row md:space-x-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-black mb-1">
              Nama Cabang
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Nama Cabang Perusahaan"
              className="w-full p-2 border border-[#D5DBE7] rounded placeholder-[#667797] focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-black mb-1">
              Bidang Usaha
            </label>
            <select
              name="bidang_usaha"
              value={formData.bidang_usaha}
              onChange={handleChange}
              className="w-full p-2 border border-[#D5DBE7] rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="">{formData.bidang_usaha}</option>
              <option value="teknologi">Teknologi</option>
              <option value="kesehatan">Kesehatan</option>
              <option value="pendidikan">Pendidikan</option>
              <option value="perdagangan">Perdagangan</option>
              <option value="keuangan">Keuangan</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row md:space-x-4">
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <label className="block text-sm font-medium text-black mb-1">
              Provinsi
            </label>
            <select
              name="provinsi"
              value={formData.provinsi}
              onChange={handleProvinceChange}
              className="w-full p-2 border border-[#D5DBE7] rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Provinsi</option>
              {provinces.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium text-black mb-1">
              Kabupaten/Kota
            </label>
            <select
              name="kota"
              value={formData.kota}
              onChange={handleCityChange}
              disabled={!formData.provinsi}
              className="w-full p-2 border border-[#D5DBE7] rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Kota</option>
              {cities.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-sky-500 text-white font-bold py-2 px-6 rounded hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
