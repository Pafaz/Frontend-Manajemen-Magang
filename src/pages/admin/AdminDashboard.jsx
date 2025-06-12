import { useState } from "react";
import BannerCabang from "../../components/BannerCabang";
import BerandaBranchCard from "../../components/cards/BerandaBranchCard";

const Approval = () => {
  return (
    <div className="p-3">
      {/* Use the new PerusahaanCard component */}
      <BannerCabang/>

      {/* Komponen BerandaBranchCard */}
      <div className="mt-4 px-1 pb-6">
        <BerandaBranchCard />
      </div>
    </div>
  );
};

export default Approval;