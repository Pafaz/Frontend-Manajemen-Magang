import DataSurat from "../../components/cards/DataSurat";
import PerusahaanCard from "../../components/cards/PerusahaanCard";

const Approval = () => {
  return (
    <div className="p-6">
      {/* Use the new PerusahaanCard component */}
      <PerusahaanCard />

      {/* Komponen DataApproval */}
      <div className="mt-8 p-0">
        <DataSurat />
      </div>
    </div>
  );
};

export default Approval;