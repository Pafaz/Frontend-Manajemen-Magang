import PerusahaanCard from "../../components/cards/PerusahaanCard"; // Import the new component
import DaftarMitra from "../../components/cards/DaftarMitra";

const Approval = () => {
  return (
    <div className="p-6">
      {/* Use the new PerusahaanCard component
      <PerusahaanCard /> */}

      {/* Komponen BerandaBranchCard */}
      <div className="mt-2 px-1 pb-6">
        <DaftarMitra />
      </div>
    </div>
  );
};

export default Approval;