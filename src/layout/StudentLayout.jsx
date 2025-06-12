import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import { StatusContext } from "../pages/student/StatusContext";
import { AuthContext } from "../contexts/AuthContext";

const StudentLayout = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [isPresentasiOpen, setIsPresentasiOpen] = useState(false);
  const { role, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    profileComplete,
    internshipStatus,
    userLoading,
  } = useContext(StatusContext);

  const handleLogout = useCallback( async () => {
    // Show SweetAlert confirmation dialog
    const result = await Swal.fire({
      title: 'Konfirmasi Logout',
      text: 'Apakah Anda yakin ingin keluar dari akun?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626', // red-600
      cancelButtonColor: '#6b7280', // gray-500
      confirmButtonText: 'Ya, Logout',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      customClass: {
        popup: 'font-sans',
        title: 'text-lg font-semibold',
        content: 'text-sm text-gray-600',
        confirmButton: 'font-medium',
        cancelButton: 'font-medium'
      }
    });

    // If user confirmed logout
    if (result.isConfirmed) {
      // Show loading alert
      Swal.fire({
        title: 'Logging out...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          localStorage.removeItem("token");
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('internshipStatus');
          sessionStorage.removeItem('profileComplete');
          // Show success message before redirect
          await Swal.fire({
            title: 'Logout Berhasil!',
            text: 'Anda telah berhasil keluar dari akun',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
            timer: 1500,
            timerProgressBar: true
          });

          window.location.href = "/auth/login";
        } else {
          throw new Error('Logout failed');
        }
      } catch (error) {
        console.error("Logout error:", error);
        
        // Show error message
        Swal.fire({
          title: 'Logout Gagal!',
          text: 'Terjadi kesalahan saat logout. Silakan coba lagi.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      }
    }
  }, [navigate]);

  const sidebarMenus = [
    { icon: "bi-grid", label: "Beranda", link: "dashboard" },
    { icon: "bi-calendar4-week", label: "Absensi", link: "absensi" },
    { icon: "bi-clipboard2-minus", label: "Jurnal", link: "jurnal" },
    { icon: "bi-mortarboard", label: "Jadwal Presentasi", link: "presentasi" },
    { icon: "bi-pin-map", label: "Riwayat Presentasi", link: "riwayat-presentasi" },
    { icon: "bi bi-cast", label: "Route Project", link: "route-project" },
    { icon: "bi bi-list-check", label: "Piket", link: "piket" },
  ];

  const footerMenus = ["License", "More Themes", "Documentation", "Support"];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRinging(true);
      setTimeout(() => setIsRinging(false), 800);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
    if (!userLoading) {
      setLoading(false);
    }
  }, [userLoading]);

  // useEffect(() => {
  //   if ((role && role !== "peserta") || !token) {
  //     const redirectTo = localStorage.getItem("location");
  //     if (redirectTo) {
  //       navigate(redirectTo);
  //       localStorage.removeItem("location");
  //     } else {
  //       console.log('anjay');
  //       navigate("/");
  //     }
  //   }
  // }, [role]);

  return (
    <div className="w-full flex">
      {loading ? (
        <div className="bg-white border-r border-r-slate-300 w-[238px] h-screen fixed py-4 px-2 flex-[2] z-[60] animate-pulse">
          <div className="w-48 h-12 bg-slate-200 mx-auto mb-8 rounded"></div>
          <div className="flex flex-col gap-3 mt-8">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="h-8 bg-slate-200 rounded-lg w-full"
              ></div>
            ))}
            <div className="bg-slate-300 w-full h-0.5 rounded-full my-2"></div>
            <div className="h-8 bg-slate-200 rounded-lg w-full"></div>
          </div>
        </div>
      ) : (
        <div className="bg-white border-r border-r-slate-300 w-[238px] h-screen fixed py-4 px-2 flex-[2] z-[60]">
          <img
            src="/assets/img/Logo.png"
            alt="Logo"
            className="w-48 mx-auto object-cover"
          />
          <div className="flex flex-col gap-3 mt-8">
            {sidebarMenus.map((menu, idx) => {
              const isActive = location.pathname.includes(`/peserta/${menu.link}`);
              
              // Menu is disabled if either:
              // 1. Profile data is incomplete (only for non-Dashboard) OR
              // 2. Internship status is not "diterima" (except Dashboard is always accessible)
              const isDisabled =
                (!profileComplete && menu.label !== "Dashboard") || 
                (!internshipStatus && menu.label !== "Dashboard");
              
              // Show appropriate message on hover based on disable reason
              let disableReason = "";
              if (menu.label !== "Dashboard") {
                if (!profileComplete) {
                  disableReason = "Lengkapi profil Anda terlebih dahulu";
                } else if (internshipStatus === "menunggu") {
                  disableReason = "Menunggu persetujuan perusahaan";
                } else if (internshipStatus === "ditolak") {
                  disableReason = "Pendaftaran magang Anda ditolak";
                } else {
                  disableReason = "Belum terdaftar magang";
                }
              }
              return (
                <Link
                  to={isDisabled ? "#" : `/peserta/${menu.link}`}
                  key={idx}
                  onClick={(e) => {
                    if (isDisabled) {
                      e.preventDefault();
                      return;
                    }
                    setIsPresentasiOpen(false);
                  }}
                  className={`px-4 py-2 rounded-lg flex gap-3 items-center transition-all duration-500 ease-in-out ${
                    isActive
                      ? "bg-sky-800 text-white"
                      : isDisabled
                      ? "text-slate-400 opacity-50 cursor-not-allowed"
                      : "text-black hover:text-white hover:bg-sky-800"
                  }`}
                  title={isDisabled ? disableReason : ""}
                >
                  <i className={`bi ${menu.icon} text-lg`}></i>
                  <span className="font-light text-sm flex items-center gap-2">
                    {menu.label}
                    {isDisabled && <i className="bi bi-lock text-xs" />}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex-1 ml-[238px] min-h-screen">
        <nav className="bg-white w-full h-[60px] flex items-center px-10 sticky top-0 z-50 border-b border-b-slate-300">
          <div className="flex gap-5 ml-auto items-center">
            <div className="w-7 h-7 rounded-full bg-indigo-100 relative flex justify-center items-center">
              <div className="bg-red-500 w-2 h-2 rounded-full absolute top-1 right-2 animate-ping"></div>
              <i className={`bi bi-bell ${isRinging ? "bell-shake" : ""}`}></i>
            </div>
            <div className="w-7 h-7 rounded-full bg-indigo-100 relative flex justify-center items-center">
              <i className="bi bi-globe text-sm"></i>
            </div>

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
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                  <div className="py-2">
                    <Link
                      to="/peserta/setting-peserta"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <i className="bi bi-gear mr-2 text-sm"></i>
                      Pengaturan
                    </Link>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    >
                      <i className="bi bi-box-arrow-right mr-2 text-sm"></i>
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="pt-5 px-3 bg-indigo-50 min-h-screen flex flex-col overflow-y-auto bottom-0">
          <div className="flex-1">
            <Outlet />
          </div>
          <div className="mt-3">
            <div className="bg-white rounded-t-xl px-5 py-4 w-full flex justify-between">
              <div className="text-slate-400 font-normal text-sm">
                © Copyright Edmate 2024, All Right Reserved
              </div>
              <div className="flex gap-5">
                {footerMenus.map((item, i) => (
                  <Link
                    key={i + 1}
                    to={`#`}
                    className="text-slate-400 text-sm font-normal"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;