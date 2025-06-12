import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function MentorDetail() {
  const { mentorId } = useParams();
  const [mentor, setMentor] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMentorData = () => {
      setIsLoading(true);

      const mentorData = {
        id: mentorId,
        name: getMentorName(mentorId),
        division: getMentorDivision(mentorId),
        email: getMentorEmail(mentorId),
        profileImage: "/assets/img/Profil.png",
      };

      const studentData = Array(12).fill().map((_, index) => ({
        id: index + 1,
        name: "Gojo Satoru",
        email: "jrs.Contact@gmail.com",
        school: "SMAN 12 MALANG",
        status: "Offline",
        photo: "/assets/img/Profil.png",
      }));

      setMentor(mentorData);
      setStudents(studentData);
      setIsLoading(false);
    };

    fetchMentorData();
  }, [mentorId]);

  const getMentorName = (id) => "Anya Forger";
  const getMentorDivision = (id) => "UI/UX DESIGNER";
  const getMentorEmail = (id) => "info@gmail.com";

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F4FF] p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6 flex flex-col lg:flex-row gap-6">
        {/* Left Section - Mentor Detail */}
        <div className="w-full lg:w-1/4 border-r pr-4">
          <h2 className="text-xl font-bold mb-6">Detail Mentor</h2>
          <div className="flex flex-col items-center text-center">
            <img
              src={mentor.profileImage}
              alt={mentor.name}
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h3 className="text-2xl font-bold">{mentor.name}</h3>
            <div className="text-blue-500 font-semibold mt-2 text-sm">
              {mentor.division}
            </div>
            <div className="text-gray-500 text-sm mt-2">{mentor.email}</div>
          </div>
        </div>

        {/* Right Section - Students List */}
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <h2 className="text-xl font-bold mb-4 md:mb-0">Detail Siswa Bimbingan</h2>
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border-b font-medium text-gray-500">No</th>
                <th className="p-3 border-b font-medium text-gray-500">Nama</th>
                <th className="p-3 border-b font-medium text-gray-500">Email</th>
                <th className="p-3 border-b font-medium text-gray-500">Sekolah</th>
                <th className="p-3 border-b font-medium text-gray-500">Jenis Mapping</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{index + 1}</td>
                  <td className="p-3 border-b">
                    <div className="flex items-center">
                      <img
                        src={student.photo}
                        alt={student.name}
                        className="h-8 w-8 rounded-full mr-3 object-cover"
                      />
                      <span>{student.name}</span>
                    </div>
                  </td>
                  <td className="p-3 border-b text-gray-700">{student.email}</td>
                  <td className="p-3 border-b text-gray-700">{student.school}</td>
                  <td className="p-3 border-b">
                    <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}
