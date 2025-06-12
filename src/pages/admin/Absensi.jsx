import { useState } from "react";
import DataAbsensi from "../../components/cards/DataAbsensi";

const Approval = () => {
  return (
    <div className="p-2">
      {/* Use the new PerusahaanCard component */}

      {/* Komponen BerandaBranchCard */}
      <div className="mt-2 px-1 pb-6">
        <DataAbsensi />
      </div>
    </div>
  );
};

export default Approval;