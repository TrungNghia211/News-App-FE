"use client";

import ArticlesByCategory from "@/app/components/ArticlesCategoryID/page";
import Header from "@/app/components/Header";
import HotArticles from "@/app/components/HotArticles/page";
import MenuComponent from "@/app/components/Menu/page";
import NewArticles from "@/app/components/NewArticles/page";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoryPage() {
  const params = useParams();
  const categoryId = decodeURIComponent(params.categoryId || '');
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoryId) {
      getCategoryName(categoryId);
      getArticlesByCategory(categoryId);
    }
  }, [categoryId]);

  const getCategoryName = async (categoryId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/categories/${categoryId}/`);
      if (!response.ok) {
        throw new Error("Failed to fetch category name");
      }
      const data = await response.json();
      setCategoryName(data.name || "Category Not Found");
    } catch (error) {
      console.error("Error fetching category name:", error);
      setCategoryName("Error fetching category name");
    }
  };

  const getArticlesByCategory = async (categoryId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/articles/category/${categoryId}/`);
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      setError("Error fetching articles");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <MenuComponent />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-[0.1rem]">
        <div className="p-4 rounded-lg">
          <h2 className="text-2xl font-bold text-center mt-20 text-green-500">Tin Mới</h2>
          <div>
            <NewArticles />
          </div>
        </div>
        <div className="p-4 rounded-lg col-span-2  w-full">
          <div className="text-4xl font-bold mt-4">
            {categoryName}
          </div>
          <ArticlesByCategory categoryId={categoryId} />
        </div>
        <div className="p-4 rounded-lg">
          <h2 className="text-2xl font-bold text-center text-red-600 mt-20">Tin Nổi Bật Trong Tuần</h2>
          <div>
            <HotArticles />
          </div>
        </div>
      </div>
    </>
  );
}