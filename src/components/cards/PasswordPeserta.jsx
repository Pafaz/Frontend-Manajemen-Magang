import React, { useState } from "react";
import axios from "axios";
import { EyeOff, Eye, Info, CheckCircle } from "lucide-react";

export default function PengaturanPasswordCard() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const handleSubmit = async () => {
    const frontendErrors = {};

    const validations = validatePassword(newPassword);
    if (!validations.length) frontendErrors.new_password = ["Password minimal 8 karakter."];
    if (!validations.uppercase) frontendErrors.new_password = [...(frontendErrors.new_password || []), "Harus ada huruf besar."];
    if (!validations.special) frontendErrors.new_password = [...(frontendErrors.new_password || []), "Harus ada karakter khusus."];
    if (newPassword !== confirmPassword) frontendErrors.new_password = [...(frontendErrors.new_password || []), "Konfirmasi password tidak cocok."];

    if (Object.keys(frontendErrors).length > 0) {
      setErrors(frontendErrors);
      return;
    }

    try {
      setStatus("loading");
      setErrors({});
      await axios.post(
        `${import.meta.env.VITE_API_URL}/update-password`,
        {
          old_password: oldPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setStatus("success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setStatus("error");
      const apiErrors = err?.response?.data?.meta || {};
      setErrors(apiErrors);
      console.log(errors);
    }
  };

  const validations = validatePassword(newPassword);

  const renderIcon = (isValid) => (isValid ? <CheckCircle size={16} className="mr-1 flex-shrink-0 mt-px text-green-600" /> : <Info size={16} className="mr-1 flex-shrink-0 mt-px text-blue-500" />);

  const renderClass = (isValid) => (isValid ? "text-green-600" : "text-gray-700");

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-8xl w-full">
      <h2 className="text-lg font-medium mb-4">Pengaturan Password</h2>

      {/* Password Lama */}
      <div className="mb-6">
        <label className="text-sm font-medium">Password Lama</label>
        <div className="relative w-1/2 mt-1">
          <input type={showOld ? "text" : "password"} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg pr-10" />
          <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-2 top-1/2 transform -translate-y-1/2">
            {showOld ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
        {errors.old_password && <p className="text-xs text-red-500 mt-1">{errors.old_password[0]}</p>}
      </div>

      {/* Password Baru */}
      <div className="mb-6">
        <label className="text-sm font-medium">Password Baru</label>
        <div className="relative w-1/2 mt-1">
          <input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg pr-10" />
          <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-2 top-1/2 transform -translate-y-1/2">
            {showNew ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
        {errors.new_password &&
          errors.new_password.map((err, i) => (
            <p key={i} className="text-xs text-red-500 mt-1">
              {err}
            </p>
          ))}
      </div>

      {/* Konfirmasi Password */}
      <div className="mb-6">
        <label className="text-sm font-medium">Konfirmasi Password</label>
        <div className="relative w-1/2 mt-1">
          <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg pr-10" />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2 top-1/2 transform -translate-y-1/2">
            {showConfirm ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
      </div>

      {/* Persyaratan Password */}
      <div className="mb-4">
        <label className="text-sm font-medium">Persyaratan Password:</label>
        <ul className="mt-2 text-xs">
          <li className="flex items-start mb-1">
            {renderIcon(validations.length)}
            <span className={renderClass(validations.length)}>Minimal 8 karakter</span>
          </li>
          <li className="flex items-start mb-1">
            {renderIcon(validations.uppercase)}
            <span className={renderClass(validations.uppercase)}>Setidaknya satu huruf besar</span>
          </li>
          <li className="flex items-start">
            {renderIcon(validations.special)}
            <span className={renderClass(validations.special)}>Setidaknya satu karakter khusus (!@#$...)</span>
          </li>
        </ul>
      </div>

      {/* Tombol Simpan */}
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition">
        Simpan Perubahan
      </button>

      {/* Status */}
      {status === "loading" && <p className="text-sm mt-2 text-gray-500">Menyimpan...</p>}
      {status === "success" && <p className="text-sm mt-2 text-green-600">Password berhasil diperbarui.</p>}
      {status === "error" && !errors.new_password && <p className="text-sm mt-2 text-red-600">Terjadi kesalahan saat menyimpan.</p>}
    </div>
  );
}
