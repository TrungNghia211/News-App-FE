"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Article {
  id: number;
  title: string;
  content: string;
  updated_date: string;
  image_url: string;
}

const HotArticles: React.FC = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/articles/all/",
          {
            headers: {
              accept: "application/json",
              "X-CSRFTOKEN":
                "6SRJJkQJUrxstBua8JbvrLrn0SqVwuDpu3qDApBrPimiDZLPMrIwEOdv1Qjf6HBV",
            },
          }
        );
  
        if (!response.ok) throw new Error("Failed to fetch articles");
  
        const data: Article[] = await response.json();
  
        const currentTime = new Date();
        const oneWeekAgo = new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000);
  
        const filteredArticles = data.filter((article) => {
          const updatedDate = new Date(article.updated_date);
          return article.active === true && updatedDate >= oneWeekAgo;
        });
  
        setArticles(filteredArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
  
    fetchArticles();
  }, []);
  

  return (
    <div className="w-full max-w-screen-sm mx-auto p-4">
      {articles.map((article) => (
        <div key={article.id} className="my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="flex flex-col justify-between h-full">
              <h3
                className="text-lg md:text-xl font-semibold cursor-pointer mb-2 text-left"
                onClick={() => router.push(`/articles/${article.id}/`)}
              >
                {article.title}
              </h3>
              <p
                className="text-gray-600 text-left hover:cursor-pointer flex-1"
                onClick={() => router.push(`/articles/${article.id}/`)}
                dangerouslySetInnerHTML={{
                  __html:
                    article.content.length > 120
                      ? article.content.slice(0, 120) + "..."
                      : article.content,
                }}
              />
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

export default HotArticles;
