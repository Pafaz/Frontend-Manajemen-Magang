import React, { useState, useEffect } from "react";
import axios from "axios";
import { CalendarDays, Download, Search, Filter } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
import Jurnal from "./Jurnal";
import Swal from "sweetalert2";

export default function Pendataan() {
  const [searchSchool, setSearchSchool] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [dataJurnal, setDataJurnal] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchJurnal = async () => {
      try {
        Swal.fire({
          title: 'Memuat data...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/jurnal-peserta-cabang`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const pesertaList = response.data.data || [];
        console.log(pesertaList);

        const formatted = pesertaList.flatMap((peserta) =>
          peserta.jurnal.map((jurnal) => ({
            id: jurnal.id,
            nama: peserta.nama || "-",
            judul: jurnal.judul || "-", 
            sekolah: peserta.sekolah || "-",
            tanggal: jurnal.tanggal,
            deskripsi: jurnal.deskripsi || "-",
            status:
              jurnal.deskripsi && jurnal.deskripsi !== "kosong"
                ? "Mengisi"
                : "Tidak Mengisi",
            image:
              peserta.profil?.find((p) => p.type === "profile")?.path || "",
            buktiJurnal: jurnal.bukti?.path || "", 
          }))
        );

        setDataJurnal(formatted);
        setFilteredData(formatted);

        Swal.close();
      } catch (error) {
        console.error("Gagal mengambil data jurnal:", error);
      }
    };

    fetchJurnal();
  }, []);

  useEffect(() => {
    const filtered = dataJurnal.filter((item) => {
      const schoolMatch = item.sekolah
        .toLowerCase()
        .includes(searchSchool.toLowerCase());
      const statusMatch = statusFilter === "" || item.status === statusFilter;

      let dateMatch = true;
      if (selectedDate) {
        const itemDate = new Date(item.tanggal);
        const filterDate = new Date(selectedDate);
        dateMatch = itemDate.toDateString() === filterDate.toDateString();
      }

      return schoolMatch && statusMatch && dateMatch;
    });

    setFilteredData(filtered);
  }, [searchSchool, selectedDate, statusFilter, dataJurnal]);

  const CustomButton = React.forwardRef(({ value, onClick }, ref) => (
    <button
      className="flex items-center gap-2 bg-white border-gray-200 text-[#344054] py-2 px-4 rounded-md shadow border hover:bg-[#0069AB] hover:text-white text-sm"
      onClick={onClick}
      ref={ref}
      type="button"
    >
      <CalendarDays size={16} />
      {value
        ? new Date(value).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Pilih Tanggal"}
    </button>
  ));

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-[#1D2939]">
                Jurnal Peserta
              </h2>
              <p className="text-[#667085] text-sm mt-1">
                Kelola jurnal peserta magang dengan lebih fleksibel!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                customInput={<CustomButton />}
                dateFormat="dd MMMM yyyy"
                showPopperArrow={false}
                isClearable={true}
              />
              <CSVLink
                data={filteredData}
                filename="data_jurnal.csv"
                headers={[
                  { label: "Nama", key: "nama" },
                  { label: "Sekolah", key: "sekolah" },
                  { label: "Tanggal", key: "tanggal" },
                  { label: "Deskripsi", key: "deskripsi" },
                  { label: "Status Jurnal", key: "status" },
                ]}
              >
                <button className="flex items-center gap-2 border border-gray-300 text-[#344054] px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-[#0069AB] hover:text-white">
                  <Download size={16} />
                  Export
                </button>
              </CSVLink>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 border ${
                  showFilters
                    ? "bg-[#0069AB] text-white"
                    : "border-gray-300 text-[#344054]"
                } px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-[#0069AB] hover:text-white`}
              >
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          <div className="border-b border-gray-200 my-5" />

          {showFilters && (
            <div className="flex justify-end items-center gap-3 mt-2 animate-fadeIn">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari Sekolah..."
                  className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm"
                  value={searchSchool}
                  onChange={(e) => setSearchSchool(e.target.value)}
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Search size={16} />
                </span>
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg shadow-sm text-sm px-4 py-2 text-gray-700"
                >
                  <option value="">Semua Status</option>
                  <option value="Mengisi">Mengisi</option>
                  <option value="Tidak Mengisi">Tidak Mengisi</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <Jurnal data={filteredData} />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
