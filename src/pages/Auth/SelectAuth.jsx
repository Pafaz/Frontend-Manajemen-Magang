import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { motion } from "framer-motion";

const SelectAuth = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const { tempRegisterData, setRole, setToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const id = sessionStorage.getItem('id');

  useEffect(() => {
    if (!tempRegisterData && !id) {
      navigate("/auth/register");
    }
  }, [tempRegisterData, id, navigate]);

  const cardData = [
    {
      title: "Daftar sebagai Perusahaan",
      description:
        "Akses dashboard untuk kelola siswa magang, pantau progress dan komunikasi langsung.",
      illustration: "/assets/icons/Company-rafiki.svg",
      type: "perusahaan",
    },
    {
      title: "Daftar sebagai Siswa Magang",
      description:
        "Dapatkan pengalaman magang, kelola tugas dan interaksi dengan pembimbing perusahaan.",
      illustration: "/assets/icons/students-amico.svg",
      type: "peserta",
    },
  ];

  const handleNext = async (e) => {
    e.preventDefault();
    if (!selected) return;

    try {
      setLoading(true);
      const data = {
        id_user: tempRegisterData?.id || id,
        role: selected,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/assign/${selected}`,
        data
      );

      const { role, token } = response.data.data;
      setToken(token);
      
      if (role) {
        setRole(role);
        navigate(`/${role}/dashboard`);
        setLoading(false);
        sessionStorage.removeItem('id');
      } else {
        setErrors({
          message: response.data.message || "Login failed. Try again.",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Pendaftaran gagal:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white relative px-6 pt-10 pb-8">
      <div className="absolute top-6 left-6">
        <img src="/assets/img/Logo.png" alt="Logo" className="w-4/5" />
      </div>

      <div className="text-center mt-10">
        <h1 className="text-4xl font-bold text-sky-800">Pilih Jenis Akun</h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Silakan pilih apakah kamu ingin mendaftar sebagai perusahaan atau
          siswa magang.
        </p>
      </div>

      <div className="flex justify-center items-center gap-8 flex-wrap">
        {cardData.map((card) => (
          <motion.div
            key={card.type}
            onClick={() => setSelected(card.type)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`relative w-[320px] p-6 rounded-2xl shadow-md transition-all duration-300 cursor-pointer border-2 ${selected === card.type
                ? "border-sky-700 bg-blue-50 border-dotted"
                : "border-gray-200 bg-white"
              }`}
          >
            <div
              className={`absolute top-4 left-4 w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${selected === card.type
                  ? "border-sky-800 bg-sky-800"
                  : "border-gray-300 bg-white"
                }`}
            >
              {selected === card.type && (
                <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
              )}
            </div>

            <img
              src={card.illustration}
              alt={card.title}
              className="w-42 h-42 mx-auto mb-4"
            />
            <h2 className="text-sm font-semibold text-center text-sky-800 mb-2">
              {card.title}
            </h2>
            <p className="text-sm font-light text-gray-600 text-center">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-12 px-6">
        <a
          href="/"
          className="hover:text-sky-800 text-gray-500 font-medium text-lg"
        >
          ← Back
        </a>
        <a
          href="#"
          onClick={handleNext}
          className={`text-lg font-medium ${!selected
              ? "text-gray-400 opacity-80 cursor-not-allowed"
              : "text-sky-800 hover:text-sky-700"
            }`}
        >
          {loading ? "Loading..." : "Next →"}
        </a>
      </div>
    </div>
  );
};

export default SelectAuth;
