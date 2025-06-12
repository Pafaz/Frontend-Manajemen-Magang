import { useState } from "react";
import PesertaBranchCard from "../../components/cards/PesertaBranchCard";

const Approval = () => {
  return (
    <div className="p-2">
      {/* Use the new PerusahaanCard component */}
      {/* Komponen BerandaBranchCard */}
      <div className="mt-2 px-1 pb-6">
        <PesertaBranchCard />
      </div>
    </div>
  );
};

export default Approval;