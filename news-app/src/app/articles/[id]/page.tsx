"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MenuComponent from "../../components/Menu/page";
import Header from "../../components/Header/page";
import CommentedForm from "../../components/page";
import { clientSessionToken } from "@/lib/http";
import ArticlesByCategory from "@/app/components/ArticlesCategory/page";
import HotArticles from "@/app/components/HotArticles/page";
import NewArticles from "@/app/components/NewArticles/page";


interface Article {
  title: string;
  content: string;
  author: string | null;
  created_date: string;
  category_id: number | null;
  subcategory_id: number | null;
  views: number;
}

const ArticleDetail = () => {
  const { id } = useParams();
  const [articleData, setArticleData] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [subcategoryName, setSubcategoryName] = useState<string | null>(null);

  const sessionToken = clientSessionToken.value; 

  const increaseView = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/articles/${id}/increase-view/`, {
        method: "POST",
      });
      if (!response.ok) {
        console.error("Failed to increase view count.");
      }
    } catch (error) {
      console.error("Error increasing view count:", error);
    }
  };

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/articles/${id}/`);
        if (response.ok) {
          const data: Article = await response.json();
          setArticleData(data);
          increaseView(); 
        } else {
          setError("Failed to fetch article data.");
        }
      } catch (error) {
        setError("An error occurred while fetching article data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticleData();
    }
  }, [id]);

  useEffect(() => {
    if (articleData?.category_id) {
      const fetchCategoryName = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/categories/${articleData.category_id}/`);
          if (response.ok) {
            const data = await response.json();
            setCategoryName(data.name); 
          } else {
            console.error("Failed to fetch category name.");
          }
        } catch (error) {
          console.error("Error fetching category name:", error);
        }
      };

      fetchCategoryName();
    }
  }, [articleData?.category_id]);

  useEffect(() => {
    if (articleData?.subcategory_id) {
      const fetchSubcategoryName = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/subcategories/${articleData.subcategory_id}/`);
          if (response.ok) {
            const data = await response.json();
            setSubcategoryName(data.sub);
          } else {
            console.error("Failed to fetch subcategory name.");
          }
        } catch (error) {
          console.error("Error fetching subcategory name:", error);
        }
      };

      fetchSubcategoryName();
    }
  }, [articleData?.subcategory_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-6">
        <div className="w-12 h-12 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>;
  }

  const { title, content, author, created_date, category_id, subcategory_id, views  } = articleData || {};

  return (
    <>
      <Header />
      <MenuComponent />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[0.1rem]">
        <div className="p-4 rounded-lg">
          <h2 className="text-2xl font-bold text-center mt-20 text-green-500">Tin Mới</h2>
          <div>
            <NewArticles/>
          </div>
        </div>
        <div className="p-4 rounded-lg col-span-2  w-full">
        <div className=" min-h-screen mt-10 ">
        <div className="max-w-full p-6  mt-6">
          <div className="flex justify-between  font-bold mb-6">
            <span>
              <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold">
              {categoryName} 
            </div>
            <div className="text-xl font-bold text-gray-600">
              {subcategoryName} 
            </div>
          </div></span>
            <span>Ngày Đăng: {created_date ? new Date(created_date).toLocaleDateString() : "N/A"}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center mt-3">{title}</h1>
          <div
            className="text-lg text-gray-700 leading-relaxed mb-6"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <div className="flex justify-between font-bold text-gray-500">
            <span>Lượt Xem: {views || 0}</span>
            <span>Tác Giả: {author ? author : "N/A"}</span> 
          </div>
          <div className="mt-6">
            <CommentedForm articleId={id} />
          </div>
        </div>

      </div>
        </div>
        <div className="p-4 rounded-lg">
          <h2 className="text-2xl font-bold text-center text-red-600 mt-20">Tin Nổi Bật Trong Tuần</h2>
          <div>
            <HotArticles/>
          </div>
        </div>
      </div>
      {category_id && (
        <div className="">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 mt-4 text-center ">Bài viết Tương Tự</h1>
          <div className="max-w-screen-xl mx-auto  items-center">
          <ArticlesByCategory categoryId={category_id} />
          </div>
        </div>
      )}
    </>
  );
};

export default ArticleDetail;