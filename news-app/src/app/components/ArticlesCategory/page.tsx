import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Pagination } from 'antd';
import Link from 'next/link';

const { Meta } = Card;

interface Article {
  id: number;
  title: string;
  image_url: string;
}

interface ArticlesByCategoryProps {
  categoryId: number;
}

const ArticlesByCategory: React.FC<ArticlesByCategoryProps> = ({ categoryId }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/articles/category/${categoryId}/`);
        const data = await response.json();
        const activeArticles = data.filter((article) => article.active == true);
        setArticles(activeArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [categoryId]);

  const totalArticles = articles.length;
  const totalPages = Math.ceil(totalArticles / ITEMS_PER_PAGE);

  const displayedArticles = articles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div >
      <Row gutter={16} justify="start">
        {loading ? (
          <div>Loading...</div>
        ) : displayedArticles.length === 0 ? (
          <div className="flex justify-center items-center h-[300px] w-full">
            <h1 className="text-2xl">Không có bài viết</h1>
          </div>
        ) : (
          displayedArticles.map((article) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={6}
              xl={4}
              key={article.id}
              className="mb-4"
            >
              <Card
                className="w-full h-full flex flex-col justify-between"
                cover={
                  <img
                    alt={article.title}
                    src={article.image_url}
                    className="h-[180px] md:h-[200px] w-full md:w-[500px] object-cover"
                  />
                }
              >
                <Link href={`/articles/${article.id}`}>
                  <Meta
                    title={<div className="break-words">{article.title}</div>}
                  />
                </Link>
              </Card>
            </Col>
          ))
        )}
      </Row>
      {totalArticles > ITEMS_PER_PAGE && (
        <div className="flex justify-center mt-4">
          <Pagination
            current={currentPage}
            total={totalArticles}
            pageSize={ITEMS_PER_PAGE}
            onChange={setCurrentPage}
            showSizeChanger={false} 
          />
        </div>
      )}
    </div>
  );
};

export default ArticlesByCategory;
