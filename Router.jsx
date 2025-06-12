import { createBrowserRouter, Navigate } from "react-router-dom";
import GuestLayout from "./src/layout/GuestLayout";
import Index from "./src/pages/Index";
import NotFound from "./src/pages/Error/NotFound";
import About from "./src/pages/About";
import Register from "./src/pages/Auth/Register";
import Login from "./src/pages/Auth/Login";
import StudentLayout from "./src/layout/StudentLayout";
import Dashboard from "./src/pages/student/Dashboard";
import MentorLayout1 from "./src/layout/MentorLayout1";
import MentorDashboard from "./src/pages/mentor/MentorDashboard";
import DataSiswa from "./src/pages/mentor/Siswa";
import TrackRecord from "./src/pages/mentor/trackrecord";
import OnlinePresentasi from "./src/pages/mentor/PresentasiOnline";
import AdminDashboard from "./src/pages/admin/AdminDashboard";
import AdminLayout from "./src/layout/AdminLayout";
import Approval from "./src/pages/admin/Appoval";
import PendataanAdmin from "./src/pages/admin/PendataanAdmin";
import PerusahaanLayout from "./src/layout/PerusahaanLayout";
import DashboardPerusahaan from "./src/pages/perusahaan/Dashboard";
import BerandaPerusahaan from "./src/pages/perusahaan/BerandaPerusahaan";
import CabangPerusahaan from "./src/pages/perusahaan/CabangPerusahaan";
import DetailCabang from "./src/pages/perusahaan/DetailCabang";
import Admin from "./src/pages/perusahaan/Admin";
import Mentor from "./src/pages/perusahaan/Mentor";
import Peserta from "./src/pages/perusahaan/Peserta";
import Divisi from "./src/pages/perusahaan/Divisi";
import Mitra from "./src/pages/perusahaan/Mitra";
import ApprovalPerusahaan from "./src/pages/perusahaan/Approval";
import Pendataan from "./src/pages/perusahaan/Pendataan";
import DataAbsensi from "./src/pages/perusahaan/Absensi";
import RFID from "./src/pages/perusahaan/RFID";
import Surat from "./src/pages/perusahaan/Surat";
import Lowongan from "./src/pages/perusahaan/lowongan";
import SettingsPerusahaan from "./src/pages/perusahaan/SettingsPerusahaan";
import Detailsmentor from "./src/components/cards/DetailMentor";
import DetailSiswa from "./src/components/cards/DetailSiswa";
import Gallery from "./src/pages/Gallery";
import Procedure from "./src/pages/Procedure";
import Contact from "./src/pages/Contact";
import Absensi from "./src/pages/student/Absensi";
import Jurnal from "./src/pages/student/Jurnal";
import PiketPeserta from "./src/pages/student/piket";
import Vacancy from "./src/pages/Vacancy";
import Presentasi from "./src/pages/student/Presentasi";
import DetailPresentasi from "./src/pages/student/DetailPresentasi";
import RiwayatPresentasi2 from "./src/pages/student/RiwayatPresentasi2";
import SelectAuth from "./src/pages/Auth/SelectAuth";
import GoogleSuccess from "./src/pages/Auth/GoogleSuccess";
import ForgotPassword from "./src/pages/Auth/ForgotPasword";
import VerificationCode from "./src/pages/Auth/VerificationCode";
import AuthLayout from "./src/layout/AuthLayout";
import CompanyRegistrationForm from "./src/pages/perusahaan/PerusahaanForm";
import DetailMentor from "./src/components/cards/DetailMentor";
import RegistrasiPeserta from "./src/pages/student/RegistrasiPeserta";
import Piket from "./src/pages/perusahaan/piket";
import Laporan from "./src/pages/perusahaan/Laporan";
import SettingCabang from "./src/pages/perusahaan/SettingCabang";
import Jamkantor from "./src/pages/perusahaan/Jam-kantor";
import VacancyDetails from "./src/pages/VacancyDetails";
import SettingPeserta from "./src/pages/student/SettingPeserta";
import DetailProjectPage from "./src/pages/student/DetailProjectPage";
import Presentasi2 from "./src/pages/student/Presentasi2";
import TrackRecordSiswa from "./src/pages/mentor/DetailPresentasi";
import CabangLayout from "./src/layout/CabangLayout";
import DataMentor from "./src/pages/admin/Mentor";
import DataPeserta from "./src/pages/admin/Peserta";
import DataApproval from "./src/pages/admin/Approval";
import DataDivisi from "./src/pages/admin/Divisi";
import DataPendataan from "./src/pages/admin/Pendataan";
import DataAbsensii from "./src/pages/admin/Absensi";
import DataSurat from "./src/pages/admin/Surat";
import DataRFID from "./src/pages/admin/RFID";
import DataPiket from "./src/pages/admin/Piket";
import DataJamkantor from "./src/pages/admin/Jam-kantor";
import ProjectCard from "./src/components/cards/ProjectCard";
import SuperadminLayout from "./src/layout/SuperadminLayout";
import DashboardSuperadmin from "./src/pages/superadmin/Dashboard";
import MitraDetails from "./src/components/section/MitraDetails";
import StatusProvider from "./src/pages/student/StatusContext";
import GoogleCallback from "./src/pages/Auth/GoogleCallback";

import DataPerusahaan from "./src/pages/superadmin/DataPerusahaan";
import MenuPerusahaan from "./src/pages/superadmin/MenuSuperadmin";
import CabangDashboard from "./src/pages/superadmin/CabangDashboard";
import Post from "./src/pages/superadmin/Post";
import CreatePost from "./src/components/cards/CreatePost";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/tentang",
        element: <About />,
      },
      {
        path: "/artikel",
        element: <Gallery />,
      },
      {
        path: "/prosedur",
        element: <Procedure />,
      },
      {
        path: "/hubungi-kami",
        element: <Contact />,
      },
      {
        path: "/lowongan",
        element: <Vacancy />,
      },
      {
        path: "/lowongan/:jobId",
        element: <VacancyDetails />,
      },
      {
        path: "mitradetails/:id",
        element: <MitraDetails/>
      }
    ],
  },
  {
    path: "/peserta",
    element: (
        <StatusProvider>
          <StudentLayout />
        </StatusProvider>
      ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "absensi",
        element: <Absensi />,
      },
      {
        path: "jurnal",
        element: <Jurnal />,
      },
      {
        path: "presentasi",
        element: <Presentasi />,
      },
      {
        path: "presentasi2",
        element: <Presentasi2 />,
      },
      {
        path: "detail-presentasi",
        element: <DetailPresentasi />,
      },
      {
        path: "riwayat-presentasi",
        element: <RiwayatPresentasi2 />,
      },
      {
        path: "settings",
        element: <RegistrasiPeserta />,
      },
      {
        path: "piket",
        element: <PiketPeserta />,
      },
      {
        path: "setting-peserta",
        element: <SettingPeserta />,
      },
      {
        path: "detail-project/:routeId",
        element: <DetailProjectPage />,
      },
      {
        path: "route-project",
        element: <ProjectCard />,
      },
    ],
  },
  {
    path: "/mentor",
    element: <MentorLayout1 />,
    children: [
      {
        path: "dashboard",
        element: <MentorDashboard />,
      },
      {
        path: "siswa",
        element: <DataSiswa />,
      },
      // {
      //   path: "track",
      //   element: <TrackRecord />,
      // },
      {
        path: "online",
        element: <OnlinePresentasi />,
      },
      {
        path: "siswa/:id",
        element: <TrackRecordSiswa />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "mentor",
        element: <DataMentor />,
      },
      {
          path: "peserta",
          element: <DataPeserta />,
        },
      {
        path: "approval",
        element: <DataApproval />,
      },
      {
        path: "pendataan",
        element: <PendataanAdmin />,
      },
      {
        path: "divisi",
        element: <DataDivisi />,
      },
      {
          path: "jurnal",
          element: <DataPendataan />,
        },
        {
          path: "absensi",
          element: <DataAbsensii />,
        },
        {
          path: "surat",
          element: <DataSurat />,
        },
        {
          path: "RFID",
          element: <DataRFID />,
        },
        {
          path: "piket",
          element: <DataPiket />,
        },
        {
          path: "jam-kantor",
          element: <DataJamkantor />,
        },
        {
          path: "mentor/:mentorId",
          element: <Detailsmentor />,
        },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "SelectAuth",
        element: <SelectAuth />,
      },
      {
        path: "google/success",
        element: <GoogleSuccess />,
      },
      {
        path: "google",
        element: <GoogleCallback />
      },
      {
        path: "ForgotPassword",
        element: <ForgotPassword />,
      },
      {
        path: "VerificationCode",
        element: <VerificationCode />,
      },
    ],
  },
  {
  path: "/perusahaan",
  element: <PerusahaanLayout />,
  children: [
    {
      path: "cabang",
      element: <CabangPerusahaan />,
    },       
    {
      path: "update-perusahaan/:id_perusahaan",
      element: <SettingsPerusahaan />,
    },
    {
      path: "settings",
      element: <CompanyRegistrationForm />,
    },
    {
      path: "lowongan",
      element: <Lowongan />,
    },
    {
      path: "mitra",
      element: <Mitra />,
    },
    {
      path: "dashboard",
      element: <DashboardPerusahaan />,
    },
    {
      path: "cabang/:namaCabang",
      element: <CabangLayout />, 
      children: [
        {
          index: true,
          element: <Navigate to="beranda" replace />
        },
        {
          path: "beranda",
          element: <BerandaPerusahaan />,
        },
        {
          path: "admin",
          element: <Admin />,
        },
        {
          path: "mentor",
          element: <Mentor />,
        },
        {
          path: "peserta",
          element: <Peserta />,
        },
        {
          path: "divisi",
          element: <Divisi />,
        },
        
        {
          path: "approval",
          element: <ApprovalPerusahaan />,
        },
        {
          path: "jurnal",
          element: <Pendataan />,
        },
        {
          path: "presensi",
          element: <DataAbsensi />,
        },
        {
          path: "surat",
          element: <Surat />,
        },
        {
          path: "RFID",
          element: <RFID />,
        },
        {
          path: "mentor/:mentorId",
          element: <Detailsmentor />,
        },
        {
          path: "detail-siswa",
          element: <DetailSiswa />,
        },
        {
          path: "detailmentor",
          element: <DetailMentor />,
        },
        {
          path: "piket",
          element: <Piket />,
        },
        {
          path: "jam-kantor",
          element: <Jamkantor />,
        },
        {
          path: "laporan",
          element: <Laporan />,
        },
        {
          path: "settings-cabang",
          element: <SettingCabang />,
        },
      ]
    }
  ]
},
{
  path: "/superadmin",
  element: <SuperadminLayout />,
  children: [
    {
      path: "dashboard",
      element: <DashboardSuperadmin/>
    },
    {
      path: "DataPerusahaan",
      element: <DataPerusahaan/>
    },
    {
      path: "MenuPerusahaan",
      element: <MenuPerusahaan/>
    },
    {
      path: "Cabang",
      element: <DataPerusahaan/>
    },
    {
      path: "CabangDashboard",
      element: <CabangDashboard/>
    },
    {
      path: "post",
      element: <Post/>
    },
    {
      path: "Create-Post",
      element: <CreatePost/>
    }
  ]
},
  {
    path: "/google/success",
    element: <GoogleSuccess />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);