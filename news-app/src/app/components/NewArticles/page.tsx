"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../../utils/api";

interface Article {
  id: number;
  title: string;
  content: string;
  updated_date: string;
  created_date: string;
  image_url: string;
  active: boolean;
}

const NewArticles: React.FC = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data: Article[] = await apiFetch("/api/articles/all/", "GET", null, null);
        const currentTime = new Date();
        const oneWeekAgo = new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000);
        const filteredArticles = data.filter((article) => {
          const updatedDate = new Date(article.updated_date);
          return article.active === true && updatedDate >= oneWeekAgo;
        });
        const sortedArticles = filteredArticles.sort((a, b) => {
          const dateA = new Date(a.created_date);
          const dateB = new Date(b.created_date);
          return dateB.getTime() - dateA.getTime(); 
        });
        setArticles(sortedArticles.slice(0, 5)); 
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="w-full max-w-screen-sm mx-auto p-4 shadow-lg rounded-lg">
      <h2 className="text-3xl h-14 font-bold text-center  flex items-center justify-center bg-yellow-400 text-red-600
        transform transition duration-500 ease-in-out hover:scale-110 hover:text-blue-700
        hover:shadow-lg hover:shadow-blue-400">
        Tin Mới
      </h2>
      {articles.map((article) => (
        <div key={article.id} className=" shadow-lg rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="flex flex-col justify-between h-full">
              <h3
                className="text-lg md:text-xl font-semibold cursor-pointer mb-2 text-left"
                onClick={() => router.push(`/articles/${article.id}/`)}
              >
                {article.title}
              </h3>
            </div>
            <button
              className="md:ml-4 flex-shrink-0"
              onClick={() => router.push(`/articles/${article.id}/`)}
            >
              <img
                alt="avatar"
                src={article.image_url}
                className="h-40 object-cover"
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewArticles;
