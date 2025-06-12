import { useState } from "react";
import PerusahaanCard from "../../components/cards/PerusahaanCard"; // Import the new component
import DataApproval from "../../components/cards/DataApproval";

const Approval = () => {
  return (
    <div className="p-2">
      {/* Use the new PerusahaanCard component */}

      {/* Komponen BerandaBranchCard */}
      <div className="mt-2 px-1 pb-6">
        <DataApproval />
      </div>
    </div>
  );
};

export default Approval;