"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const HotArticles = () => {
  const router = useRouter();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/articles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            queryCondition: {
              updatedWithin: "1 week",
            },
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch articles");

        const data = await response.json();

        const currentTime = new Date();
        const oneWeekAgo = new Date(currentTime - 7 * 24 * 60 * 60 * 1000);

        const filteredArticles = data.articles.filter((article) => {
          const updatedDate = new Date(article.updated_date);
          return updatedDate >= oneWeekAgo;
        });

        setArticles(filteredArticles);
      } catch (error) {
        console.error(error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="w-full max-w-screen-lg mx-auto p-4">
      {articles.map((article) => (
        <div key={article.id} className="my-4">
          <div className="flex flex-col justify-center">
            <h3
              className="text-lg md:text-xl font-semibold cursor-pointer mb-2 text-left"
              onClick={() => router.push(`/contents/${article.id}/`)}
            >
              {article.title}
            </h3>
          </div>
          <hr className="mt-3 w-full border-gray-300" />
        </div>
      ))}
    </div>
  );
};

export default HotArticles;
