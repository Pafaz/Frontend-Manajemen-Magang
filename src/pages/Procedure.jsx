import React from "react";
import Banner from "../components/Banner";
import { Play, Building2, FileText, LogIn, CheckCircle, Folder, GraduationCap, Clock, Building, Briefcase, Award, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

// Simple motion components since we can't import framer-motion
const MotionDiv = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 200);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const procedures = {
  company: [
    {
      title: "Mulai",
      description: "Prosedur magang dimulai.",
      icon: Play,
    },
    {
      title: 'Klik "Daftar sebagai Perusahaan"',
      description: "Mulai proses pendaftaran dengan memilih opsi 'Daftar sebagai Perusahaan' di website manajemen.hummatech.com",
      icon: Building2,
    },
    {
      title: "Isi Formulir Registrasi",
      description: "Lengkapi data perusahaan dan unggah dokumen yang diperlukan.",
      icon: FileText,
    },
    {
      title: "Login ke Akun",
      description: "Setelah pendaftaran berhasil, login menggunakan email dan password yang telah didaftarkan.",
      icon: LogIn,
    },
    {
      title: "Selesai",
      description: "Akun perusahaan aktif dan siap digunakan untuk mengelola absensi serta magang.",
      icon: CheckCircle,
    },
  ],
  student: [
    {
      title: "Mulai",
      description: "Prosedur magang dimulai.",
      icon: Play,
    },
    {
      title: "Siapkan Berkas",
      description: "Siap dan lengkapi berkas persyaratan seperti CV, surat pengantar dan lain-lain.",
      icon: Folder,
    },
    {
      title: 'Klik "Daftar sebagai Siswa Magang"',
      description: "Mulai proses pendaftaran dengan memilih opsi 'Daftar sebagai Siswa Magang'.",
      icon: GraduationCap,
    },
    {
      title: "Menunggu Persetujuan",
      description: "Setelah data lengkap dan benar menunggu persetujuan admin untuk proses selanjutnya.",
      icon: Clock,
    },
    {
      title: "Penetapan Divisi",
      description: "Setelah diterima di perusahaan, siswa akan ditempatkan di divisi sesuai dengan bidang keahlian.",
      icon: Building,
    },
    {
      title: "Magang Dimulai",
      description: "Siswa sudah bisa memulai magang sesuai dengan jadwal yang telah ditentukan.",
      icon: Briefcase,
    },
    {
      title: "Sertifikat Magang",
      description: "Setelah menyelesaikan masa magang, siswa akan mendapatkan sertifikat.",
      icon: Award,
    },
    {
      title: "Selesai",
      description: "Proses magang selesai dan siswa dapat mengakses sertifikat di dashboard.",
      icon: CheckCircle2,
    },
  ],
};

export default function RegistrationProcedure() {
  // Floating elements component
  const FloatingElements = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating circles with various animations */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-30 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-40 animate-ping" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-indigo-200 rounded-full opacity-35 animate-pulse" style={{animationDelay: '2s', animationDuration: '2.5s'}}></div>
      <div className="absolute top-60 left-1/2 w-14 h-14 bg-pink-200 rounded-full opacity-30 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3.5s'}}></div>
      <div className="absolute bottom-20 right-10 w-18 h-18 bg-green-200 rounded-full opacity-25 animate-ping" style={{animationDelay: '1.5s', animationDuration: '5s'}}></div>
      
      {/* Zoom in/out circles */}
      <div className="absolute top-96 left-16 w-24 h-24 bg-cyan-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '0s'}}></div>
      <div className="absolute top-32 right-32 w-16 h-16 bg-rose-200 rounded-full opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-80 right-16 w-20 h-20 bg-emerald-200 rounded-full opacity-25 animate-pulse" style={{animationDelay: '1s'}}></div>
      
      {/* Floating squares and shapes */}
      <div className="absolute top-80 right-40 w-8 h-8 bg-yellow-200 opacity-20 rotate-45 animate-spin" style={{animationDelay: '0s', animationDuration: '8s'}}></div>
      <div className="absolute bottom-60 left-40 w-10 h-10 bg-red-200 opacity-25 rotate-12 animate-pulse" style={{animationDelay: '2s', animationDuration: '3s'}}></div>
      <div className="absolute top-48 left-32 w-6 h-12 bg-violet-200 opacity-30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-48 right-48 w-12 h-6 bg-amber-200 opacity-25 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
      
      {/* Moving elements */}
      <div className="absolute top-32 animate-pulse">
        <div className="w-6 h-6 bg-blue-300 rounded-full opacity-40"></div>
      </div>
      <div className="absolute bottom-32 right-0 animate-bounce">
        <div className="w-8 h-8 bg-purple-300 rounded-full opacity-35"></div>
      </div>
      <div className="absolute top-72 animate-ping">
        <div className="w-10 h-10 bg-teal-300 rounded-full opacity-30"></div>
      </div>
      <div className="absolute bottom-72 left-0 animate-pulse">
        <div className="w-7 h-7 bg-orange-300 rounded-full opacity-35"></div>
      </div>
      
      {/* Rotating decorative elements */}
      <div className="absolute top-24 left-1/3 animate-spin" style={{animationDuration: '10s'}}>
        <div className="w-4 h-4 bg-indigo-300 rounded-full opacity-40"></div>
      </div>
      <div className="absolute bottom-24 right-1/3 animate-spin" style={{animationDuration: '12s'}}>
        <div className="w-5 h-5 bg-pink-300 rounded-full opacity-35"></div>
      </div>
      
      {/* Decorative icons scattered around */}
      <div className="absolute top-16 left-1/4 text-2xl opacity-30 animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}>⭐</div>
      <div className="absolute top-52 right-1/4 text-3xl opacity-25 animate-pulse" style={{animationDelay: '2s'}}>✨</div>
      <div className="absolute bottom-36 left-1/3 text-2xl opacity-30 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3s'}}>🎯</div>
      <div className="absolute bottom-16 right-1/3 text-2xl opacity-25 animate-pulse" style={{animationDelay: '1.5s'}}>🚀</div>
      <div className="absolute top-40 left-3/4 text-2xl opacity-30 animate-spin" style={{animationDelay: '0s', animationDuration: '6s'}}>⚡</div>
      <div className="absolute bottom-52 left-1/6 text-2xl opacity-25 animate-bounce" style={{animationDelay: '2.5s', animationDuration: '3.5s'}}>💼</div>
    </div>
  );

  const CompanySteps = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
        {procedures.company.map((step, index) => {
          const IconComponent = step.icon;
          return (
            <MotionDiv key={index} delay={index} className="flex flex-col items-center text-center">
              <div className="relative mb-6 group cursor-pointer">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <IconComponent className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 hover:text-blue-600 transition-colors duration-300">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
            </MotionDiv>
          );
        })}
      </div>
    );
  };

  const StudentSteps = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
      {procedures.student.map((step, index) => {
        const IconComponent = step.icon;
        return (
          <MotionDiv key={index} delay={index} className="flex flex-col items-center text-center">
            <div className="relative mb-6 group cursor-pointer">
              <div className="w-18 h-18 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                {index + 1}
              </div>
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-3 hover:text-purple-600 transition-colors duration-300">{step.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
          </MotionDiv>
        );
      })}
    </div>
  );

  return (
    <>
      <Banner
        title="Prosedur"
        subtitle="Beranda → Prosedur"
        backgroundImage="/assets/img/banner/study_tim.jpg"
        possitionIlustration="right-0 top-18 w-full h-screen z-10"
        ilustration="ilustration_blue"
      />
      
      <div className="py-16 bg-white min-h-screen relative">
        {/* Floating animated elements - only in content area, not overlapping banner */}
        <FloatingElements />
        
        {/* Decorative bell */}
        <div className="absolute top-10 right-10 text-4xl animate-bounce z-10">🔔</div>
        
        {/* Company Registration Section */}
        <section className="max-w-7xl mx-auto px-4 mb-24 relative z-10">
          <MotionDiv delay={0} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Prosedur Pendaftaran Perusahaan
            </h2>
          </MotionDiv>
          
          <div className="py-16">
            <CompanySteps />
          </div>
        </section>

        {/* Student Registration Section */}
        <section className="max-w-7xl mx-auto px-4 relative z-10">
          <MotionDiv delay={0} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Prosedur Pendaftaran Magang
            </h2>
          </MotionDiv>
          
          <div className="py-12">
            <StudentSteps />
          </div>
        </section>
      </div>
    </>
  );
}