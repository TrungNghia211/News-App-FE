"use client";

import React, { useState, useEffect } from "react";
import NewArticles from "../NewArticles/page";
import HotArticles from "../HotArticles/page";
import Link from "next/link";
import CategoriesList from "../CategoriesList/page";
import { apiFetch } from "../../../../utils/api";


const HomePage = () => {
  const [latestArticle, setLatestArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    fetchLatestArticle();
  }, []);
  
  const fetchLatestArticle = async () => {
    try {
      const response = await apiFetch(
        "/api/articles/all/",
        "GET"
      );
      const articles = response; 
      if (articles.length > 0) {
        const latest = articles.sort(
          (a, b) => new Date(b.created_date) - new Date(a.created_date)
        )[0];
        setLatestArticle(latest);
        fetchRelatedArticles(latest.category_id);
      }
    } catch (error) {
      console.error("Error fetching latest article:", error);
    }
  };
  
  const fetchRelatedArticles = async (categoryId) => {
    try {
      const response = await apiFetch(`/api/articles/category/${categoryId}/`, "GET");
  
      const articles = response; 
  
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
      const recentArticles = articles.filter((article) => {
        const updatedDate = new Date(article.updated_date);
        return updatedDate >= sevenDaysAgo;
      });
  
      const randomArticles = [];
      while (randomArticles.length < 5 && recentArticles.length > 0) {
        const randomIndex = Math.floor(Math.random() * recentArticles.length);
        randomArticles.push(recentArticles.splice(randomIndex, 1)[0]);
      }
  
      setRelatedArticles(randomArticles); 
    } catch (error) {
      console.error("Error fetching related articles:", error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[0.1rem]">
        <div className="p-4 rounded-lg border-r-2">
          <div>
            <NewArticles />
          </div>
        </div>
        <div className="p-4 rounded-lg col-span-2 w-full border-r-2">
          <div className="w-full max-w-screen-xl mx-auto p-4 shadow-lg rounded-lg p-4">
            {relatedArticles.length > 0 ? (
              relatedArticles.map((article) => (
                <div key={article.id} className="my-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start bg-gray-50 shadow-lg rounded-lg">
                    <div className="flex flex-col col-span-2 justify-between">
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
                              article.content.length > 300
                                ? article.content.slice(0, 300) + "..."
                                : article.content,
                          }}
                        />
                      </Link>
                    </div>
                    <Link href={`/articles/${article.id}`}>
                      <button className="md:ml-4 flex-shrink-0">
                        <img
                          alt={article.title}
                          src={article.image_url}
                          className="h-48 w-full object-cover rounded-lg"
                        />
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : null}
          </div>
        </div>
        <div className="p-4 rounded-lg">          
          <div>
            <HotArticles />
          </div>
        </div>
      </div>
      <CategoriesList />
    </>
  );
};

export default HomePage;

