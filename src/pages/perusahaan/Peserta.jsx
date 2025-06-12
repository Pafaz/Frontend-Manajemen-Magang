import { useState } from "react";
import PerusahaanCard from "../../components/cards/PerusahaanCard"; // Import the new component
import PesertaBranchCard from "../../components/cards/PesertaBranchCard";

const Approval = () => {
  return (
    <div className="p-6">
      {/* Use the new PerusahaanCard component */}
      <PerusahaanCard />

      {/* Komponen BerandaBranchCard */}
      <div className="mt-8 px-1 pb-6">
        <PesertaBranchCard />
      </div>
    </div>
  );
};

export default Approval;