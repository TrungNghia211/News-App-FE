import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
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

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/articles/category/${categoryId}/`);
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [categoryId]);

  const displayedArticles = articles.slice(0, 6);

  return (
    <div className="overflow-x-auto ">
      <Row gutter={16} justify="start">
        {loading ? (
          <div>Loading...</div>
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
    </div>
  );
};

export default ArticlesByCategory;
