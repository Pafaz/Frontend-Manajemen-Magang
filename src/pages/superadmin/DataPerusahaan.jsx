import { useState } from "react";
import PerusahaanBranchCard from "../../components/cards/PerusahaanBranchCard";

const Approval = () => {
  return (
    <div className="p-2">
      {/* Komponen BerandaBranchCard */}
      <div className="pb-2">
        <PerusahaanBranchCard />
      </div>
    </div>
  );
};

export default Approval;