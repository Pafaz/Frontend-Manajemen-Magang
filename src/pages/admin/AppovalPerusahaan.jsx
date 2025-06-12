import DataApproval from "../../components/cards/DataApproval";
import PerusahaanCard from "../../components/cards/PerusahaanCard"; // Import the new component

const Approval = () => {
  return (
    <div className="p-6">
      {/* Use the new PerusahaanCard component */}
      <PerusahaanCard />

      {/* Komponen DataApproval */}
      <div className="mt-8 px-1 pb-6">
        <DataApproval />
      </div>
    </div>
  );
};

export default Approval;