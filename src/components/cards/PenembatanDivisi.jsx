import React from "react";

export default function PenempatanDivisi({ data, searchTerm, selectedDate }) {
  const filteredData = data.filter((item) => {
    const isMatchSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jurusan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.masaMagang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sekolah.toLowerCase().includes(searchTerm.toLowerCase());

    const isMatchDate = selectedDate
      ? new Date(item.masaMagang).toLocaleDateString() ===
        selectedDate.toLocaleDateString()
      : true;

    return isMatchSearch && isMatchDate;
  });

  const handleView = (item) => {
    console.log("Lihat detail:", item);
    // Navigasi ke halaman detail kalau kamu pakai react-router-dom:
    // navigate(`/detail/${item.id}`);
  };

  const handlePrint = (item) => {
    console.log("Cetak surat untuk:", item);
    // Atau jalankan fungsi cetak di sini
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead className="bg-[#F9FAFB] text-[#667085] border-t border-gray-200">
          <tr>
            <th className="px-3 py-3 text-center font-medium">No</th>
            <th className="px-3 py-3 text-center font-medium">No Foto</th>
            <th className="px-3 py-3 text-center font-medium">Nama Lengkap</th>
            <th className="px-3 py-3 text-center font-medium">Sekolah</th>
            <th className="px-3 py-3 text-center font-medium">Tanggal Mulai</th>
            <th className="px-3 py-3 text-center font-medium">Tanggal Selesai</th>
            <th className="px-3 py-3 text-center font-medium">Email</th>
            <th className="px-3 py-3 text-center font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr
              key={item.id}
              className="border-t border-gray-200 hover:bg-gray-50 text-center"
            >
              <td className="px-3 py-3">{index + 1}</td>
              <td className="px-3 py-3">
                {/* No Foto, jika tidak ada foto tampilkan icon atau placeholder */}
                <span className="text-xs">No Foto</span>
              </td>
              <td className="px-3 py-3">{item.nama}</td>
              <td className="px-3 py-3">{item.sekolah}</td>
              <td className="px-3 py-3">{item.tanggalMulai}</td>
              <td className="px-3 py-3">{item.tanggalSelesai}</td>
              <td className="px-3 py-3">{item.email}</td>
              <td className="px-3 py-3 flex justify-center gap-3">
                {/* Aksi */}
                <button onClick={() => handleView(item)} title="Lihat">
                  <i className="bi bi-eye" style={{ color: 'orange', fontSize: '1.5rem' }}></i>
                </button>
                <button onClick={() => handlePrint(item)} title="Print">
                  <i className="bi bi-printer" style={{ color: '#007bff', fontSize: '1.5rem' }}></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
