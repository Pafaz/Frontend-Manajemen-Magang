import { useState } from "react";
import DataRFID from "../../components/cards/DataRFID";

const Approval = () => {
  return (
    <div className="p-2">

      {/* Komponen BerandaBranchCard */}
      <div className="mt-2 px-1 pb-6">
        <DataRFID />
      </div>
    </div>
  );
};

export default Approval;