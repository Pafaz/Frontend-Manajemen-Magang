import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    try {
      localStorage.setItem("token", tokenFromUrl.toString());
    } catch (error) {
      console.log("error, " + error)
    }
    
    if (tokenFromUrl) {
      setTimeout(() => {
        setLoading(false);
        window.location.href = "http://localhost:5173/perusahaan/dashboard"
      }, 3000);
    } else {
      alert("Login gagal. Token tidak ditemukan.");
      // localStorage.removeItem("token");
      navigate("/auth/SelectAuth");
    }
  }, [navigate, searchParams]);

  if (loading) {
    return (
      <div className="w-full flex h-screen">
        <div className="flex-[2] bg-slate-200 animate-pulse py-10 px-5">
          <div className="bg-slate-300 rounded-xl w-full h-32 animate-pulse"></div>
          <div className="flex flex-col gap-3 mt-5">
            {Array(12)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="w-full h-8 rounded-lg animate-pulse bg-slate-300"
                ></div>
              ))}
          </div>
        </div>

        <div className="flex-[8] bg-slate-50 p-6 animate-pulse overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="w-full h-32 bg-slate-300 rounded-xl animate-pulse"
                ></div>
              ))}
          </div>
          <div className="bg-slate-200 rounded-xl w-full h-80 mt-5"></div>
        </div>
      </div>
    );
  }
};

export default GoogleSuccess;
