import React, { useState } from "react";
import { CalendarDays, Download, Search, UserPlus, Database, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";

export default function RFIDTable() {
  const [activeTab, setActiveTab] = useState("dataSiswa");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [rfidValue, setRfidValue] = useState("");
  const [studentName, setStudentName] = useState("");

  // Complete data of all students
  const dataSiswa = [
    {
      id: 1,
      nama: "Arya Pratama",
      email: "arya.pratama@gmail.com",
      masaMagang: "15 Februari - 15 Mei 2025",
      sekolah: "SMK NEGERI 5 SURABAYA",
      rfidTag: "RF2025001",
      image: "/assets/img/post1.png",
    },
    {
      id: 2,
      nama: "Budi Santoso",
      email: "budi.santoso@gmail.com",
      masaMagang: "1 Maret - 30 Mei 2025",
      sekolah: "SMK NEGERI 7 MALANG",
      rfidTag: "RF2025002",
      image: "/assets/img/post1.png",
    },
    {
      id: 3,
      nama: "Cynthia Riana",
      email: "cynthia.riana@gmail.com",
      masaMagang: "20 Februari - 20 Mei 2025",
      sekolah: "SMK NEGERI 4 JEMBER",
      rfidTag: "RF2025003",
      image: "/assets/img/post1.png",
    },
    {
      id: 4,
      nama: "Dewi Anggraini",
      email: "dewi.anggraini@gmail.com",
      masaMagang: "10 April - 10 Juli 2025",
      sekolah: "SMK NEGERI 1 MALANG",
      rfidTag: "",  // No RFID assigned yet
      image: "/assets/img/post1.png",
    },
    {
      id: 5,
      nama: "Rizki Ananda",
      email: "rizki.ananda@gmail.com",
      masaMagang: "8 April - 8 Juli 2025",
      sekolah: "SMK NEGERI 2 BLITAR",
      rfidTag: "",  // No RFID assigned yet
      image: "/assets/img/post1.png",
    },
    {
      id: 6,
      nama: "Siti Nurhayati",
      email: "siti.nurhayati@gmail.com",
      masaMagang: "3 Mei - 3 Agustus 2025",
      sekolah: "SMK NEGERI 3 SURABAYA",
      rfidTag: "",  // No RFID assigned yet
      image: "/assets/img/post1.png",
    },
    {
      id: 7,
      nama: "Ahmad Fauzi",
      email: "ahmad.fauzi@gmail.com",
      masaMagang: "1 Mei - 1 Agustus 2025",
      sekolah: "SMK NEGERI 6 MALANG",
      rfidTag: "RF2025006",
      image: "/assets/img/post1.png",
    },
  ];

  // Filter data based on active tab (with or without RFID)
  const getFilteredData = () => {
    let filteredByTab = activeTab === "dataSiswa" 
      ? dataSiswa.filter(student => student.rfidTag) // Students with RFID
      : dataSiswa.filter(student => !student.rfidTag); // Students without RFID
    
    // Additional search term and date filtering
    return filteredByTab.filter((item) => {
      // Filter based on search term
      const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sekolah.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.rfidTag && item.rfidTag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter based on selected date if applicable
      if (selectedDate) {
        const magangDate = new Date(item.masaMagang.split(" - ")[0]);
        const selectedMonth = selectedDate.getMonth();
        const selectedYear = selectedDate.getFullYear();
        return matchesSearch && 
          magangDate.getMonth() === selectedMonth && 
          magangDate.getFullYear() === selectedYear;
      }
      
      return matchesSearch;
    });
  };

  const filteredData = getFilteredData();

  const CustomButton = React.forwardRef(({ value, onClick }, ref) => (
    <button 
      className="flex items-center gap-2 bg-white border-gray-200 text-[#344054] py-2 px-4 rounded-md shadow border border-[#667797] hover:bg-[#0069AB] hover:text-white text-sm" 
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

  const handleRFIDAction = (id, action) => {
    const student = dataSiswa.find(s => s.id === id);
    setSelectedStudent(student);
    setStudentName(student.nama);
    
    if (action === "Ubah") {
      setRfidValue(student.rfidTag);
      setShowUpdateModal(true);
    } else {
      setRfidValue("");
      setShowRegisterModal(true);
    }
  };

  const handleSave = () => {
    // Here you would typically update your data in a real application
    console.log(`Saved RFID ${rfidValue} for student: ${studentName}`);
    
    // Close modals
    setShowRegisterModal(false);
    setShowUpdateModal(false);
  };

  // Register RFID Modal
  const RegisterModal = () => (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
      <div className="bg-pink p-4 rounded-lg w-full max-w-md">
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-6">Tambahkan RFID Siswa</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nama Siswa</label>
            <input
              type="text"
              value={studentName}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Gojo satoru"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">RFID Siswa</label>
            <input
              type="text"
              value={rfidValue}
              onChange={(e) => setRfidValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="123456789"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setShowRegisterModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
            >
              Batal
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Update RFID Modal
  const UpdateModal = () => (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
      <div className="bg-white p-4 rounded-lg w-full max-w-md">
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-6">Ganti RFID Siswa</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nama Siswa</label>
            <input
              type="text"
              value={studentName}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Gojo satoru"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">RFID Siswa</label>
            <input
              type="text"
              value={rfidValue}
              onChange={(e) => setRfidValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="123456789"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setShowUpdateModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
            >
              Batal
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-[#1D2939]">Pendataan RFID</h2>
              <p className="text-[#667085] text-sm mt-1">Kelola data RFID siswa magang dengan maksimal!</p>
            </div>

            <div className="flex items-center gap-3">
              <DatePicker 
                selected={selectedDate} 
                onChange={(date) => setSelectedDate(date)} 
                customInput={<CustomButton />} 
                dateFormat="dd MMMM yyyy" 
                showPopperArrow={false} 
              />
              <CSVLink
                data={filteredData}
                filename={`data_siswa_${activeTab === "dataSiswa" ? "dengan_rfid" : "belum_rfid"}.csv`}
                headers={[ 
                  { label: "No", key: "id" },
                  { label: "Nama Lengkap", key: "nama" },
                  { label: "Email", key: "email" },
                  { label: "Masa Magang", key: "masaMagang" },
                  { label: "Sekolah", key: "sekolah" },
                ]}
              >
                <button className="flex items-center gap-2 border border-gray-300 text-[#344054] px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-[#0069AB] hover:text-white">
                  <Download size={16} />
                  Export
                </button>
              </CSVLink>
            </div>
          </div>

          <div className="border-b border-gray-200 my-5" />

          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex gap-2">
              <button 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border ${activeTab === "dataSiswa" ? "bg-[#0069AB] text-white" : "border-gray-300 text-[#344054]"}`} 
                onClick={() => setActiveTab("dataSiswa")}
              >
                <Database size={16} />
                Data Siswa
              </button>
              <button 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border ${activeTab === "daftarkanRFID" ? "bg-[#0069AB] text-white" : "border-gray-300 text-[#344054]"}`} 
                onClick={() => setActiveTab("daftarkanRFID")}
              >
                <UserPlus size={16} />
                Daftarkan RFID
              </button>
            </div>

            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Search size={16} />
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white-50 border-t border-[#D5DBE7]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#1D2939] border-b border-[#D5DBE7]">No</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#1D2939] border-b border-[#D5DBE7]">Nama Lengkap</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#1D2939] border-b border-[#D5DBE7]">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#1D2939] border-b border-[#D5DBE7]">Masa Magang</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#1D2939] border-b border-[#D5DBE7]">Sekolah</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-[#1D2939] border-b border-[#D5DBE7]">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-sm">{index + 1}</td>
                    <td className="px-6 py-4 flex items-center gap-3 text-sm">
                      <img src={item.image} alt={item.nama} className="w-10 h-10 rounded-full" />
                      {item.nama}
                    </td>
                    <td className="px-6 py-4 text-sm">{item.email}</td>
                    <td className="px-6 py-4 text-sm">{item.masaMagang}</td>
                    <td className="px-6 py-4 text-sm">{item.sekolah}</td>
                    <td className="px-6 py-4 text-center">
                      {activeTab === "dataSiswa" && item.rfidTag && (
                        <button 
                          className="text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => handleRFIDAction(item.id, "Ubah")}
                        >
                          Ubah RFID
                        </button>
                      )}
                      {activeTab === "daftarkanRFID" && !item.rfidTag && (
                        <button 
                          className="text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => handleRFIDAction(item.id, "Daftarkan")}
                        >
                          Daftarkan RFID
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm">Tidak ada data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register RFID Modal */}
      {showRegisterModal && <RegisterModal />}
      
      {/* Update RFID Modal */}
      {showUpdateModal && <UpdateModal />}
    </div>
  );
}