import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  ClipboardList,
  GraduationCap,
  ScanLine,
  Clock,
  FileText,
  Bell,
  Globe,
  ChevronDown,
  UserCheck,
  CheckSquare,
  ScrollText,
  Calendar,
  FileCheck,
  Shield,
  Building2,
} from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const AdminLayout = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [isPresentasiOpen, setIsPresentasiOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const sidebarMenus = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", link: "/admin/dashboard" },
    { icon: <UserCheck size={18} />, label: "Mentor", link: "/admin/mentor" },
    { icon: <Users size={18} />, label: "Peserta Magang", link: "/admin/peserta" },
    { icon: <Building2 size={18} />, label: "Divisi", link: "/admin/divisi" },
    { icon: <CheckSquare size={18} />, label: "Approval", link: "/admin/approval" },
    { icon: <ScrollText size={18} />, label: "Jurnal", link: "/admin/jurnal" },
    { icon: <Calendar size={18} />, label: "Absensi", link: "/admin/absensi" },
    { icon: <FileCheck size={18} />, label: "Surat", link: "/admin/surat" },
    { icon: <ScanLine size={18} />, label: "RFID", link: "/admin/rfid" },
    { icon: <Shield size={18} />, label: "Piket", link: "/admin/piket" },
    { icon: <Clock size={18} />, label: "Jam Kantor", link: "/admin/jam-kantor" },
  ];

  const footerMenus = ["License", "More Themes", "Documentation", "Support"];

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

  return (
    <div className="w-full flex">
      {/* Sidebar */}
      <div className="bg-white border-r border-r-slate-300 w-[238px] h-screen fixed py-4 px-2 z-[60]">
        <img src="/assets/img/Logo.png" alt="Logo" className="w-48 mx-auto object-cover" />
        <div className="flex flex-col gap-3 mt-8">
          {sidebarMenus.map((menu, idx) => {
            if (menu.hasSubmenu) {
              return (
                <div key={idx} className="flex flex-col">
                  <button onClick={() => setIsPresentasiOpen(!isPresentasiOpen)} className="px-4 py-2 rounded-lg flex gap-3 items-center text-black hover:text-white hover:bg-sky-800 transition-all duration-500 ease-in-out">
                    {menu.icon}
                    <span className="font-light text-sm">{menu.label}</span>
                  </button>
                </div>
              );
            }

            return (
              <Link to={menu.link} key={idx} className="px-4 py-2 rounded-lg flex gap-3 items-center text-black hover:text-white hover:bg-sky-800 transition-all duration-500 ease-in-out">
                {menu.icon}
                <span className="font-light text-sm">{menu.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-[238px] min-h-screen">
        {/* Navbar */}
        <nav className="bg-white w-full h-[60px] flex items-center px-10 sticky top-0 z-50 border-b border-b-slate-300">
          <div className="flex gap-5 ml-auto items-center">
            <div className="w-7 h-7 rounded-full bg-indigo-100 relative flex justify-center items-center">
              <div className="bg-red-500 w-2 h-2 rounded-full absolute top-1 right-2 animate-ping"></div>
              <Bell size={16} className={`${isRinging ? "bell-shake" : ""}`} />
            </div>
            <div className="w-7 h-7 rounded-full bg-indigo-100 relative flex justify-center items-center">
              <Globe size={14} />
            </div>

            {/* Profile Dropdown */}
            <div className="relative profile-dropdown">
              <div className="flex items-center gap-2 bg-white pr-4 pl-1 py-0.5 rounded-full border border-gray-300 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <img src="/assets/img/user-img.png" alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                <div className="absolute w-3 h-3 bg-green-500 rounded-full left-6 top-6 border-2 border-white"></div>
                <ChevronDown size={16} className="text-gray-500" />
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                  <div className="py-2">
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </a>
              </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Page Content & Footer */}
        <div className="flex flex-col min-h-screen bg-indigo-50 pt-5 px-3">
          <div className="flex-grow">
            <Outlet />
          </div>

          {/* Footer */}
          <div className="mt-3">
            <div className="bg-white rounded-t-xl px-5 py-4 w-full flex justify-between">
              <div className="text-slate-400 font-normal text-sm">© Copyright Edmate 2024, All Right Reserved</div>
              <div className="flex gap-5">
                {footerMenus.map((item, i) => (
                  <Link key={i} to="#" className="text-slate-400 text-sm font-normal">
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

export default AdminLayout;