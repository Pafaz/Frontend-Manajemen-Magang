import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import NavAdmin from "../components/ui/NavAdmin";

const PerusahaanLayout = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const { role, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { namaCabang } = useParams();

  const isCabangRoute = !!namaCabang;
  const sidebarMenus = isCabangRoute ? [
    {
      icon: "bi-grid",
      label: "Beranda",
      link: `/perusahaan/cabang/${namaCabang}/beranda`,
    },
    {
      icon: "bi-check-square",
      label: "Persetujuan",
      link: `/perusahaan/cabang/${namaCabang}/approval`,
    },
    {
      icon: "bi-pc-display",
      label: "Divisi",
      link: `/perusahaan/cabang/${namaCabang}/divisi`,
    },
    {
      icon: "bi-mortarboard",
      label: "Mentor",
      link: `/perusahaan/cabang/${namaCabang}/mentor`,
    },
    {
      icon: "bi-person",
      label: "Admin",
      link: `/perusahaan/cabang/${namaCabang}/admin`,
    },
    {
      icon: "bi bi-stopwatch",
      label: "Jam Kantor",
      link: `/perusahaan/cabang/${namaCabang}/jam-kantor`,
    },
    {
      icon: "bi-people",
      label: "Peserta Magang",
      link: `/perusahaan/cabang/${namaCabang}/peserta`,
    },
    {
      icon: "bi-card-list",
      label: "Jurnal",
      link: `/perusahaan/cabang/${namaCabang}/jurnal`,
    },
    {
      icon: "bi-card-list",
      label: "Presensi",
      link: `/perusahaan/cabang/${namaCabang}/presensi`,
    },
    {
      icon: "bi-envelope",
      label: "Surat",
      link: `/perusahaan/cabang/${namaCabang}/surat`,
    },
    {
      icon: "bi-card-checklist",
      label: "Piket",
      link: `/perusahaan/cabang/${namaCabang}/piket`,
    },
    {
      icon: "bi-upc-scan",
      label: "RFID",
      link: `/perusahaan/cabang/${namaCabang}/RFID`,
    },
    {
      icon: "bi bi-sliders2-vertical",
      label: "Pengaturan",
      link: `/perusahaan/cabang/${namaCabang}/settings-cabang`,
    },
  ]: [];

  const footerMenus = ["License", "More Themes", "Documentation", "Support"];

  // useEffect(() => {
  //   if ((role && role !== "perusahaan") || !token) {
  //     const redirectTo = localStorage.getItem("location");
  //     if (redirectTo) {
  //       navigate(redirectTo);
  //       localStorage.removeItem("location");
  //     } else {
  //       navigate("/");
  //     }
  //   }
  // }, [role]);

  // Fungsi untuk toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="w-full flex">
      {/* Sidebar hanya muncul jika ada namaCabang */}
      {isCabangRoute && (
        <div className={`bg-white border-r border-r-slate-300 ${
          sidebarCollapsed ? "w-[60px]" : "w-[238px]"
        } h-screen fixed py-4 px-2 z-[50] overflow-y-auto flex flex-col justify-between transition-all duration-300`}>
          
          <div>
            <Link to={`beranda`} className="flex justify-center">
              {sidebarCollapsed ? (
                <img src="/assets/icons/logohumma.svg" alt="Logo" className="w-10 mx-auto" />
              ) : (
                <img src="/assets/img/Logo.png" alt="Logo" className="w-48 mx-auto" />
              )}
            </Link>
            
            <div className="flex flex-col gap-3 mt-8">
              {sidebarMenus.map((menu, idx) => (
                <div key={idx} className="flex flex-col">
                  <Link
                    to={menu.link}
                    className={`${sidebarCollapsed ? "justify-center" : ""} px-4 py-2 rounded-lg flex gap-3 items-center 
                    ${
                      location.pathname === menu.link
                      ? "bg-sky-800 text-white"
                      : "hover:text-sky-500 hover:bg-sky-50"
                    }`}
                  >
                    <i className={`bi ${menu.icon} text-lg`}></i>
                    {!sidebarCollapsed && <span className="text-sm">{menu.label}</span>}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {location.pathname.includes("settings-cabang") && !sidebarCollapsed && (
            <div className="px-4 mt-10 pb-4">
              <button 
                onClick={() => confirm("Hapus cabang?") && console.log("Cabang dihapus")}
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 text-sm"
              >
                Hapus Cabang
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 ${
        isCabangRoute ? (sidebarCollapsed ? "ml-[60px]" : "ml-[238px]") : ""
      } flex flex-col min-h-screen transition-all duration-300`}>
        
        <NavAdmin 
          toggleSidebar={toggleSidebar} 
          sidebarCollapsed={sidebarCollapsed}
          showToggle={isCabangRoute}
        />
        
        <div className="flex-grow bg-indigo-50 px-3 pt-5 pb-0">
          <Outlet />
        </div>
        
        <div className="bg-white rounded-t-xl px-5 py-4 w-full flex justify-between">
          <div className="text-slate-400 text-sm">© Copyright 2024</div>
          <div className="flex gap-5">
            {footerMenus.map((item, i) => (
              <Link key={i} to="#" className="text-slate-400 text-sm">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerusahaanLayout;