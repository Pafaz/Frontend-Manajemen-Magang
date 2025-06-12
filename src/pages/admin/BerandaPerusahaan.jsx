import { useState } from "react";
import BannerCabang from "../../components/BannerCabang";
import BerandaBranchCard from "../../components/cards/BerandaBranchCard";
import PerusahaanCard from "../../components/cards/PerusahaanCard"; // Import the new component

const Approval = () => {
  return (
    <div className="p-3">
      {/* Use the new PerusahaanCard component */}
      <BannerCabang/>
      <PerusahaanCard />

      {/* Komponen BerandaBranchCard */}
      <div className="mt-8 px-1 pb-6">
        <BerandaBranchCard />
      </div>
    </div>
  );
};

export default Approval;