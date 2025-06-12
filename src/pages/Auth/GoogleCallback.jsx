import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

function GoogleCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setRole, setToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {

    const authenticateWithGoogle = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/callback${location.search}`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        );

        const { data } = response;
        
        if (data.status !== 'success') {
          throw new Error(data.message || 'Autentikasi gagal');
        }

        const { user, role } = data.data;

        if (role == null) {
          sessionStorage.setItem('id', user.id);
          navigate("/auth/SelectAuth");
        } else {
          localStorage.setItem('user', JSON.stringify(user));
          setRole(role);
          navigate(`/${role}/dashboard`, { replace: true });
        }
      } catch (error) {
        console.error('Google auth error:', error);
        setError(error.response?.data?.message || 'Gagal menyambungkan dengan Google. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    authenticateWithGoogle();
  }, [location.search, navigate, setRole, setToken]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-lg">
          <p className="text-red-500 text-center font-medium">Oops! Terjadi Kesalahan saat menghubungkan akun Google</p>
          <p className="text-red-500 text-center font-medium">Silahkan kembali ke halaman login dan coba lagi</p>
          <button 
            onClick={() => navigate('/auth/login', { replace: true })}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-lg">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 text-center font-medium">Menyambungkan akun Google Anda...</p>
        </div>
      </div>
    );
  }

  return null;
}

export default GoogleCallback;