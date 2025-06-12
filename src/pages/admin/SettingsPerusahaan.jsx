import { useState, useRef } from "react";
import DataPerusahaan from "../../components/cards/DataPerusahaan";
import Password from "../../components/cards/Password";

const CompanyCard = () => {
  const [companyName] = useState("PT. HUMMA TECHNOLOGY INDONESIA");
  const [location] = useState("Malang, Indonesia");
  const [join] = useState("Join August 2024");

  // File upload states
  const [coverImage, setCoverImage] = useState("/assets/img/Cover.png");
  const [logoImage, setLogoImage] = useState("/assets/img/logoperusahaan.png");

  // File input refs
  const coverInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const [animating, setAnimating] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Data Perusahaan");

  const handleMenuClick = (menuName) => {
    if (menuName !== activeMenu) {
      setAnimating(true);
      setTimeout(() => {
        setActiveMenu(menuName);
        setTimeout(() => {
          setAnimating(false);
        }, 50);
      }, 300);
    }
  };

  const handleImageUpload = (inputRef, setImage) => {
    inputRef.current.click();
  };

  const handleFileChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [{ label: "Data Perusahaan" }, { label: "Password" }];

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="relative">
          <img src={coverImage} alt="Cover" className="w-full h-60 object-cover" />
          <input
            type="file"
            ref={coverInputRef}
            onChange={(e) => handleFileChange(e, setCoverImage)}
            accept="image/*"
            className="hidden"
          />
          <button
            className="absolute top-4 right-4 flex items-center gap-2 border border-gray-300 bg-white bg-opacity-80 text-[#344054] px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-[#0069AB] hover:text-white"
            onClick={() => handleImageUpload(coverInputRef, setCoverImage)}
          >
            Edit Cover
          </button>
        </div>

        <div className="w-full px-6 pt-4 pb-4 flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div className="relative group">
              <img src={logoImage} alt="Logo" className="w-14 h-14 rounded-full border border-gray-200 object-cover" />
              <input
                type="file"
                ref={logoInputRef}
                onChange={(e) => handleFileChange(e, setLogoImage)}
                accept="image/*"
                className="hidden"
              />
              <button
                className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full border border-gray-200 shadow-sm hover:bg-gray-50"
                onClick={() => handleImageUpload(logoInputRef, setLogoImage)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{companyName}</h2>
              <div className="text-[13px] text-gray-500 flex items-center gap-2 mt-1">
                <i className="bi bi-geo-alt-fill"></i> {location}
              </div>
              <div className="text-[13px] text-gray-500 flex items-center gap-2 mt-1">
                <i className="bi bi-calendar-fill"></i> {join}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-1 mt-2 mb-0 px-6">
          {menuItems.map((menu, index) => (
            <div
              key={index}
              className={`px-3 py-1.5 cursor-pointer rounded-t-lg transition-all duration-300 ease-in-out ${
                activeMenu === menu.label ? "bg-[#ECF2FE] text-[#0069AB] font-medium transform scale-105" : "bg-white-100 text-black-600 hover:bg-[#ECF2FE] hover:text-[#0069AB]"
              }`}
              onClick={() => handleMenuClick(menu.label)}
            >
              <span className="text-[13px] font-medium relative">
                {menu.label}
                {activeMenu === menu.label && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0069AB] rounded-full"></span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#ECF2FE] pt-4 pb-4 overflow-hidden relative">
        <div className={`transition-all duration-300 ease-in-out transform ${animating ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0 animate-bounce-in"}`}>
          {activeMenu === "Data Perusahaan" && <DataPerusahaan />}
          {activeMenu === "Password" && <Password />}
        </div>
      </div>
    </>
  );
};

export default CompanyCard;
