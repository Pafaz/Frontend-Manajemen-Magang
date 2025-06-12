// Dashboard.jsx
import { useEffect, useState } from 'react';
import StatisticsCard from './StatisticsCard';
import JamKantor from './JamKantor';
import SummaryCards from './SummaryCards';
import MentorPerDivision from './MentorPerDivision';
import Card from './Card';
import axios from 'axios';
import Swal from 'sweetalert2';
const Dashboard = () => {
  
  const [summary, setSummary ] = useState([]);
  const [peserta, setPeserta] = useState([]);
  const [mentor, setMentor] = useState([]);

  const getRekap = async () => {
    try {
      Swal.fire({
        title: 'Memuat data...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cabang/rekap`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSummary(response.data.data);
      setPeserta(response.data.data.peserta_per_divisi);
      setMentor(response.data.data.mentor_per_divisi);
      Swal.close();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getRekap();
  }, []); 

  return (
    <Card>
    <div className="container mx-auto px-2 py-2 min-h-screen">
      {/* Membuat layout grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Kolom Kiri - Lebih Lebar */}
        <div className="flex-[7] w-full flex flex-col gap-2">
          <StatisticsCard peserta = {peserta}/>
          <JamKantor/>
        </div>

        {/* Kolom Kanan - Lebih Sempit */}
        <div className="flex-[5] w-full flex flex-col gap-6">
          <SummaryCards summary = {summary}/>
          <MentorPerDivision mentor = {mentor} />
        </div>
      </div>
    </div>
    </Card>
  );
};

export default Dashboard;
