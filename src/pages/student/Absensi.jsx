import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import Card from "../../components/cards/Card";
import CardAbsensi from "../../components/cards/CardAbsensi";
import TableAbsensi from "../../components/cards/TableAbsensi";
import IzinModal from "../../components/ui/IzinModal";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

// Optional: Keep the custom success modal or use SweetAlert for both success and error
const SuccessModal = ({ isOpen, onClose, message }) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
      <div className="bg-white rounded-lg p-6 w-80 max-w-md shadow-xl transform transition-all">
        <div className="text-center">
          {/* Success icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg 
              className="h-6 w-6 text-green-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          
          {/* Message */}
          <h3 className="mt-4 text-lg font-medium text-gray-900">Berhasil!</h3>
          <p className="mt-2 text-sm text-gray-500">
            {message || "Absensi berhasil dicatat."}
          </p>
          
          {/* Close button */}
          <div className="mt-5">
            <Button 
              onClick={onClose}
              className="w-full"
            >
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Absensi = () => {
  const [isIzinModalOpen, setIsIzinModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [tableKey, setTableKey] = useState(0); // Key to force table refresh

  // Function to show error with SweetAlert
  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });
  };

  // Optional: Convert success notification to SweetAlert as well
  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: message,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });
  };

  const handleAbsen = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/kehadiran`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle successful response
      if (response.status >= 200 && response.status < 300) {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const successMsg = response.data?.message || `Absensi berhasil dicatat pada pukul ${currentTime}`;

        setSuccessMessage(successMsg);
        setIsSuccessModalOpen(true);

        setTableKey(prevKey => prevKey + 1); // Refresh the table
      }
    } catch (error) {
      console.error("Error during absensi:", error);

      let errorMsg = "Terjadi kesalahan saat melakukan absensi.";

      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMsg = error.response.data?.message || "Sesi login telah berakhir. Silakan login kembali.";
            break;
          case 403:
            errorMsg = error.response.data?.message || "Anda tidak memiliki izin untuk melakukan absensi.";
            break;
          case 422:
            errorMsg = error.response.data?.message || "Data absensi tidak valid.";
            break;
          case 429:
            errorMsg = "Anda telah mencoba terlalu banyak. Silakan coba lagi nanti.";
            break;
          default:
            errorMsg = error.response.data?.message || errorMsg;
        }
      } else if (error.request) {
        errorMsg = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      }

      showErrorAlert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setPdfLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/kehadiran/export-pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', // Important for downloading files
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const filename = `absensi-${currentDate}.pdf`;
      link.setAttribute('download', filename);

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      showSuccessAlert('Data absensi berhasil diunduh dalam format PDF!');
    } catch (error) {
      console.error("Error downloading PDF:", error);

      let errorMsg = "Terjadi kesalahan saat mengunduh PDF.";

      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMsg = "Sesi login telah berakhir. Silakan login kembali.";
            break;
          case 403:
            errorMsg = "Anda tidak memiliki izin untuk mengunduh data absensi.";
            break;
          case 404:
            errorMsg = "Data absensi tidak ditemukan.";
            break;
          case 500:
            errorMsg = "Terjadi kesalahan server saat membuat PDF.";
            break;
          default:
            errorMsg = error.response.data?.message || errorMsg;
        }
      } else if (error.request) {
        errorMsg = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      }

      showErrorAlert(errorMsg);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <section className="w-full">
      <div className=" px-10">
        <div className="flex justify-start gap-2">
          <Button onClick={handleAbsen} disabled={loading || pdfLoading}>
            {loading ? "Absen sedang diproses..." : "Absen"}
          </Button>
          <Button bgColor="bg-orange-400" onClick={() => setIsIzinModalOpen(true)} disabled={loading || pdfLoading}>
            Izin
          </Button>
          <Button bgColor="bg-emerald-400" onClick={handleDownloadPDF} disabled={loading || pdfLoading}>
            {pdfLoading ? "Mengunduh PDF..." : "PDF"}
          </Button>
        </div>

        <TableAbsensi key={tableKey} />
      </div>

      {/* Izin Modal */}
      <IzinModal isOpen={isIzinModalOpen} onClose={() => setIsIzinModalOpen(false)} />

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        message={successMessage}
      />
    </section>
  );
};


export default Absensi;