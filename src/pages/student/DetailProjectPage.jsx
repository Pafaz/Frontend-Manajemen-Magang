// DetailProjectPage.jsx
import React, { useEffect, useState } from 'react';
import ProjectHeader from '../../components/cards/ProjectHeader';
import ProgressReview from '../../components/cards/ProgressReview';
import BigProjectCard from '../../components/cards/BigProjectCard';
import ReviewForm from '../../components/cards/ReviewForm';
import ReviewDetailList from '../../components/cards/ReviewDetailList';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DetailProjectPage = () => {
  const [route, setRoute] = useState([]);
  const [mentor, setMentor] = useState([]);
  const {routeId} = useParams();
  const [currentRoute, setCurrentRoute] = useState([]);
  const kategoriList = mentor?.divisi?.kategori || [];
  
  const currentKategori = kategoriList.find(
    (p) => p.id === currentRoute?.id_kategori_proyek
  );

  const nextKategori = kategoriList.find(
    (p) => p.urutan === (currentKategori?.urutan ?? 0) + 1
  );

  const projectName = currentKategori?.nama || 'Belum diketahui';
  const nextProjectName = nextKategori?.nama || 'Tidak ada proyek selanjutnya';
  const [revisi, setRevisi] = useState([]);
  // Hitung total progress revisi
  const allTasks = revisi.flatMap(r => r.progress || []);
  const completedTasks = allTasks.filter(t => t.status === 1).length;
  const totalTasks = allTasks.length;

  const progressPercent = totalTasks === 0 ? 0 : ((completedTasks / totalTasks) * 100).toFixed(1);
  const remainingPercent = (100 - progressPercent).toFixed(1);
  console.log(revisi);
  
    // Project stages data 
    const getDetailRoute = async () => {
      try {
  
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/route-peserta-detail/${routeId}`,
          {
            headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
          }
        )
        setRoute(response.data.data)
        setMentor(response.data.data.mentor)
        setCurrentRoute(response.data.data.route.find((r)=> r.id == routeId))
        setRevisi(response.data.data.revisi.filter((r)=> r.id_route == routeId))
      }catch (error) {
        console.error(error);
      }
    }
  
    useEffect(()=> {
      getDetailRoute();
    },[])

  return (
    
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column (2/3 width on large screens) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg mb-6">
              <ProjectHeader 
                projectTitle={projectName}
                studentName={route.nama}
                category={route.divisi}
                mentorName={mentor?.user?.nama}
                mentorTitle={mentor?.divisi?.nama}
                mentorProfile={mentor?.foto?.find((f)=> f.type == 'profile').path}
              />
              <ReviewForm routeId = {routeId} onRevisiUpdated={getDetailRoute}/>
            </div>
          </div>
          
          {/* Right column (1/3 width on large screens) */}
          <div className="space-y-6">
            <ProgressReview 
              progressPercent={parseFloat(progressPercent)}
              remainingPercent={parseFloat(remainingPercent)}
            />
            <BigProjectCard nextProjectName = {nextProjectName} />
          </div>
        </div>
        
        {/* Bottom section that spans full width */}
        <div className="mt-6">
          <ReviewDetailList revisi = {revisi}/>
        </div>
      </div>

  );
};

export default DetailProjectPage;