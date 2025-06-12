import { useState } from "react";
import Post from "../../components/cards/Post";

const ManajemenPost = () => {
  return (
    <div className="p-2">
      {/* Komponen BerandaBranchCard */}
      <div className="pb-2">
      <Post />
      </div>
    </div>
  );
};

export default ManajemenPost;