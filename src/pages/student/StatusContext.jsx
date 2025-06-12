// StatusContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

export const StatusContext = createContext();

export const StatusProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [profileComplete, setProfileComplete] = useState(JSON.parse(sessionStorage.getItem("profileComplete")) || false);
  const [internshipStatus, setInternshipStatus] = useState("menunggu");
  const [userLoading, setUserLoading] = useState(true);
  console.log(profileComplete, internshipStatus);
  
  const fetchUserData = async () => {
    try {
      if (!token) return;

      setUserLoading(true); // Penting agar UI bisa render loading saat proses

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/complete/peserta`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data.data;

      setProfileComplete(data.is_profil_lengkap);
      setInternshipStatus(data.is_magang);
      setRole("peserta");
      
      // Simpan ke sessionStorage sebagai cache
      sessionStorage.setItem("profileComplete", JSON.stringify(data.is_profil_lengkap));
      sessionStorage.setItem("internshipStatus", JSON.stringify(data.is_magang));

    } catch (error) {
      console.error("Gagal fetch data user:", error);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    const savedProfileComplete = sessionStorage.getItem("profileComplete");
    const savedInternshipStatus = sessionStorage.getItem("internshipStatus");

    if (savedProfileComplete && savedInternshipStatus) {
      setProfileComplete(JSON.parse(savedProfileComplete));
      setInternshipStatus(JSON.parse(savedInternshipStatus));
      setUserLoading(false);
    } else {
      fetchUserData();
    }
  }, [token]);

  return (
    <StatusContext.Provider
      value={{
        role,
        setRole,
        profileComplete,
        internshipStatus,
        userLoading,
        refreshUserData: fetchUserData,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
};

export default StatusProvider;
