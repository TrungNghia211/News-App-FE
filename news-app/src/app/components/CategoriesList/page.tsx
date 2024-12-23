import { useEffect, useState } from 'react';
import Link from "next/link";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/categories/', {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'X-CSRFTOKEN': 'g5TAPAEnqK0even0snQnivGAxVpKJGeRPBduvr5VnsgzvZBO9zgfwTXw7PhMNYoq',
          },
        });
        const data = await response.json();
        setCategories(data.slice(0, 9)); 
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchArticlesByCategory = async (categoryId) => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/articles/category/${categoryId}/`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'X-CSRFTOKEN': 'g5TAPAEnqK0even0snQnivGAxVpKJGeRPBduvr5VnsgzvZBO9zgfwTXw7PhMNYoq',
          },
        });
        const data = await response.json();
        
        if (Array.isArray(data)) {
          // Sắp xếp bài viết theo updated_date (từ mới nhất đến cũ nhất)
          const sortedArticles = data.sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date));
          // Lấy 5 bài viết mới nhất
          setArticles((prevArticles) => ({
            ...prevArticles,
            [categoryId]: sortedArticles.slice(0, 5), 
          }));
        } else {
          console.error('Expected an array, but got:', data);
        }
      } catch (error) {
        console.error('Error fetching articles for category:', error);
      }
    };

    categories.forEach((category) => {
      fetchArticlesByCategory(category.id);
    });
  }, [categories]);

  const chunkCategories = (categories, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < categories.length; i += chunkSize) {
      chunks.push(categories.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const rows = chunkCategories(categories, 3);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4 ml-5 text-green-500">Bài Viết Theo Danh Mục</h2>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="w-full mb-8">
          <div className="grid grid-cols-3 gap-4">
            {row.map((category) => (
              <div key={category.id} className=" p-4 rounded-lg">
                <h3 className="text-2xl mb-8 font-semibold text-center">{category.name}</h3>
                <div>
                  {articles[category.id] ? (
                    articles[category.id].map((article) => (
                        <div key={article.id} className="my-4">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-start">
                            <div className="flex flex-col col-span-3 justify-between">
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
                                        article.content.length > 270
                                        ? article.content.slice(0, 270) + "..."
                                        : article.content,
                                    }}
                                />
                                </Link>
                            </div>
                            <div className="col-span-2">
                                <Link href={`/articles/${article.id}`}>
                                    <img
                                        alt={article.title}
                                        src={article.image_url}
                                        className="h-48 w-full object-cover rounded-lg"
                                    />
                                </Link>
                                </div>
                            </div>
                        </div>
                      ))
                      
                  ) : (
                    <p>Chưa có bài viết nào</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoriesList;
