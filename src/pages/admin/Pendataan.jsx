import { useState } from "react";
import Pendataan from "../../components/cards/Pendataan";

const Approval = () => {
  return (
    <div className="p-2">


      {/* Komponen BerandaBranchCard */}
      <div className="mt-2 px-1 pb-6">
        <Pendataan />
      </div>
    </div>
  );
};

export default Approval;