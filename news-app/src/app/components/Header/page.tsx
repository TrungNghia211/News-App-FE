"use client";  

import React, { useState, useEffect } from "react";
import { Button, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import jwt from 'jsonwebtoken';
import { clientSessionToken } from "@/lib/http";
import useCustomToast from "../../../../utils/toast";

const { Search } = Input;

const Header = () => {
  const router = useRouter();
  const sessionToken = clientSessionToken.value;
  const decoded = jwt.decode(sessionToken);
  const {success, error} = useCustomToast();
  
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

  const [dateTime, setDateTime] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    setDateTime(getCurrentDateTime());
    const interval = setInterval(() => {
      setDateTime(getCurrentDateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const onSearch = debounce((value: string) => {
    console.log("Search value:", value);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };
  const handleLoginClick = () => {
    router.push("/login");
  };
  const handleProfileClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!sessionToken){
      error("Vui lòng đăng nhập !!!")
    } else{
      router.push(`/profile/${decoded.user_id}/`);
    }
  };

  return (
    <header className="bg-white p-6">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-3xl font-bold text-green-600" onClick={() => router.push("/")}>
            NEW APP
          </h1>
          <span className="text-sm text-gray-500">{dateTime}</span>
          {/* <Search
            placeholder="Search articles"
            value={searchValue}
            onChange={handleSearchChange}
            onSearch={onSearch}
            className="mr-4 w-72 text-lg p-3"
          /> */}
        </div>
        <div className="flex items-center space-x-3">
          
          <Button
            type="white"
            icon={<UserOutlined />}
            onClick={handleProfileClick}
            className="flex items-center space-x-2 text-xl hover:bg-yellow-400"
          >
            Profile
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          
          <Button
            type="white"
            icon={<UserOutlined />}
            onClick={handleLoginClick}
            className="flex items-center space-x-2 text-xl hover:bg-yellow-400"
          >
            Đăng nhập
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
