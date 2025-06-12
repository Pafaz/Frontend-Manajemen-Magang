import { useState } from "react";
import DataPeserta from "../../components/cards/DataPeserta";
import PasswordPeserta from "../../components/cards/PasswordPeserta";

const ProfileContent = ({ activeMenu }) => {
  const [animating, setAnimating] = useState(false);

  return (
    <div className="bg-[#ECF2FE] pt-10 pb-10 pl-5 overflow-hidden relative">
      <div
        className={`transition-all duration-300 ease-in-out transform ${
          animating
            ? "opacity-0 translate-y-8"
            : "opacity-100 translate-y-0"
        }`}
      >
        {activeMenu === "Data Peserta" && <DataPeserta />}
        {activeMenu === "Password" && <PasswordPeserta />}
      </div>
    </div>
  );
};

export default ProfileContent;