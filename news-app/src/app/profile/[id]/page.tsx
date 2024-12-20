"use client";

import { useEffect, useState } from "react";
import { clientSessionToken } from "@/lib/http";
import Header from "@/app/components/Header/page";
import MenuComponent from "@/app/components/Menu/page";
import { useRouter } from "next/navigation";
import useCustomToast from "../../../../utils/toast";
import CommentedList from "@/app/components/CommentUser/page";

export default function ProfilePage({ params }) {
  const { id } = params;
  const sessionToken = clientSessionToken.value;
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {success} = useCustomToast();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/users/${id}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await res.json();

        setUserData({
          email: data.email || "",
          username: data.username || "",
          phone: data.phone || "",
          birthday: data.birthday || "",
          address: data.address || "",
          description: data.description || "",
        });
      } catch (error) {
        alert("Token không hợp lệ hoặc hết hạn. Vui lòng đăng nhập lại.");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, sessionToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        throw new Error("Không thể cập nhật thông tin người dùng");
      }

      success("Thông tin đã được cập nhật thành công!");
      router.push(`/profile/${id}`);
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-6">
        <div className="w-12 h-12 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold text-red-500">{error}</h2>
      </div>
    );
  }

  return (
    <>
      <Header />
      <MenuComponent />
      <div className="p-4">
        <div className="p-4 mb-4">
          <h2 className="text-3xl font-semibold mb-4">User Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={userData?.username || ""}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    className="border rounded-md w-full p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="birthday"
                    value={userData?.birthday || ""}
                    onChange={handleInputChange}
                    className="border rounded-md w-full p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userData?.email || ""}
                    readOnly
                    className="border rounded-md w-full p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userData?.phone || ""}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="border rounded-md w-full p-2"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={userData?.address || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  className="border rounded-md w-full p-2"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">About Me</label>
                <textarea
                  name="description"
                  rows={4}
                  value={userData?.description || ""}
                  onChange={handleInputChange}
                  placeholder="Describe yourself"
                  className="border rounded-md w-full p-2"
                />
              </div>
            </div>

            <div className="text-right mt-4">
              <button
                type="submit"
                className="bg-yellow-400 text-white text-lg px-8 py-2 rounded-md"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
      <div>
        <CommentedList/>
      </div>
      
    </>
  );
}
