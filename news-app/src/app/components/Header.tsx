'use client'

import { useState, useEffect, useContext } from "react";
import { Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { UserContext } from "@/app/AppProvider";
import { LogOut } from "lucide-react";
import { clientSessionToken } from "@/lib/http";

const Header = () => {

  const router = useRouter();
  const [dateTime, setDateTime] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const [isHoveredProfile, setIsHoveredProfile] = useState<boolean>(false);

  const getCurrentDateTime = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    return (
      <>
        <div className="text-sm text-gray-500">
          <span>{`${hours}:${minutes}:${seconds}`}</span>
        </div>
        <div className="text-sm text-gray-500">
          <span>{`${day}/${month}/${year}`}</span>
        </div>
      </>
    );
  };

  useEffect(() => {
    setDateTime(getCurrentDateTime());
    const interval = setInterval(() => {
      setDateTime(getCurrentDateTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        setUser(null);
        sessionStorage.removeItem('user');
        clientSessionToken.value = null;
        router.push('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  return (
    <header className="p-3 border-b-2">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">

        <div className="flex items-center space-x-6">
          <h1 className="text-3xl font-bold text-[#3498db] hover:cursor-pointer" onClick={() => router.push("/")}>
            NEWS
          </h1>
          <span className="text-sm text-gray-500">{dateTime}</span>
        </div>

        <div className="flex items-center space-x-[30px]">
          {user?.is_staff === true && (
            <>
              <div
                className="text-xl hover:cursor-pointer hover:underline hover:bg-[#3498db] rounded-md p-[6px]"
                onClick={() => router.push('/admin/articles/')}
              >
                Articles
              </div>
              <div
                className="text-xl hover:cursor-pointer hover:underline hover:bg-[#3498db] rounded-md p-[6px]"
                onClick={() => router.push('/admin/categories/')}
              >
                Categories
              </div>
              <div
                className="text-xl hover:cursor-pointer hover:underline hover:bg-[#3498db] rounded-md p-[6px]"
                onClick={() => router.push('/admin/users/')}
              >
                User
              </div>
              <div
                className="text-xl hover:cursor-pointer hover:underline hover:bg-[#3498db] rounded-md p-[6px]"
                // onClick={() => router.push('/admin/categories/')}
              >
                Decentralization
              </div>
              <div
                className="flex items-center text-xl relative text-center hover:underline hover:cursor-pointer hover:bg-[#3498db] rounded-md p-[6px]"
                onMouseEnter={() => setIsHoveredProfile(true)}
                onMouseLeave={() => setIsHoveredProfile(false)}
                onClick={() => router.push(`/profile/${user.id}`)}
              >
                <div className="mr-1"><UserOutlined /></div>
                Trang cá nhân
                {isHoveredProfile && (
                  <div className="absolute z-30 w-full left-0 top-[41px] rounded-lg">
                    <Button
                      icon={<LogOut />}
                      className="z-[1] hover:underline hover:cursor-pointer text-center w-full text-black rounded-lg"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
          {user?.is_staff === false && (
            <div
              className="flex items-center text-xl relative text-center hover:underline hover:cursor-pointer hover:bg-[#3498db] rounded-md p-[6px]"
              onMouseEnter={() => setIsHoveredProfile(true)}
              onMouseLeave={() => setIsHoveredProfile(false)}
              onClick={() => router.push(`/profile/${user.id}`)}
            >
              <div className="mr-1"><UserOutlined /></div>
              Trang cá nhân
              {isHoveredProfile && (
                <div className="absolute z-30 w-full left-0 top-[41px] rounded-lg">
                  <Button
                    icon={<LogOut />}
                    className="z-[1] hover:underline hover:cursor-pointer text-center w-full text-black rounded-lg"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </Button>
                </div>
              )}
            </div>
          )}
          {user === null && (
            <Button
              icon={<UserOutlined />}
              onClick={() => router.push("/login")}
              className="flex items-center space-x-2 text-xl"
            >
              Đăng nhập
            </Button>
          )}
        </div>
      </div>
    </header >
  );
};

export default Header;