"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MenuComponent from "../../../../components/Menu/page";
import Header from "../../../../components/Header/page";
import CommentedForm from "../../components/page";
import { clientSessionToken } from "@/lib/http";


interface Article {
  title: string;
  content: string;
  author: string | null;
  created_date: string;
  category: string | null;
  subcategory: string | null;
  views: number;
}

const ArticleDetail = () => {
  const { id } = useParams();
  const [articleData, setArticleData] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const { title, content, author, created_date, category, subcategory, views  } = articleData || {};

  return (
    <>
      <Header />
      <MenuComponent />
      <div className="bg-gray-100 min-h-screen mt-6">
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
          <div className="flex justify-between text-sm text-gray-500">
            <span></span>
            <span>Ngày Đăng: {created_date ? new Date(created_date).toLocaleDateString() : "N/A"}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center mt-3">{title}</h1>
          <div
            className="text-lg text-gray-700 leading-relaxed mb-6"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>Lượt Xem: {views || 0}</span>
            <span>Tác Giả: {author ? author : "N/A"}</span> 
          </div>
          <div className="mt-6">
            <CommentedForm articleId={id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleDetail;
