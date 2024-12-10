"use client";

import React from "react";
import HotArticles from "../HotArticles/page";
const HomePage = () => {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-center my-8">Bài Báo Nổi Bật</h1>
      <HotArticles />
    </div>
  );
};

export default HomePage;
