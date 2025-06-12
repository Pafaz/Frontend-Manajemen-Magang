import { useState } from "react";
import BannerCabang from "../../components/cards/BannerCabang";
import BerandaBranchCard from "../../components/cards/BerandaBranchCard";

const CabangDashboard = () => {
  return (
    <div className="p-2">
      {/* Komponen BerandaBranchCard */}
      <div className="pb-2">
        <BannerCabang />
      </div>
      <div className="mt-8 px-1 pb-6">
        <BerandaBranchCard />
      </div>
    </div>
  );
};

export default CabangDashboard;