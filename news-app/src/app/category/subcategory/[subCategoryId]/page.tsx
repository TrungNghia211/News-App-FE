"use client";

import ArticlesByCategory from "@/app/components/ArticlesCategory/page";
import ArticlesBySubCategory from "@/app/components/ArticleSubCategoryID/page";
import Header from "@/app/components/Header";
import HotArticles from "@/app/components/HotArticles/page";
import Menu from "@/app/components/Menu";
import MenuComponent from "@/app/components/Menu/page";
import NewArticles from "@/app/components/NewArticles/page";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoryPage() {
  const params = useParams();
  const subCategoryId = decodeURIComponent(params.subCategoryId || '');
  const [subcategoryName, setSubCategoryName] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subCategoryId) {
      getSubCategoryName(subCategoryId);
      getArticlesBySubCategory(subCategoryId);
    }
  }, [subCategoryId]);

  const getSubCategoryName = async (subCategoryId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/subcategories/${subCategoryId}/`);
      if (!response.ok) {
        throw new Error("Failed to fetch subcategory name");
      }
      const data = await response.json();
      setSubCategoryName(data.sub || "Subcategory Not Found");

      // Lưu categoryId và gọi API để lấy tên category
      setCategoryId(data.category); // Lưu categoryId
      getCategoryName(data.category); // Gọi API để lấy tên category
    } catch (error) {
      console.error("Error fetching subcategory name:", error);
      setSubCategoryName("Error fetching subcategory name");
    }
  };

  const getCategoryName = async (categoryId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/categories/${categoryId}/`, {
        headers: {
          accept: "application/json",
          "X-CSRFTOKEN": "6imr23n97zdWRzTsnpFf5gSw068WAmiTlBHe6f3HHP2g38Be3SZY6cpGVuqVxsNT"
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch category name");
      }
      const data = await response.json();
      setCategoryName(data.name || "Category Not Found");
    } catch (error) {
      console.error("Error fetching category:", error);
      setCategoryName("Error fetching category");
    }
  };

  const getArticlesBySubCategory = async (subCategoryId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/articles/subcategory/${subCategoryId}/`);
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
      {/* <MenuComponent /> */}
      <Menu/>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-[0.1rem]">
        <div className="p-4 rounded-lg">
          <div>
            <NewArticles />
          </div>
        </div>
        <div className="p-4 rounded-lg col-span-2 w-full">
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold">
              {categoryName}
            </div>
            <div className="text-xl font-bold text-gray-600">
              {subcategoryName}
            </div>
          </div>
          <ArticlesBySubCategory subCategoryId={subCategoryId} />
        </div>
        <div className="p-4 rounded-lg">
          <div>
            <HotArticles />
          </div>
        </div>
      </div>

      {categoryId && (
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4 mt-4 text-center ">Bài viết Tương Tự</h1>
          <div className="max-w-screen-xl mx-auto  items-center">
            <ArticlesByCategory categoryId={categoryId} />
          </div>
        </div>
      )}
    </>
  );
}
