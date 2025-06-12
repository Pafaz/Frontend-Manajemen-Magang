import { useState } from "react";
import PerusahaanCard from "../../components/cards/PerusahaanCard"; // Import the new component
import DivisiBranchCard from "../../components/cards/DivisiBranchCard";

const Approval = () => {
  return (
    <div className="p-2">


      {/* Komponen BerandaBranchCard */}
      <div className="mt-2 px-1 pb-6">
        <DivisiBranchCard />
      </div>
    </div>
  );
};

export default Approval;