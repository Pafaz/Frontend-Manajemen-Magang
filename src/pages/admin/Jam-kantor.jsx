import { useState } from "react";
import ScheduleCard from "../../components/cards/ScheduleCard";
import Card from "../../components/cards/Card";

const Approval = () => {
  return (
    <div className="p-2">
      {/* Komponen BerandaBranchCard */}
      <Card className="mt-2 px-1 pb-6">
        <ScheduleCard />
      </Card>
    </div>
  );
};

export default Approval;