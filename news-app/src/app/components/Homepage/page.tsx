"use client";

import React from "react";
import NewArticles from "../NewArticles/page";
const HomePage = () => {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-center my-8">Tin Mới</h1>
      <NewArticles />
    </div>
  );
};

export default HomePage;
