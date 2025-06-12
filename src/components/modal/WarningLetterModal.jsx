import axios from "axios";
import { CalendarDays, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const WarningLetterModal = ({ isOpen, onClose, onSucces }) => {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [dataPeserta, setDataPeserta] = useState([]);
  const [studentSchool, setStudentSchool] = useState("");
  const [spLevel, setSpLevel] = useState("SP 1");
  const [letterDate, setLetterDate] = useState(new Date());
  const [reason, setReason] = useState("");
  const [nomorSurat, setNomorSurat] = useState("");

  useEffect(() => {
    const getDataPesertaByCabang = async () => {
      const pesertaResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/peserta-by-cabang`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (pesertaResponse.data.status === "success") {
        const pesertaData = pesertaResponse.data.data;
        setDataPeserta(pesertaData);
      } else {
        console.error("Unexpected response:", pesertaResponse.data);
      }
    };
    getDataPesertaByCabang();
  }, []);

  const handleStudentChange = (e) => {
    const selectedId = e.target.value;
    setSelectedStudent(selectedId);

    const student = dataPeserta.find((s) => s.id === selectedId);
    setStudentSchool(student?.sekolah || "");
  };

  const handleSubmit = async () => {
    const payload = {
      id_peserta: selectedStudent,
      keterangan_surat: spLevel.replace(" ", ""),
      alasan: reason,
      nomor_surat: nomorSurat
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/surat`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status === "success") {
        onSucces();
        onClose();
      } else {
        console.error("Gagal kirim:", response.data);
      }
    } catch (error) {
      console.error("Error kirim surat:", error);
    }

    // Reset form
    setSelectedStudent("");
    setStudentSchool("");
    setSpLevel("SP 1");
    setLetterDate(new Date());
    setReason("");
    setNomorSurat("");
  };

  const CustomDateButton = React.forwardRef(({ value, onClick }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className="flex items-center gap-2 bg-white border border-gray-300 text-[#344054] py-2 px-3 rounded-md hover:bg-gray-50 text-sm w-full"
    >
      <CalendarDays size={16} />
      {value || "Pilih tanggal"}
    </button>
  ));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#1D2939]">
            Buat Surat Peringatan
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <select
              value={selectedStudent}
              onChange={handleStudentChange}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="">Pilih Siswa</option>
              {dataPeserta.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sekolah
            </label>
            <input
              type="text"
              value={studentSchool}
              readOnly
              className="w-full border border-gray-300 rounded-md p-2 text-sm bg-gray-50"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Surat
            </label>
            <input
              type="text"
              value={nomorSurat}
              onChange={(e) => setNomorSurat(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              placeholder="Masukkan nomor surat..."
            />
          </div>

          <div className="flex gap-4 mb-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tingkat SP
              </label>
              <select
                value={spLevel}
                onChange={(e) => setSpLevel(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              >
                <option value="SP 1">SP 1</option>
                <option value="SP 2">SP 2</option>
                <option value="SP 3">SP 3</option>
              </select>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal
              </label>
              <DatePicker
                selected={letterDate}
                onChange={(date) => setLetterDate(date)}
                customInput={<CustomDateButton />}
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alasan
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm min-h-24"
              placeholder="Masukkan alasan peringatan..."
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="mr-2 px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm bg-[#0069AB] text-white rounded-lg hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningLetterModal;