import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AlertVerification = () => {
  const navigate = useNavigate();
  const [isPerusahaan, setIsPerusahaan] = useState(false);

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath.includes("perusahaan")) {
      setIsPerusahaan(true);
    } else if (currentPath.includes("peserta")) {
      setIsPerusahaan(false);
    }
  }, []);

  const handleVerificationClick = () => {
    if (isPerusahaan) {
       navigate("/perusahaan/settings");
    } else {
       navigate("/peserta/settings");
    }
  };

  return (
    <div className="w-full h-14 bg-red-50 border border-red-500 rounded-lg flex justify-between py-1 px-3 items-center mb-4">
      <h1 className="text-red-600 font-semibold text-sm">
        Anda Belum Mengisi Data Diri
      </h1>
      <button
        onClick={handleVerificationClick}
        className="font-semibold text-red-500 text-sm bg-white border border-red-500 rounded-lg py-2 px-4"
      >
        Lengkapi Data Anda
      </button>
    </div>
  );
};

export default AlertVerification;
