import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  image_url: string;
  content: string;
  updated_date: string;
  active: boolean;
}

interface ArticlesByCategoryProps {
  categoryId: string;
}

const ArticlesByCategory: React.FC<ArticlesByCategoryProps> = ({ categoryId }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/articles/category/${categoryId}/`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data: Article[] = await response.json();
        const currentTime = new Date();
        const oneWeekAgo = new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000);
        const filteredArticles = data.filter((article) => {
          const updatedDate = new Date(article.updated_date);
          return article.active && updatedDate >= oneWeekAgo;
        });

        // Sắp xếp các bài viết theo updated_date từ mới nhất
        const sortedArticles = filteredArticles.sort((a, b) => {
          const dateA = new Date(a.updated_date);
          const dateB = new Date(b.updated_date);
          return dateB.getTime() - dateA.getTime(); // Sắp xếp giảm dần (mới nhất lên đầu)
        });

        setArticles(sortedArticles);
      } catch (err: any) {
        setError(err.message || "Failed to fetch articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [categoryId]);

  const displayedArticles = articles.slice(0, 10);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-40">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto p-4 shadow-lg rounded-lg">
      {displayedArticles.map((article) => (
        <div key={article.id} className="my-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start shadow-lg rounded-lg p-4">
            <div className="flex flex-col col-span-2 justify-between ">
              <Link href={`/articles/${article.id}`}>
                <h3 className="text-lg md:text-xl font-semibold cursor-pointer mb-2 text-left">
                  {article.title}
                </h3>
              </Link>
              <Link href={`/articles/${article.id}`}>
                <p
                  className="text-gray-600 text-left hover:cursor-pointer flex-grow"
                  dangerouslySetInnerHTML={{
                    __html:
                      article.content.length > 330 
                        ? article.content.slice(0, 330) + "..."
                        : article.content,
                  }}
                />
              </Link>
            </div>

            <Link href={`/articles/${article.id}`}>
              <button className="md:ml-4 flex-shrink-0">
                <img
                  alt="article"
                  src={article.image_url}
                  className="h-48 w-full object-cover"
                />
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticlesByCategory;
