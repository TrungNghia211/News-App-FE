import { useEffect, useState } from 'react';
import Link from "next/link";
import { apiFetch } from '../../../../utils/api';


const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiFetch('/api/categories/', 'GET', null, null);
        if (Array.isArray(data) && data.length > 0) {
          const shuffledCategories = data.sort(() => 0.5 - Math.random());
          setCategories(shuffledCategories.slice(0, 9)); 
        } else {
          console.error('No categories found or unexpected response format:', data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    fetchCategories();
  }, []); 
  
  useEffect(() => {
    const fetchArticlesByCategory = async (categoryId) => {
      try {
        const data = await apiFetch(`/api/articles/category/${categoryId}/`, 'GET', null, null);
        
        if (Array.isArray(data)) {
          const sortedArticles = data.sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date));
          setArticles((prevArticles) => ({
            ...prevArticles,
            [categoryId]: sortedArticles.slice(0, 5), 
          }));
        } else {
          console.error('Expected an array of articles, but got:', data);
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
      <h2 className="text-2xl  font-semibold mb-4 ml-5 text-green-500 ">Bài Viết Theo Danh Mục</h2>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="w-full mb-8 ">
          <div className="grid 2xl:grid-cols-3 gap-4 xl:grid-cols-1 ">
            {row.map((category) => (
              <div key={category.id} className=" p-4    ">
                <h3 className="text-2xl mb-8 font-semibold text-center">{category.name}</h3>
                <div>
                  {articles[category.id] ? (
                    articles[category.id].map((article) => (
                        <div key={article.id} className="my-4  shadow-lg rounded-lg ">
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
                                        article.content.length > 120
                                        ? article.content.slice(0, 120) + "..."
                                        : article.content,
                                    }}
                                />
                                </Link>
                            </div>
                            <div className="col-span-2 flex justify-center items-center text-center">
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
