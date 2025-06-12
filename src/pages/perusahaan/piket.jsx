import { useState } from "react";
import PerusahaanCard from "../../components/cards/PerusahaanCard"; // Import the new component
import DataPiket from "../../components/cards/DataPiket";

const Approval = () => {
  return (
    <div className="p-6">
      {/* Use the new PerusahaanCard component */}
      <PerusahaanCard />

      {/* Komponen BerandaBranchCard */}
      <div className="mt-8 px-1 pb-6">
        <DataPiket />
      </div>
    </div>
  );
};

export default Approval;