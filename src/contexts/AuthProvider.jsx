import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("token") || sessionStorage.getItem("token")
  );
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [errors, setErrors] = useState(null);
  // const [idCabang , setIdcabang] = useState(null);
  const [tempRegisterData, setTempRegisterData] = useState(null);

  const getUser = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/get-user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;

      if (data.status === "success") {
        setRole(data.data.role);
        setUser(data.data.user);
      } else {
        setToken(null);
        setUser(null);
        setRole(null);
        setErrors(data.errors || { error: data.error });
        // localStorage.removeItem("token");
        // sessionStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Gagal ambil data user:", error);
      setToken(null);
      setUser(null);
      setRole(null);
      setErrors({ error: "Gagal terhubung ke server" });
      // localStorage.removeItem("token");
      // sessionStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      getUser();
      localStorage.setItem("token", token);
    }
  }, [token, getUser]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        role,
        setRole,
        errors,
        tempRegisterData,
        setTempRegisterData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
