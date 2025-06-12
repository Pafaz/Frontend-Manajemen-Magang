import { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Modal from "../Modal";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import ModalTambahCabang from "../modal/ModalTambahCabang";
import Swal from "sweetalert2"; // Import SweetAlert2

const NavAdmin = ({ toggleSidebar, sidebarCollapsed, showToggle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCabangDropdownOpen, setIsCabangDropdownOpen] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTambahCabangModalOpen, setIsTambahCabangModalOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState("2 Bulan");
  const [discount, setDiscount] = useState(10);
  const { user } = useContext(AuthContext);
  const [verived, setVerived] = useState(null);
  const [idUser, setId] = useState(null);
  const location = useLocation();
  const currentPath = location.pathname;
  const [isLoadingCabang, setIsLoadingCabang] = useState(false);
  const [cabang, setisCabang] = useState([]);
  const cabangDropdownRef = useRef(null);
  const isActive = (path) => currentPath === path;
  
  useEffect(() => {
    if (user && user.id) {
      setId(user.id);
    } else {
      setId(null);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cabangDropdownRef.current &&
        !cabangDropdownRef.current.contains(event.target)
      ) {
        setIsCabangDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const packagePrice = 100000;
  const calculateSubtotal = () => {
    const months = parseInt(selectedDuration.split(" ")[0]);
    return packagePrice * months;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - (subtotal * discount) / 100;
  };

  const handleLogout = async () => {
    // Using SweetAlert2 for logout confirmation
    Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#e11d48', // Red color for confirm button (tailwind rose-600)
      cancelButtonColor: '#d1d5db', // Gray color for cancel button (tailwind gray-300)
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoggingOut(true);
        try {
          // Show loading state with SweetAlert2
          Swal.fire({
            title: 'Logging out...',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          
          const response = await axios.post(
            "http://127.0.0.1:8000/api/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.status === 200) {
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            
            // Show success message before redirecting
            Swal.fire({
              title: 'Logout Success!',
              text: 'You have been logged out successfully',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            }).then(() => {
              window.location.href = "/auth/login";
            });
          } else {
            Swal.fire({
              title: 'Logout Failed',
              text: 'Please try again',
              icon: 'error'
            });
          }
        } catch (error) {
          console.error("Logout error:", error);
          Swal.fire({
            title: 'Logout Failed',
            text: 'An error occurred during logout',
            icon: 'error'
          });
        } finally {
          setIsLoggingOut(false);
        }
      }
    });
  };

  const handlePremiumClick = () => {
    setIsPremiumModalOpen(true);
  };

  const handleGetStartedClick = () => {
    setIsPremiumModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentConfirmation = () => {
    setIsPaymentModalOpen(false);
    alert("Pembayaran berhasil! Akun Anda telah ditingkatkan ke Pro.");
  };

  const checkIsVerived = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/perusahaan/detail`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setVerived(response.data.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const getAllCabang = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const url = `${import.meta.env.VITE_API_URL}/cabang?t=${Date.now()}`;

      const res = await axios.get(url, {
        headers: {
          "Cache-Control": "no-store",
          Authorization: `Bearer ${token}`,
        },
      });

      setIsLoadingCabang(true);

      if (res.status === 200 && res.data && res.data.data) {
        setisCabang(res.data.data);
      } else if (res.status === 304) {
        console.log("Data cabang belum berubah, tidak perlu update.");
      } else {
        console.warn("Respons tidak sesuai harapan:", res.status, res.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data cabang:", error);
    } finally {
      setIsLoadingCabang(false);
    }
  };

  const handleClickActivecabang = async ($id_cabang) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/set-cabang-aktif`,
        { id_cabang: $id_cabang },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleTambahCabang = () => {
    setIsLoadingCabang(true);
    setIsCabangDropdownOpen(false);
    setTimeout(() => {
      setIsLoadingCabang(false);
      setIsTambahCabangModalOpen(true);
    }, 2000);
  };

  const handleTambahPremiumCabang = () => {
    setIsLoadingCabang(true);
    setIsCabangDropdownOpen(false);
    setTimeout(() => {
      setIsLoadingCabang(false);
      setIsPremiumModalOpen(true);
    }, 200);
  };

  useEffect(() => {
    // This will run once when the component mounts
    checkIsVerived();
  }, []);
  
  useEffect(() => {
    if (verived){
    getAllCabang();
    }
  }, [verived]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-dropdown")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRinging(true);
      setTimeout(() => setIsRinging(false), 800);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSave = async (data) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/cabang`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      getAllCabang();
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.log("Validasi Gagal:", error.response.data.errors);
      } else {
        console.log("Gagal menyimpan data cabang:", error);
      }
    }
  };

  return (
    <nav className="bg-white w-full h-[60px] flex items-center px-6 sticky top-0 z-50 border-b border-b-slate-300">
      {/* Tombol Toggle Sidebar */}
      {showToggle ? 
          <button
            onClick={toggleSidebar}
            className="mr-4 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            {sidebarCollapsed ? (
              <i className="bi bi-filter-right text-xl"></i>
            ) : (
              <i className="bi bi-filter-left text-xl"></i>
            )}
          </button>
          :
                <img src="/assets/img/Logo.png" alt="Logo" className="w-48 mr-7" />
          
      }

      <div className="flex gap-4 items-center">
        {/* Dashboard Link */}
        <Link
          to="/perusahaan/dashboard"
          className={`font-semibold text-sm px-4 py-2 rounded-full flex items-center transition-colors ${
            isActive("/perusahaan/dashboard")
              ? "text-[#0069AB] underline"
              : "text-black hover:underline"
          }`}
        >
          Dashboard
        </Link>

        {/* Kelola Cabang with Dropdown */}
        <div className="relative" ref={cabangDropdownRef}>
          <button
            onClick={() => setIsCabangDropdownOpen(!isCabangDropdownOpen)}
            className={`font-semibold text-sm px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${
              isActive("/admin/cabang") ||
              currentPath.includes("/admin/cabang/")
                ? "text-[#0069AB] underline"
                : "text-black hover:underline"
            }`}
          >
            Perusahaan
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform duration-300 ${
                isCabangDropdownOpen ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.292l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.1 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Cabang Dropdown Menu */}
          {isCabangDropdownOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
              {isLoadingCabang ? (
                <div className="py-4 px-4 text-center text-gray-600">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                </div>
              ) : cabang.length === 0 ? (
                <div className="py-4 px-4">
                  <p className="text-gray-600 text-sm mb-3">Belum ada Cabang</p>
                  <button
                    onClick={() => {
                      setIsTambahCabangModalOpen(true);
                      setIsCabangDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Tambah Cabang
                  </button>
                </div>
              ) : (
                <div>
                  <div className="border-b border-gray-200">
                    <Link
                      to="/perusahaan/cabang"
                      className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
                        isActive("/perusahaan/cabang")
                          ? "bg-gray-100 font-medium"
                          : ""
                      }`}
                      onClick={() => setIsCabangDropdownOpen(false)}
                    >
                      Semua Cabang
                    </Link>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {cabang.map((cabang) => (
                      <Link
                        key={cabang.id}
                        to={`/perusahaan/cabang/${cabang.nama}`}
                        className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
                          currentPath === `/perusahaan/cabang/${encodeURIComponent(cabang.nama)}/asdasdasd`
                            ? "bg-gray-100 font-medium"
                            : ""
                        }`}
                        onClick={() => {
                          setIsCabangDropdownOpen(false);
                          handleClickActivecabang(cabang.id);
                        }}
                      >
                        {cabang.nama}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 py-2 px-4 hover:bg-gray-100">
                    {cabang.length === 1 ? (
                      <button
                        onClick={handleTambahPremiumCabang}
                        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        {isLoadingCabang ? (
                          <div className="py-4 px-4 text-center text-gray-600">
                            <div className="flex justify-center items-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                            </div>
                          </div>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        Tambah Cabang
                      </button>
                    ) : (
                      <button
                        onClick={handleTambahCabang}
                        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        {isLoadingCabang ? (
                          <div className="py-4 px-4 text-center text-gray-600">
                            <div className="flex justify-center items-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                            </div>
                          </div>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        Tambah Cabang
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Kelola Lowongan */}
        <Link
          to="/perusahaan/lowongan"
          className={`font-semibold text-sm px-4 py-2 rounded-full flex items-center transition-colors ${
            isActive("/perusahaan/lowongan")
              ? "text-[#0069AB] underline"
              : "text-black hover:underline"
          }`}
        >
          Lowongan
        </Link>
        {/* Kelola Lowongan */}
        <Link
          to="/perusahaan/mitra"
          className={`font-semibold text-sm px-4 py-2 rounded-full flex items-center transition-colors ${
            isActive("/perusahaan/mitra")
              ? "text-[#0069AB] underline"
              : "text-black hover:underline"
          }`}
        >
          Mitra
        </Link>
      </div>

      <div className="flex gap-5 ml-auto items-center">
        <div className="w-7 h-7 rounded-full bg-indigo-100 relative flex justify-center items-center">
          <div className="bg-red-500 w-2 h-2 rounded-full absolute top-1 right-2 animate-ping"></div>
          <i className={`bi bi-bell ${isRinging ? "bell-shake" : ""}`}></i>
        </div>

        <button
          onClick={handlePremiumClick}
          className="flex items-center gap-1.5 animate-pulse bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200"
        >
          <i className="bi bi-star-fill text-yellow-300 text-xs"></i>
          <span>Get Premium</span>
        </button>

        <div className="relative profile-dropdown">
          <div
            className="flex items-center gap-2 bg-white pr-4 pl-1 py-0.5 rounded-full border border-gray-300 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img
              src="/assets/img/user-img.png"
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="absolute w-3 h-3 bg-green-500 rounded-full left-6 top-6 border-2 border-white"></div>
            <i className="bi bi-chevron-down text-gray-500"></i>
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden z-50">
              <div className="py-2">
                <Link
                  to={
                    verived !== "true"
                      ? "/perusahaan/settings"
                      : `/perusahaan/update-perusahaan/${idUser}`
                  }
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Pengaturan
                </Link>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Keluar
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Premium Modal */}
      <Modal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        title=""
      >
        <div className="flex flex-col items-center p-2">
          {/* Icon Premium */}
          <div className="flex justify-center mb-4">
            <img
              src="/assets/img/firecrikers 1.png"
              alt="Premium"
              className="w-32 h-32"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Cpath d='M48,16 L68,48 L88,16 L68,64 L48,80 L28,64 L8,16 L28,48 L48,16 Z' fill='%234299e1' stroke='%23ebf4ff' stroke-width='2'/%3E%3C/svg%3E";
              }}
            />
          </div>

          {/* Judul */}
          <h4 className="text-xl font-bold mb-4 text-center">
            Up To Premium Your Account To Add new Participant
          </h4>

          {/* List Fitur */}
          <div className="flex flex-col gap-4 w-full max-w-md text-gray-700">
            <div className="flex items-start gap-3">
              <i className="bi bi-check-circle-fill text-blue-500 text-lg mt-1"></i>
              <span className="block text-sm">
                Tambah hingga 5 perusahaan baru
              </span>
            </div>
            <div className="flex items-start gap-3">
              <i className="bi bi-check-circle-fill text-blue-500 text-lg mt-1"></i>
              <span className="block text-sm">
                Tambah hingga 5 posisi magang baru
              </span>
            </div>
            <div className="flex items-start gap-3">
              <i className="bi bi-check-circle-fill text-blue-500 text-lg mt-1"></i>
              <span className="block text-sm">Unlimited admin dan pegawai</span>
            </div>
            <div className="flex items-start gap-3">
              <i className="bi bi-check-circle-fill text-blue-500 text-lg mt-1"></i>
              <span className="block text-sm">
                Support prioritas untuk pelanggan premium
              </span>
            </div>
          </div>

          {/* Harga */}
          <div className="font-bold text-3xl mt-8 mb-4">
            Rp. 100.000
            <span className="text-base font-normal text-gray-500"> /bulan</span>
          </div>

          {/* Tombol */}
          <button
            onClick={handleGetStartedClick}
            className="w-full max-w-md py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200"
          >
            Get Started
          </button>
        </div>
      </Modal>

      <ModalTambahCabang
        isOpen={isTambahCabangModalOpen}
        onClose={() => setIsTambahCabangModalOpen(false)}
        onSave={handleSave}
        getFetchData={() => getAllCabang()}
      />
    </nav>
  );
};

export default NavAdmin;