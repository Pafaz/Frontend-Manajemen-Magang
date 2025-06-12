import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import DataPeserta from "./DataPeserta";
import PasswordPeserta from "./PasswordPeserta";
import RouteProject from "./RouteProject";

const CompanyCard = () => {
  const [activeMenu, setActiveMenu] = useState("Data Diri");
  const [animating, setAnimating] = useState(false);
  const [dataPeserta, setDataPeserta] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [logoImage, setLogoImage] = useState(null);

  const fetchPesertaData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/peserta/detail`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const peserta = res.data.data;
      setDataPeserta(peserta);

      const logo = peserta.foto?.find((f) => f.type === "logo");
      const cover = peserta.foto?.find((f) => f.type === "profil_cover");

      setLogoImage(logo ? `/storage/${logo.path}` : null);
      setCoverImage(cover ? `/storage/${cover.path}` : null);
    } catch (err) {
      console.error("Gagal fetch data peserta", err);
    }
  };

  useEffect(() => {
    fetchPesertaData();
  }, []);

  const menuItems = [
    { label: "Data Diri" },
    { label: "Password" },
    { label: "Route Project" },
  ];

  const handleMenuClick = (label) => {
    if (label !== activeMenu) {
      setAnimating(true);
      setTimeout(() => {
        setActiveMenu(label);
        setAnimating(false);
      }, 300);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl overflow-hidden shadow-md relative">
        <div className="relative w-full h-[180px] bg-gray-200">
          {coverImage ? (
            <img
              src={coverImage}
              alt="Cover"
              className="object-cover w-full h-full"
            />
          ) : (
            <Skeleton className="w-full h-full" />
          )}
          <div className="absolute -bottom-12 left-4 w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow">
            {logoImage ? (
              <img
                src={logoImage}
                alt="Logo"
                className="object-cover w-full h-full"
              />
            ) : (
              <Skeleton className="w-full h-full" />
            )}
          </div>
        </div>
        <div className="pt-14 pb-4 px-4">
          {dataPeserta ? (
            <>
              <h2 className="text-lg font-semibold text-gray-800">
                {dataPeserta.nama_lengkap}
              </h2>
              <div className="text-[13px] text-gray-500 flex items-center gap-2 mt-1">
                <i className="bi bi-envelope-fill"></i> {dataPeserta.email}
              </div>
            </>
          ) : (
            <>
              <Skeleton className="h-5 w-40 mb-1" />
              <Skeleton className="h-4 w-32" />
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
              activeMenu === item.label
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-blue-500 hover:text-white"
            }`}
            onClick={() => handleMenuClick(item.label)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        className={`transition-all duration-300 ease-in-out transform mt-4 ${
          animating
            ? "opacity-0 translate-y-8"
            : "opacity-100 translate-y-0 animate-bounce-in"
        }`}
      >
        {activeMenu === "Data Diri" && <DataPeserta data={dataPeserta} />}
        {activeMenu === "Password" && <PasswordPeserta />}
        {activeMenu === "Route Project" && <RouteProject />}
      </div>
    </div>
  );
};

export default CompanyCard;
