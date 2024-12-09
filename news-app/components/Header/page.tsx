"use client";

import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { UserOutlined } from "@ant-design/icons";

const Header = () => {
  const getCurrentDateTime = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
  };

  const [dateTime, setDateTime] = useState(null);

  useEffect(() => {
    setDateTime(getCurrentDateTime());
    const interval = setInterval(() => {
      setDateTime(getCurrentDateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // if (dateTime === null) {
  //   return <div>Loading...</div>;
  // }

  return (
    <header className="bg-white p-6">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-3xl font-bold text-red-600">New App</h1>
          <span className="text-lg text-red-400">{dateTime}</span>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            type="white"
            icon={<UserOutlined />}
            className="flex items-center space-x-2 text-xl"
          >
            Đăng nhập
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
