import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { backendUrl, token, navigate } = useContext(ShopContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(backendUrl + "/api/user/profile", {
          headers: { token },
        });

        if (response.data.success) {
          setUserData(response.data.user);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, backendUrl, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading Profile...</p>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-14 p-8 border rounded-lg shadow-sm text-gray-800">
      <div className="inline-flex items-center gap-2 mb-6">
        <p className="prata-regular text-3xl">My Profile</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-4xl font-light text-gray-700">
          {userData.name ? userData.name[0].toUpperCase() : "U"}
        </div>
        <div>
          <h1 className="text-3xl font-medium mb-1">{userData.name}</h1>
          <p className="text-gray-500">{userData.email}</p>
        </div>
      </div>

      <hr className="my-6 border-gray-200" />

      <div className="space-y-4">
        <div className="flex justify-between items-center py-2">
          <p className="font-medium text-gray-600">Account Status</p>
          <span
            className={`px-4 py-1 rounded-full text-sm font-medium ${userData.isVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {userData.isVerified ? "Verified" : "Unverified"}
          </span>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => navigate("/orders")}
          className="flex-1 bg-black text-white px-4 py-3 font-light active:bg-gray-700 transition"
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default Profile;
