import { useState } from "react";
import DataPiket from "../../components/cards/DataPiket";

const Approval = () => {
  return (
    <div className="p-2">

      {/* Komponen BerandaBranchCard */}
      <div className="mt-2 px-1 pb-6">
        <DataPiket />
      </div>
    </div>
  );
};

export default Approval;