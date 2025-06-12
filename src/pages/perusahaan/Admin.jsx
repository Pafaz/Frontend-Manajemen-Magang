import { useState } from "react";
import PerusahaanCard from "../../components/cards/PerusahaanCard"; // Import the new component
import CompanyBranchCard from "../../components/cards/CompanyBranchCard";

const Approval = () => {
  return (
    <div className="p-6">
      <PerusahaanCard />

      <div className="mt-8 px-1 pb-6">
        <CompanyBranchCard />
      </div>
    </div>
  );
};

export default Approval;