import React, { useEffect, useState } from "react";
import { Spin, Pagination } from "antd";
import Link from "next/link";
import { apiFetch } from "../../../../utils/api";


interface Article {
  id: number;
  title: string;
  image_url: string;
  content: string;
  updated_date: string;
  active: boolean;
}

interface ArticlesBySubCategoryProps {
  subCategoryId: string;
}

const ArticlesBySubCategory: React.FC<ArticlesBySubCategoryProps> = ({ subCategoryId }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  useEffect(() => {
    if (!subCategoryId) return;
  
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const data: Article[] = await apiFetch(`/api/articles/subcategory/${subCategoryId}/`);
  
        const currentTime = new Date();
        const oneWeekAgo = new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000);
  
        const filteredArticles = data.filter((article) => {
          const updatedDate = new Date(article.updated_date);
          return article.active && updatedDate >= oneWeekAgo;
        });
  
        const sortedArticles = filteredArticles.sort((a, b) => {
          const dateA = new Date(a.updated_date);
          const dateB = new Date(b.updated_date);
          return dateB.getTime() - dateA.getTime();
        });
  
        setArticles(sortedArticles);
      } catch (err: any) {
        setError(err.message || "Failed to fetch articles.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchArticles();
  }, [subCategoryId]);
  

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const displayedArticles = articles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
    <div className="w-full max-w-screen-xl mx-auto p-4">
      {displayedArticles.map((article) => (
        <div key={article.id} className="my-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
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
      {articles.length > 10 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={articles.length}
                  onChange={handlePageChange}
                  showSizeChanger={false} 
                  showQuickJumper
                />
              </div>
            )}
    </div>
  );
};

export default ArticlesBySubCategory;
