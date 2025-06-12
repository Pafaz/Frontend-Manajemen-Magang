import React, { useEffect, useState } from 'react';
import { Globe, Instagram, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from "../../components/cards/Card";
import ReactPaginate from 'react-paginate';
import ModalTambahCabang from "../../components/modal/ModalTambahCabang";
import ModalDeleteAdminCabang from "../../components/modal/ModalDeleteAdminCabang"; // Import the new component
import axios from 'axios';
import Swal from 'sweetalert2';


export default function CompanyBranchCard() {
  const navigate = useNavigate();
  
  const [branches, setBranches] = useState([]);
  const [coverImage, setCoverImage] = useState("/assets/img/Cover.png");
  const [logoImage, setLogoImage] = useState("/assets/img/logoperusahaan.png");
  
  console.log(branches);
  
  const getBranches = async ()=> {
    try{
      // Swal.fire({
      //   title: 'Memuat data...',
      //   allowOutsideClick: false,
      //   allowEscapeKey: false,
      //   showConfirmButton: false,
      //   didOpen: () => {
      //     Swal.showLoading();
      //   }
      // });

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/cabang`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setBranches(res.data.data)
      const logo = res.data.data.foto.find((f) => f.type === "logo");
      const cover = res.data.data.foto.find((f) => f.type === "profil_cover");
  
        // Swal.close();
      
        setLogoImage(logo ? `${import.meta.env.VITE_API_URL_FILE}/storage/${logo.path}` : null);
        setCoverImage(cover ? `${import.meta.env.VITE_API_URL_FILE}/storage/${cover.path}` : null);
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getBranches();
  }, [])
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;
  const pageCount = Math.ceil(branches.length / itemsPerPage);

  // State for controlling modal visibility
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const displayedBranches = branches.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  // Function to handle adding a new branch
  const handleAddBranch = (branchData) => {
    // Create a new branch object with the form data
    const newBranch = {
      id: branches.length + 1,
      name: branchData.name,
      location: `${branchData.city}, ${branchData.province}`,
      address: "0 Peserta Magang", // Default value
      backgroundImage: "/assets/img/Cover.png", // Default image
      logoImage: "/assets/img/logoperusahaan.png", // Default logo
      // You could also store the social media links if needed
      website: branchData.website,
      instagram: branchData.instagram,
      linkedin: branchData.linkedin
    };

    // Add the new branch to the branches array
    setBranches([...branches, newBranch]);
    
    // Close the modal
    setShowModal(false);
  };

  // Function to navigate to the detail page
  const handleViewDetail = (branchId) => {
    navigate(`/perusahaan/cabang/${branchId}`);
  };
  // Handle delete button click
  const handleDeleteClick = (branch) => {
    setBranchToDelete(branch);
    setShowDeleteModal(true);
  };

  // Handle actual delete of branch
  const handleDeleteBranch = () => {
    setBranches(branches.filter(branch => branch.id !== branchToDelete.id));
    setShowDeleteModal(false);
    setBranchToDelete(null);
  };

  // Close delete modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setBranchToDelete(null);
  };

  return (
    <div className='max-w-11/12 mx-auto'>
    <Card>
      <div className="mt-8 px-1 pb-6 ">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Cabang Perusahaan Terdaftar</h1>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowModal(true)}
              className="bg-white text-gray-700 border border-gray-300 rounded-md px-2 py-1 text-xs flex items-center"
            >
              <i className="bi bi-plus mr-1"></i>
              <span className="mr-1">Tambah Cabang</span>
            </button>
            <div className="flex items-center">
              <span className="mr-1 text-xs">Sort by:</span>
              <select className="border border-gray-300 rounded-md px-2 py-1 text-xs">
                <option>Terbaru</option>
                <option>Terlama</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayedBranches.map((branch) => (
            <div key={branch.id} className="bg-white border border-[#D5DBE7] rounded-lg overflow-hidden">
              <div className="relative">
                <img src={coverImage} alt="Company Building" className="w-full h-32 object-cover" />
                <div className="absolute -bottom-4 left-0 right-0 flex justify-center">
                  <div className="rounded-full overflow-hidden border-2 border-white bg-white w-8 h-8">
                    <img src={logoImage} alt="Company Logo" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div className="pt-8 px-3 pb-4">
                <h3 className="font-bold text-sm text-gray-800 text-center mb-2">{branch.nama}</h3>
                <p className="text-xs text-gray-600 text-center mb-1">{branch.kota}</p>
                <p className="text-xs text-gray-600 text-center mb-3">{branch.provinsi}</p>

                <div className="flex justify-center space-x-4 my-3">
                  <Instagram size={16} className="text-gray-600 hover:text-pink-500 cursor-pointer" />
                  <Globe size={16} className="text-gray-600 hover:text-blue-500 cursor-pointer" />
                  <Linkedin size={16} className="text-gray-600 hover:text-blue-700 cursor-pointer" />
                </div>

                <div className="flex justify-center mt-3">
                  <div className="border border-[#D5DBE7] rounded p-2 w-full flex justify-between items-center space-x-2">
                    <button 
                      onClick={() => handleViewDetail(branch.nama)}
                      className="text-blue-500 border border-blue-500 rounded px-3 py-1 text-xs hover:bg-blue-50"
                    >
                      Lihat Detail
                    </button>
                    <button className="text-orange-500 border border-orange-500 rounded px-3 py-1 text-xs hover:bg-orange-50">Edit</button>
                    <button 
                      onClick={() => handleDeleteClick(branch)}
                      className="text-red-500 border border-red-500 rounded px-3 py-1 text-xs hover:bg-red-50"
                    >
                      Hapus
                    </button>                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex-1">
            <ReactPaginate
              previousLabel="← Sebelumnya"
              nextLabel="Berikutnya →"
              breakLabel="..."
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName="flex justify-center items-center space-x-2"
              pageLinkClassName="px-3 py-1 text-sm rounded-md text-gray-700 hover:bg-blue-100"
              activeLinkClassName="bg-blue-500 text-white"
              previousClassName="mr-auto"
              nextClassName="ml-auto"
              previousLinkClassName="border border-gray-300 px-4 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100"
              nextLinkClassName="border border-gray-300 px-4 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Add Branch Modal */}
      <ModalTambahCabang 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddBranch}
      />
      {/* Using the extracted ModalDeleteAdminCabang component */}
      <ModalDeleteAdminCabang 
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteBranch}
      />
    </Card>
    </div>
  );
}