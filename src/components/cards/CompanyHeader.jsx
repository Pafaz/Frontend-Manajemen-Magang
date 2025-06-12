// src/components/CompanyHeader.js
import React from "react";

const CompanyHeader = ({ companyName, description, location, contactPerson, menuItems, activeMenu, handleMenuClick }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div>
        <img src="/assets/img/Cover.png" alt="Cover" className="w-full h-60 object-cover" />
      </div>

      <div className="w-full px-6 pt-4 pb-4 flex justify-between items-start">
        <div className="flex items-start gap-4">
          <img src="/assets/img/logoperusahaan.png" alt="Logo" className="w-14 h-14 rounded-full border border-gray-200" />

          <div>
            <h2 className="text-lg font-semibold text-gray-800">{companyName}</h2>
            <p className="text-[13px] text-gray-600">{description}</p>

            <div className="text-[13px] text-gray-500 flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1">
                <i className="bi bi-geo-alt-fill"></i> {location}
              </span>
              |
              <span className="flex items-center gap-1">
                <i className="bi bi-person-fill"></i> {contactPerson}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-2 text-gray-600 text-[13px]">
              <a href="https://www.humma.co.id" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                <i className="bi bi-globe"></i>
              </a>
              <a href="https://www.instagram.com/humma.id" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/company/humma-id" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 mt-2 mb-0 px-6 overflow-x-auto">
        {menuItems.map((menuName, index) => (
          <div
            key={index}
            className={`px-3 py-1.5 cursor-pointer rounded-t-lg transition-all duration-300 ease-in-out ${
              activeMenu === menuName ? "bg-[#ECF2FE] text-[#0069AB] font-medium transform scale-105" : "bg-white-100 text-black-600 hover:bg-[#ECF2FE] hover:text-[#0069AB]"
            }`}
            onClick={() => handleMenuClick(menuName)}
          >
            <span className="text-[13px] font-medium relative">
              {menuName === "rfid" ? "RFID" : menuName}
              {activeMenu === menuName && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0069AB] rounded-full"></span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyHeader;
